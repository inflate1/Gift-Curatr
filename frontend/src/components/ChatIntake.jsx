import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, MessageCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { chatQuestions } from '../mockData';
import RecipientSelector from './RecipientSelector';

const ChatIntake = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [showRecipientSelector, setShowRecipientSelector] = useState(true);

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);
    
    setIsAnimating(true);
    
    setTimeout(() => {
      if (currentQuestion < chatQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // All questions answered, proceed to recommendations
        onComplete({ ...newAnswers, recipient: selectedRecipient });
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleRecipientSelect = (recipient) => {
    setSelectedRecipient(recipient);
    setShowRecipientSelector(false);
  };

  const handleRecipientCreate = (recipient) => {
    setSelectedRecipient(recipient);
    setShowRecipientSelector(false);
  };

  const handleBack = () => {
    if (showRecipientSelector) {
      onBack();
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      setShowRecipientSelector(true);
    }
  };

  const progress = showRecipientSelector ? 0 : ((currentQuestion + 1) / (chatQuestions.length + 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-purple-600" />
            <span className="font-medium text-gray-700">
              {currentQuestion + 1} of {chatQuestions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Question */}
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
            <div className="mb-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-2xl rounded-tl-none px-6 py-4 shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {chatQuestions[currentQuestion].question}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Select one option to continue
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {chatQuestions[currentQuestion].options.map((option, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 hover:border-purple-200 ${
                    answers[currentQuestion] === option 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => handleAnswer(option)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium text-gray-700">
                        {option}
                      </span>
                      {answers[currentQuestion] === option && (
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Next Button (only show if current question is answered) */}
            {answers[currentQuestion] && (
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={() => handleAnswer(answers[currentQuestion])}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  {currentQuestion === chatQuestions.length - 1 ? 'See My Gifts' : 'Next Question'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary of previous answers */}
      {currentQuestion > 0 && (
        <div className="px-6 pb-8">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-700 mb-3">Your answers so far:</h3>
                <div className="space-y-2">
                  {Object.entries(answers).map(([questionIndex, answer]) => (
                    <div key={questionIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="font-medium mr-2">Q{parseInt(questionIndex) + 1}:</span>
                      <span>{answer}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatIntake;