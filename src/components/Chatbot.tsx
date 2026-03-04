import { useState } from 'react';
import { chatWithBot } from '../services/geminiService';

export default function Chatbot() {
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'bot'}[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    const userMsg = { text: input, sender: 'user' as const };
    setMessages([...messages, userMsg]);
    setInput('');
    
    const response = await chatWithBot(input, messages);
    setMessages(prev => [...prev, { text: response || "", sender: 'bot' }]);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md h-96 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Chat with the Storyteller</h2>
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-xl ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-stone-100'}`}>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 border rounded-xl p-2" placeholder="Ask a question..." />
        <button onClick={handleSend} className="bg-stone-900 text-white px-4 py-2 rounded-xl">Send</button>
      </div>
    </div>
  );
}
