// src/components/HeroSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import gmailIcon from '../assets/gmail-icon.png';
import youtubeIcon from '../assets/youtube-icon.png';
import instagramIcon from '../assets/instagram-icon.png';
import tiktokIcon from '../assets/tiktok-icon.png';
import aiChatBotIcon from '../assets/ai-chat-bot-icon.png'; // Example AI Chat Bot icon
import quizIcon from '../assets/quiz-icon.png'; // Example Quiz icon
import videoIcon from '../assets/video-icon.png'; // Example Interactive Video icon

const HeroSection = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/auth');
  };

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen flex flex-col items-center py-10 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-400 to-red-500 opacity-20 pointer-events-none"></div>
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold text-white mb-2">Learndeckify</h1>
        <p className="text-xl text-white mb-4">Transform your presentations into interactive learning videos with Learndeckify. Personalized, Fast & Free</p>
        <div className="flex justify-center space-x-4 mb-8">
          <button className="bg-white text-purple-600 font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-purple-100 transition duration-300" onClick={handleSignUp}>Sign up for free</button>
          <button className="border border-white text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-white hover:text-purple-600 transition duration-300">Add to Chrome - Coming soon</button>
        </div>
        <div className="flex justify-center mb-8">
          <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg shadow-2xl rounded-lg p-6 max-w-4xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold text-purple-600 mb-4">Why These Tools Suck for Learning</h2>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-2">
                    <img src={gmailIcon} alt="Gmail" className="w-8 h-8" />
                    <span className="text-purple-600 font-semibold">Gmail - Too many distractions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <img src={tiktokIcon} alt="TikTok" className="w-8 h-8" />
                    <span className="text-purple-600 font-semibold">TikTok - Endless scrolling, no learning</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <img src={instagramIcon} alt="Instagram" className="w-8 h-8" />
                    <span className="text-purple-600 font-semibold">Instagram - Only for selfies</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <img src={youtubeIcon} alt="YouTube" className="w-8 h-8" />
                    <span className="text-purple-600 font-semibold">YouTube - Ads and rabbit holes</span>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-purple-600 mb-4">Why These Tools Rock for Learning</h2>
                <ul className="space-y-4">
                  <li className="flex items-center space-x-2">
                    <img src={quizIcon} alt="Quizzes" className="w-8 h-8" />
                    <span className="text-purple-600 font-semibold">Quizzes - Test your knowledge</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <img src={videoIcon} alt="Interactive Videos" className="w-8 h-8" />
                    <span className="text-purple-600 font-semibold">Interactive Videos - Engaging content</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <img src={aiChatBotIcon} alt="AI Chat Bot" className="w-8 h-8" />
                    <span className="text-purple-600 font-semibold">AI Chat Bot - Personalized assistance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full overflow-hidden relative">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Popular Subjects</h2>
        <div className="w-full py-4 px-8 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg">
          <div className="flex space-x-6 animate-marquee">
            <div className="flex-none text-purple-600 font-semibold">Math 101</div>
            <div className="flex-none text-purple-600 font-semibold">Biology 202</div>
            <div className="flex-none text-purple-600 font-semibold">History 303</div>
            <div className="flex-none text-purple-600 font-semibold">Physics 404</div>
            <div className="flex-none text-purple-600 font-semibold">Chemistry 505</div>
            <div className="flex-none text-purple-600 font-semibold">Art History</div>
            <div className="flex-none text-purple-600 font-semibold">Political Science</div>
            <div className="flex-none text-purple-600 font-semibold">Computer Science (CS50)</div>
            <div className="flex-none text-purple-600 font-semibold">Psychology of Memes</div>
            <div className="flex-none text-purple-600 font-semibold">Sociology of Social Media</div>
            <div className="flex-none text-purple-600 font-semibold">Economics of Free Apps</div>
            <div className="flex-none text-purple-600 font-semibold">Philosophy of Procrastination</div>
            <div className="flex-none text-purple-600 font-semibold">Linguistics of Emojis</div>
            <div className="flex-none text-purple-600 font-semibold">Anthropology of Netflix</div>
            <div className="flex-none text-purple-600 font-semibold">Astronomy 101</div>
            <div className="flex-none text-purple-600 font-semibold">Geography of Imaginary Places</div>
            <div className="flex-none text-purple-600 font-semibold">Literature of Fantasy Worlds</div>
            <div className="flex-none text-purple-600 font-semibold">Environmental Science</div>
            <div className="flex-none text-purple-600 font-semibold">Music Theory of Pop Songs</div>
            <div className="flex-none text-purple-600 font-semibold">Theater Arts</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
