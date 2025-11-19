
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 md:p-6">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
        AI VOICEBANK MODULE
      </h1>
      <p className="text-slate-400 max-w-2xl mx-auto">
        Craft unique vocal melodies and lifelike speech with the power of Gemini. Experiment with different voices, styles, and even singing to bring your creative ideas to life.
      </p>
    </header>
  );
};

export default Header;