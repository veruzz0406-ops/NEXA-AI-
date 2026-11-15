const API_BASE = '/api';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    console.warn('Health check failed:', err);
    return { status: 'offline' };
  }
}

export async function fetchChats() {
  try {
    const res = await fetch(`${API_BASE}/chats`);
    if (!res.ok) throw new Error('Failed to fetch chats');
    return await res.json();
  } catch (err) {
    console.error('Fetch chats error:', err);
    return [];
  }
}

export async function createChat(chatData) {
  const res = await fetch(`${API_BASE}/chats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(chatData),
  });
  if (!res.ok) throw new Error('Failed to create chat');
  return await res.json();
}

export async function updateChat(id, updates) {
  const res = await fetch(`${API_BASE}/chats/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update chat');
  return await res.json();
}

export async function deleteChat(id) {
  const res = await fetch(`${API_BASE}/chats/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete chat');
  return await res.json();
}

export async function toggleStarChat(id) {
  const res = await fetch(`${API_BASE}/chats/${id}/star`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to toggle star');
  return await res.json();
}

export async function clearAllChats() {
  const res = await fetch(`${API_BASE}/chats`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to clear chats');
  return await res.json();
}

/**
 * Stream chat completion using Server-Sent Events (SSE)
 */
export async function streamChatCompletion({
  chatId,
  messages,
  apiKey,
  model,
  temperature,
  systemInstruction,
  onChunk,
  onDone,
  onError,
}) {
  try {
    const res = await fetch(`${API_BASE}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chatId,
        messages,
        apiKey,
        model,
        temperature,
        systemInstruction,
      }),
    });

    if (!res.ok) {
      throw new Error(`Server returned ${res.status}: ${res.statusText}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let fullResponse = '';

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
            const data = JSON.parse(jsonStr);
            if (data.chunk) {
              fullResponse += data.chunk;
              onChunk(data.chunk, fullResponse);
            }
            if (data.done) {
              if (onDone) onDone(data.fullResponse || fullResponse);
            }
            if (data.error) {
              if (onError) onError(new Error(data.error));
            }
          } catch (e) {
            console.warn('JSON stream parse warning:', e);
          }
        }
      }
    }

    if (onDone && fullResponse) {
      onDone(fullResponse);
    }
  } catch (err) {
    console.error('Stream completion failed:', err);
    if (onError) onError(err);
  }
}
