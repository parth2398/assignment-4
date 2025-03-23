import ChatInterface from '@/components/ChatInterface';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen py-8 px-4 bg-white">
      <div className="max-w-4xl mx-auto bg-white">
        <div className="text-center mb-8 bg-white">
          <Image 
            src="/gemini-logo.svg" 
            alt="Gemini Logo" 
            width={220} 
            height={64}
            priority
          />
        </div>
        
        <ChatInterface />
        
        <footer className="mt-8 text-center text-xs text-gray-400 bg-white">
          <p>
            Note: You need to provide your own Gemini API key in the .env.local file.
            Get your API key from{' '}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Google AI Studio
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
