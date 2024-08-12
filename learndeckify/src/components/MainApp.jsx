import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MainApp = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  // Handle user sign out
  const handleSignOut = async () => {
    localStorage.removeItem('authToken');
    navigate('/auth');
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle quiz generation
  const handleGenerateQuiz = async () => {
    if (!file) return;

    setLoading(true);
    setOutput('');
    setQuizData(null);
    setScore(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:5000/api/gemini/generate-quiz', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      const quiz = parseQuiz(response.data.quiz);
      setQuizData(quiz);
      setOutput('Quiz generated successfully!');
    } catch (error) {
      console.error('Error generating quiz:', error);
      setOutput('Failed to generate quiz.');
    }

    setLoading(false);
  };

  // Parse quiz data from API response
  const parseQuiz = (quizText) => {
    const questions = quizText.split('Question:').slice(1).map(q => {
      const [question, ...rest] = q.trim().split('\n');
      const options = rest.slice(0, 4).map(o => o.trim());
      const correctAnswer = rest.slice(-1)[0].split('Correct Answer: ')[1].trim();
      return { question, options, correctAnswer };
    });
    return questions;
  };

  // Handle answer selection
  const handleAnswerChange = (questionIndex, selectedOption) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  // Handle quiz submission
  const handleSubmitQuiz = () => {
    if (!quizData) return;

    let correctCount = 0;
    quizData.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correctCount += 1;
      }
    });

    const totalQuestions = quizData.length;
    const calculatedScore = (correctCount / totalQuestions) * 100;
    setScore(calculatedScore.toFixed(2));
  };

  // Handle chat message
  const handleChat = async (e) => {
    e.preventDefault();
    const userMessage = e.target.elements.chatInput.value;
    setLoading(true);
    setChatMessages(prev => [...prev, { sender: 'User', text: userMessage }]);
    e.target.reset();

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:5000/api/gemini/chat', { message: userMessage }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const botResponse = response.data.response;
      setChatMessages(prev => [...prev, { sender: 'Decky', text: botResponse }]);
    } catch (error) {
      console.error('Error generating chat response:', error);
      setChatMessages(prev => [...prev, { sender: 'Decky', text: 'Sorry, something went wrong.' }]);
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
        {/* Left Side - File Upload and Quiz Generation */}
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
                {quizData && (
                  <div className="mt-4 text-gray-700">
                    {quizData.map((question, index) => (
                      <div key={index} className="mb-6">
                        <p className="font-semibold">{index + 1}. {question.question}</p>
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex}>
                            <label>
                              <input
                                type="radio"
                                name={`question-${index}`}
                                value={option}
                                onChange={() => handleAnswerChange(index, option)}
                                className="mr-2"
                              />
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                    ))}
                    <button
                      onClick={handleSubmitQuiz}
                      className="mt-4 w-full bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                    >
                      Submit Quiz
                    </button>
                    {score !== null && (
                      <div className="mt-4">
                        <p className="text-blue-600 font-semibold">Your Score: {score}%</p>
                      </div>
                    )}
                  </div>
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
