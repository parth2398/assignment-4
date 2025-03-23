'use client';

import { useState } from 'react';

interface ChatEntry {
  type: 'prompt' | 'response';
  content: string;
}

export default function ChatInterface() {
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    const currentPrompt = prompt.trim();
    setIsLoading(true);
    setPrompt('');
    
    // Clear previous history and just add the current prompt
    setChatHistory([{ type: 'prompt', content: currentPrompt }]);
    
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentPrompt }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate response');
      }
      
      // Update history to include just current prompt and response (limit to 2 entries)
      setChatHistory([
        { type: 'prompt', content: currentPrompt },
        { type: 'response', content: data.response }
      ]);
    } catch (error) {
      console.error('Error getting response:', error);
      // Update history with error (still limited to 2 entries)
      setChatHistory([
        { type: 'prompt', content: currentPrompt },
        { type: 'response', content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setPrompt('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white">
      {/* Prompt Section */}
      <div className="mb-6">
        <div className="border border-gray-300 rounded-md p-0 bg-white">
          <div className="p-4 bg-white">
            <div className="font-medium text-gray-700 mb-2">Prompt:</div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="w-full border-none p-0 resize-none focus:outline-none focus:ring-0 bg-white text-black"
              placeholder="Type your prompt here..."
            />
          </div>
        </div>
        
        <div className="flex justify-center space-x-6 mt-6">
          <button
            onClick={handleSend}
            disabled={isLoading || !prompt.trim()}
            className="px-16 py-3 bg-[#2d5986] text-white rounded-md hover:bg-[#1e3d5a] disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
          <button
            onClick={handleCancel}
            className="px-16 py-3 bg-[#2d5986] text-white rounded-md hover:bg-[#1e3d5a]"
          >
            Cancel
          </button>
        </div>
      </div>
      
      {/* Response Section */}
      <div className="border border-gray-300 rounded-md p-0 bg-white">
        <div className="p-4 bg-white">
          <div className="font-medium text-gray-700 mb-2">Response:</div>
          <div className="min-h-[200px] max-h-[500px] overflow-y-auto bg-white">
            {chatHistory.length === 0 ? (
              <div className="text-gray-500">Response will appear here...</div>
            ) : (
              <div className="space-y-4">
                {chatHistory.map((entry, index) => (
                  <div key={index} className="text-black">
                    <div className="font-semibold">
                      {entry.type === 'prompt' ? 'You:' : 'Gemini:'}
                    </div>
                    <div className="whitespace-pre-wrap pl-4 py-1">
                      {entry.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {isLoading && (
              <div className="mt-4">
                <div className="font-semibold text-black">Gemini:</div>
                <div className="whitespace-pre-wrap pl-4 py-1 text-gray-500">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 