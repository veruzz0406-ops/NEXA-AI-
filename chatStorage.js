import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'chats.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultInitialChats = [
  {
    id: 'demo-welcome-1',
    title: 'Quantum Computing Fundamentals',
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    starred: true,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Can you explain quantum superposition and how qubits differ from classical bits?',
        timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `### Understanding Quantum Superposition & Qubits

At the heart of quantum computing lies a fundamental departure from classical digital logic. Here is how they compare:

#### 1. Classical Bits vs. Qubits
* **Classical Bit**: Represents either a deterministic state **\`0\`** or **\`1\`**. Physically represented by electrical voltage levels or magnetic polarization.
* **Qubit (Quantum Bit)**: Can exist in a linear combination (superposition) of state $|0\\rangle$ and state $|1\\rangle$:

$$\\lvert\\psi\\rangle = \\alpha\\lvert 0\\rangle + \\beta\\lvert 1\\rangle$$

Where $\\alpha$ and $\\beta$ are complex probability amplitudes such that:
$$|\\alpha|^2 + |\\beta|^2 = 1$$

#### 2. Why Superposition Matters
In an $N$-qubit system, the computer can represent $2^N$ states simultaneously. For example:
- **3 classical bits** store 1 of 8 possibilities at any given time.
- **3 quantum bits** store a superposition of **all 8 possibilities simultaneously**.

#### 3. Python Simulation with Qiskit
Here is a minimal quantum circuit creating a Bell state (entanglement with superposition):

\`\`\`python
from qiskit import QuantumCircuit, Aer, execute

# Create a circuit with 2 qubits and 2 classical bits
qc = QuantumCircuit(2, 2)

# Apply a Hadamard gate to qubit 0 (puts it in superposition)
qc.h(0)

# Entangle qubit 0 and qubit 1 with a CNOT gate
qc.cx(0, 1)

# Measure qubits
qc.measure([0, 1], [0, 1])
print("Quantum Circuit Constructed Successfully!")
\`\`\`

Would you like to explore **quantum entanglement** or **Shor's algorithm** next?`,
        timestamp: new Date(Date.now() - 3600 * 1000 * 2 + 1500).toISOString(),
      },
    ],
  },
  {
    id: 'demo-welcome-2',
    title: 'FastAPI vs Express Architecture',
    createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
    starred: false,
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content: 'Compare FastAPI and Express.js for building scalable microservices.',
        timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: `### FastAPI vs. Express.js: Architectural Comparison

| Dimension | **FastAPI (Python)** | **Express.js (Node.js)** |
| :--- | :--- | :--- |
| **Execution Model** | ASGI async (Starlette + Uvicorn) | Event-driven single-threaded event loop |
| **Type Validation** | Automatic via Pydantic & Python type hints | Manual or via Zod/Joi middleware |
| **API Docs** | Built-in interactive Swagger UI & ReDoc | Requires external plugins (swagger-ui-express) |
| **Ecosystem** | Python ML/AI, PyTorch, NumPy native | Huge npm ecosystem, universal JS/TS |

Both are superb choices; choose **FastAPI** when your backend serves ML inference, and **Express** for rapid full-stack Node.js environments.`,
        timestamp: new Date(Date.now() - 3600 * 1000 * 24 + 1200).toISOString(),
      },
    ],
  },
];

class ChatStorage {
  constructor() {
    this.chats = [];
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.chats = JSON.parse(raw);
      } else {
        this.chats = defaultInitialChats;
        this.save();
      }
    } catch (err) {
      console.error('Failed to load chats from disk:', err);
      this.chats = defaultInitialChats;
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.chats, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save chats to disk:', err);
    }
  }

  getAll() {
    return this.chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  getById(id) {
    return this.chats.find((c) => c.id === id);
  }

  create(data) {
    const newChat = {
      id: data.id || `chat-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: data.title || 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      starred: false,
      messages: data.messages || [],
    };
    this.chats.unshift(newChat);
    this.save();
    return newChat;
  }

  update(id, updates) {
    const index = this.chats.findIndex((c) => c.id === id);
    if (index === -1) return null;

    this.chats[index] = {
      ...this.chats[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.chats[index];
  }

  addMessage(id, message) {
    let chat = this.getById(id);
    if (!chat) {
      chat = this.create({ id, title: message.content.slice(0, 36) + '...' });
    }

    const messageWithId = {
      id: message.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      role: message.role,
      content: message.content,
      timestamp: new Date().toISOString(),
    };

    chat.messages.push(messageWithId);
    chat.updatedAt = new Date().toISOString();

    // Automatically set a sensible title from the first user message if title is default
    if (chat.messages.length === 1 && message.role === 'user') {
      const clean = message.content.trim().replace(/[#*`\n]/g, ' ');
      chat.title = clean.length > 40 ? clean.substring(0, 37) + '...' : clean;
    }

    this.save();
    return { chat, message: messageWithId };
  }

  toggleStar(id) {
    const chat = this.getById(id);
    if (!chat) return null;
    chat.starred = !chat.starred;
    this.save();
    return chat;
  }

  delete(id) {
    const prevLen = this.chats.length;
    this.chats = this.chats.filter((c) => c.id !== id);
    if (this.chats.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }

  clearAll() {
    this.chats = [];
    this.save();
    return true;
  }
}

export const chatStorage = new ChatStorage();
