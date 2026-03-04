/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { generateStory } from './services/geminiService';
import StoryViewer from './components/StoryViewer';
import Chatbot from './components/Chatbot';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const [hasKey, setHasKey] = useState(false);
  const [story, setStory] = useState<any[] | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkKey() {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    await window.aistudio.openSelectKey();
    setHasKey(true); // Assume success
  };

  const handleGenerateStory = async () => {
    setLoading(true);
    const storyData = await generateStory(prompt);
    setStory(storyData);
    setLoading(false);
  };

  if (!hasKey) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-stone-100 p-4">
        <h1 className="text-4xl font-bold mb-4 text-stone-900">Storybook Adventures</h1>
        <p className="text-stone-600 mb-8 text-center max-w-md">
          To get started, please select your paid Google Cloud API key. 
          <br />
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Learn more about billing
          </a>
        </p>
        <button
          onClick={handleSelectKey}
          className="bg-stone-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-stone-800 transition-colors"
        >
          Select API Key
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-stone-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-stone-900">Storybook Adventures</h1>
      <div className="flex gap-4 mb-8">
        <input value={prompt} onChange={e => setPrompt(e.target.value)} className="flex-1 border rounded-xl p-4" placeholder="Enter a story idea..." />
        <button onClick={handleGenerateStory} className="bg-stone-900 text-white px-6 py-3 rounded-xl font-medium">Generate Story</button>
      </div>
      {loading && <p>Generating story...</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {story && <StoryViewer story={story} />}
        <Chatbot />
      </div>
    </div>
  );
}
