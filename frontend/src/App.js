import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import ChatIntake from "./components/ChatIntake";
import GiftRecommendations from "./components/GiftRecommendations";
import MemoryBox from "./components/MemoryBox";
import EnhancedMemoryBox from "./components/EnhancedMemoryBox";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [currentStep, setCurrentStep] = useState('landing');
  const [chatAnswers, setChatAnswers] = useState({});
  const [showMemoryBox, setShowMemoryBox] = useState(false);

  const handleStartQuiz = () => {
    setCurrentStep('chat');
  };

  const handleChatComplete = (answers) => {
    setChatAnswers(answers);
    setCurrentStep('recommendations');
  };

  const handleBackToLanding = () => {
    setCurrentStep('landing');
    setChatAnswers({});
  };

  const handleBackToChat = () => {
    setCurrentStep('chat');
  };

  const handleOpenMemoryBox = () => {
    setShowMemoryBox(true);
  };

  const handleCloseMemoryBox = () => {
    setShowMemoryBox(false);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'landing':
        return <LandingPage onStartQuiz={handleStartQuiz} />;
      case 'chat':
        return (
          <ChatIntake 
            onComplete={handleChatComplete}
            onBack={handleBackToLanding}
          />
        );
      case 'recommendations':
        return (
          <GiftRecommendations 
            answers={chatAnswers}
            onBack={handleBackToChat}
            onOpenMemoryBox={handleOpenMemoryBox}
          />
        );
      default:
        return <LandingPage onStartQuiz={handleStartQuiz} />;
    }
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <>
              {renderCurrentStep()}
              <EnhancedMemoryBox 
                isOpen={showMemoryBox}
                onClose={handleCloseMemoryBox}
              />
              <Toaster />
            </>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
