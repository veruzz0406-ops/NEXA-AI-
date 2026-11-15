import dotenv from 'dotenv';
import { spawn } from 'child_process';
import fs from 'fs';
dotenv.config();

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const AGY_PATH = 'C:\\Users\\Lenovo\\.gemini\\bin\\agy.exe';

/**
 * Call local Google Gemini via agy CLI (built-in authenticated engine)
 */
function queryAgyCli({ prompt, onChunk }) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(AGY_PATH)) {
      return reject(new Error('agy CLI executable not found'));
    }

    const child = spawn(AGY_PATH, ['-p', prompt], {
      windowsHide: true,
      env: { ...process.env },
    });

    let fullText = '';
    let errorText = '';

    child.stdout.on('data', (data) => {
      const chunk = data.toString();
      fullText += chunk;
      if (onChunk) {
        onChunk(chunk);
      }
    });

    child.stderr.on('data', (data) => {
      errorText += data.toString();
    });

    child.on('error', (err) => {
      reject(err);
    });

    child.on('close', (code) => {
      if (code === 0 || fullText.trim().length > 0) {
        resolve(fullText.trim());
      } else {
        reject(new Error(`agy CLI exited with code ${code}: ${errorText}`));
      }
    });
  });
}

/**
 * Build a structured contextual prompt from messages array
 */
function buildContextualPrompt(messages, systemInstruction) {
  const persona =
    systemInstruction ||
    'You are NEXA AI, a brilliant, articulate, and accurate conversational intelligence assistant. Answer questions directly, correctly, and thoroughly. Format your output with clear markdown headings, lists, tables, and syntax-highlighted code blocks where appropriate.';

  let prompt = `${persona}\n\n`;

  // Take recent turns (up to 8 messages) for rich context
  const recentMessages = messages.slice(-8);

  for (const msg of recentMessages) {
    const roleName = msg.role === 'assistant' ? 'Nexa AI' : 'User';
    prompt += `[${roleName}]: ${msg.content}\n`;
  }

  prompt += `\n[Nexa AI]:`;
  return prompt;
}

/**
 * Fallback static responses if both online and CLI are unavailable
 */
function generateOfflineResponse(prompt) {
  return `### NEXA AI Response

Thank you for your question: **"${prompt}"**

NEXA AI is designed for high-precision real-time reasoning. For live generation, please ensure your environment is running or configure your Google Gemini API key in **Settings (gear icon)**.`;
}

/**
 * Main chat generation & streaming handler
 */
export async function streamGeminiChat({
  messages,
  apiKey,
  model = DEFAULT_MODEL,
  temperature = 0.7,
  systemInstruction,
  onChunk,
}) {
  const activeKey = apiKey || process.env.GEMINI_API_KEY;

  // 1. If explicit Gemini API Key is configured, use the official Gemini API
  if (activeKey) {
    try {
      const contents = [];
      for (const msg of messages) {
        if (msg.role === 'system') continue;
        const role = msg.role === 'assistant' ? 'model' : 'user';

        const parts = [];
        if (msg.fileData && msg.fileData.data) {
          parts.push({
            inlineData: {
              mimeType: msg.fileData.mimeType,
              data: msg.fileData.data,
            },
          });
        }
        parts.push({ text: msg.content || '' });
        contents.push({ role, parts });
      }

      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${activeKey}`;

      const payload = {
        contents,
        generationConfig: {
          temperature: parseFloat(temperature) || 0.7,
          maxOutputTokens: 2048,
        },
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API Error (${response.status}): ${errText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const candidates = parsed.candidates || [];
              if (candidates[0]?.content?.parts) {
                for (const part of candidates[0].content.parts) {
                  if (part.text) {
                    accumulatedText += part.text;
                    onChunk(part.text);
                  }
                }
              }
            } catch (e) {
              // Ignore partial chunk parse warnings
            }
          }
        }
      }

      return accumulatedText;
    } catch (apiErr) {
      console.warn('Direct Gemini API call failed, attempting local engine:', apiErr.message);
    }
  }

  // 2. Query through authenticated local Gemini engine (agy CLI)
  try {
    const contextualPrompt = buildContextualPrompt(messages, systemInstruction);
    const result = await queryAgyCli({
      prompt: contextualPrompt,
      onChunk: (chunk) => {
        onChunk(chunk);
      },
    });
    return result;
  } catch (cliErr) {
    console.warn('Local engine query failed, falling back:', cliErr.message);
  }

  // 3. Last fallback if both are unavailable
  const lastUserMsg = messages.filter((m) => m.role === 'user').slice(-1)[0];
  const promptText = lastUserMsg ? lastUserMsg.content : 'Hello';
  const fallbackText = generateOfflineResponse(promptText);

  const words = fallbackText.split(/(\s+)/);
  for (const word of words) {
    onChunk(word);
    await new Promise((r) => setTimeout(r, 20));
  }
  return fallbackText;
}
