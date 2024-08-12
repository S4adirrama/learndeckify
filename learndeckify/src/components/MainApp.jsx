import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MainApp = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/auth');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleGenerateVideo = async () => {
    if (!file) return;

    setLoading(true);
    setOutput('');
    setVideoLink('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:5000/api/gemini/generate-video', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Create a download link for the generated video
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setVideoLink(url);
      setOutput('Video generated successfully!');
    } catch (error) {
      console.error('Error generating video:', error);
      setOutput('Failed to generate video.');
    }

    setLoading(false);
  };

  const handleGenerateQuiz = async () => {
    if (!file) return;

    setLoading(true);
    setOutput('');
    setQuiz('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:5000/api/gemini/generate-quiz', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setQuiz(response.data.quiz);
      setOutput('Quiz generated successfully!');
    } catch (error) {
      console.error('Error generating quiz:', error);
      setOutput('Failed to generate quiz.');
    }

    setLoading(false);
  };

  const handleChat = async (e) => {
    e.preventDefault();
    const userMessage = e.target.elements.chatInput.value;
    setLoading(true);
    setChatMessages((prev) => [...prev, { sender: 'User', text: userMessage }]);
    e.target.reset();

    try {
      const response = await axios.post('http://localhost:5000/api/gemini/chat', { message: userMessage });
      const botResponse = response.data.response;
      setChatMessages((prev) => [...prev, { sender: 'Decky', text: botResponse }]);
    } catch (error) {
      console.error('Error generating chat response:', error);
      setChatMessages((prev) => [...prev, { sender: 'Decky', text: 'Sorry, something went wrong.' }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center bg-purple-600 text-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold">Learndeckify</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition duration-300"
        >
          Sign Out
        </button>
      </header>

      <div className="flex flex-col lg:flex-row justify-between items-start w-full max-w-6xl mx-auto py-10 space-y-8 lg:space-y-0 lg:space-x-8">
        {/* Left Side - File Upload and Video Generation */}
        <div className="flex flex-col w-full lg:w-1/2 space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Upload PDF or PPT</h2>
            <div className="border border-dashed border-gray-400 rounded-lg h-40 flex items-center justify-center mb-4">
              <input type="file" onChange={handleFileChange} className="hidden" id="fileInput" />
              <label htmlFor="fileInput" className="cursor-pointer text-gray-600">
                {file ? file.name : 'Drag and drop your presentation here or click to upload'}
              </label>
            </div>
            <button
              onClick={handleGenerateVideo}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
            >
              {loading ? (
                <span className="animate-spin border-4 border-white border-t-transparent rounded-full w-5 h-5 inline-block"></span>
              ) : (
                'Generate Video'
              )}
            </button>
            {output && (
              <div className="mt-4">
                <p className="text-green-600 font-semibold mb-2">{output}</p>
                {videoLink && (
                  <div className="mt-4">
                    <a href={videoLink} download="generated_video.mp4" className="text-blue-600 underline">
                      Download your video
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">AI-Generated Quizzes</h2>
            <button
              onClick={handleGenerateQuiz}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
            >
              {loading ? (
                <span className="animate-bounce">Generating...</span>
              ) : (
                'Generate Quiz'
              )}
            </button>
            {output && (
              <div className="mt-4">
                <p className="text-green-600 font-semibold mb-2">{output}</p>
                {quiz && (
                  <div className="mt-4 text-gray-700 whitespace-pre-line">{quiz}</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Chat Bot */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-full lg:w-1/2">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Decky - AI tutor</h2>
          <div className="h-64 overflow-y-scroll mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
            {chatMessages.length === 0 && (
              <p className="text-gray-500">Your conversation will appear here.</p>
            )}
            {chatMessages.map((msg, index) => (
              <div key={index} className={`mb-4 flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs p-4 rounded-lg shadow-md ${msg.sender === 'User' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  <p className="text-xs font-semibold mb-1">{msg.sender}</p>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleChat} className="space-y-4">
            <input
              name="chatInput"
              type="text"
              placeholder="Ask Decky a question..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Generating...</span>
              ) : (
                'Ask'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MainApp;
