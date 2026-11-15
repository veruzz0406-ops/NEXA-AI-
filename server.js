import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { chatStorage } from './chatStorage.js';
import { streamGeminiChat } from './geminiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'NEXA AI Backend',
    version: '2.0.0',
    hasEnvApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    timestamp: new Date().toISOString(),
  });
});

// Chat Management Endpoints
app.get('/api/chats', (req, res) => {
  try {
    const chats = chatStorage.getAll();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/chats/:id', (req, res) => {
  const chat = chatStorage.getById(req.params.id);
  if (!chat) return res.status(404).json({ error: 'Chat not found' });
  res.json(chat);
});

app.post('/api/chats', (req, res) => {
  try {
    const newChat = chatStorage.create(req.body);
    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/chats/:id', (req, res) => {
  const updated = chatStorage.update(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Chat not found' });
  res.json(updated);
});

app.delete('/api/chats/:id', (req, res) => {
  const success = chatStorage.delete(req.params.id);
  if (!success) return res.status(404).json({ error: 'Chat not found' });
  res.json({ success: true, message: 'Chat deleted' });
});

app.post('/api/chats/:id/star', (req, res) => {
  const updated = chatStorage.toggleStar(req.params.id);
  if (!updated) return res.status(404).json({ error: 'Chat not found' });
  res.json(updated);
});

app.delete('/api/chats', (req, res) => {
  chatStorage.clearAll();
  res.json({ success: true, message: 'All chats cleared' });
});

// Real-Time Streaming Chat Endpoint (Server-Sent Events)
app.post('/api/chat/stream', async (req, res) => {
  const {
    chatId,
    messages,
    apiKey,
    model,
    temperature,
    systemInstruction,
  } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  // Set headers for SSE streaming
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  let assistantContent = '';

  try {
    // If a chatId is provided, record user's latest message
    const lastUserMessage = messages[messages.length - 1];
    if (chatId && lastUserMessage.role === 'user') {
      chatStorage.addMessage(chatId, lastUserMessage);
    }

    await streamGeminiChat({
      messages,
      apiKey,
      model,
      temperature,
      systemInstruction,
      onChunk: (chunk) => {
        assistantContent += chunk;
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      },
    });

    // Save final assistant message to chat storage
    if (chatId) {
      chatStorage.addMessage(chatId, {
        role: 'assistant',
        content: assistantContent,
      });
    }

    res.write(`data: ${JSON.stringify({ done: true, fullResponse: assistantContent })}\n\n`);
    res.end();
  } catch (error) {
    console.error('Error during streaming:', error);
    res.write(`data: ${JSON.stringify({ error: error.message || 'Generation error' })}\n\n`);
    res.end();
  }
});

// Non-streaming fallback chat endpoint
app.post('/api/chat', async (req, res) => {
  const { chatId, messages, apiKey, model, temperature, systemInstruction } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' });
  }

  let fullResponse = '';
  try {
    const lastUserMessage = messages[messages.length - 1];
    if (chatId && lastUserMessage?.role === 'user') {
      chatStorage.addMessage(chatId, lastUserMessage);
    }

    await streamGeminiChat({
      messages,
      apiKey,
      model,
      temperature,
      systemInstruction,
      onChunk: (chunk) => {
        fullResponse += chunk;
      },
    });

    let savedChat = null;
    if (chatId) {
      const result = chatStorage.addMessage(chatId, {
        role: 'assistant',
        content: fullResponse,
      });
      savedChat = result.chat;
    }

    res.json({
      role: 'assistant',
      content: fullResponse,
      chat: savedChat,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve frontend build if present
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.send(`
        <html>
          <body style="background:#070813;color:#e9d5ff;font-family:sans-serif;padding:40px;text-align:center;">
            <h1>NEXA AI Backend Running</h1>
            <p>API endpoints are active at <code>/api/...</code></p>
            <p>To preview frontend during development, run <code>npm run dev:client</code> on port 3000, or build with <code>npm run build:client</code>.</p>
          </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 NEXA AI Server active on http://localhost:${PORT}`);
  console.log(`🔮 Google Gemini Model: ${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}`);
  console.log(`🔑 API Key configured in .env: ${Boolean(process.env.GEMINI_API_KEY)}`);
  console.log(`===============================================`);
});
