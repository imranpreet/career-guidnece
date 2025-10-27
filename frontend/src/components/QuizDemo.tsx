import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: "What is the primary benefit of using microservices architecture?",
    options: [
      "Faster deployment of individual services",
      "Reduced code complexity",
      "Lower infrastructure costs", 
      "Simpler debugging process"
    ],
    correctAnswer: 0,
    explanation: "Microservices allow teams to deploy individual services independently, enabling faster releases and better scalability."
  },
  {
    id: 2,
    question: "Which soft skill is most valued by employers in 2024?",
    options: [
      "Public speaking",
      "Adaptability and learning agility",
      "Time management",
      "Networking"
    ],
    correctAnswer: 1,
    explanation: "In our rapidly changing work environment, the ability to adapt and learn new skills quickly is highly valued by employers."
  }
];

const QuizDemo: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (selectedAnswer === sampleQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
  };

  if (showResult) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quiz Complete!</h3>
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-indigo-600 mb-2">
            {score}/{sampleQuestions.length}
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            {score === sampleQuestions.length 
              ? "Perfect! You're well-prepared for interviews."
              : score >= sampleQuestions.length / 2 
              ? "Good job! Keep practicing to improve further."
              : "Keep studying! Practice makes perfect."
            }
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          {sampleQuestions.map((question, index) => (
            <div key={question.id} className="bg-white dark:bg-gray-800 p-4 rounded border">
              <div className="flex items-start">
                {answers[index] === question.correctAnswer ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{question.question}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={resetQuiz}
          className="btn-primary w-full"
        >
          Try Again
        </button>
      </div>
    );
  }

  const question = sampleQuestions[currentQuestion];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestion + 1} of {sampleQuestions.length}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Score: {score}/{currentQuestion}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / sampleQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {question.question}
      </h3>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedAnswer === index
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                selectedAnswer === index 
                  ? 'border-indigo-600 bg-indigo-600' 
                  : 'border-gray-300 dark:border-gray-500'
              }`}>
                {selectedAnswer === index && (
                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                )}
              </div>
              <span className="text-gray-900 dark:text-white">{option}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleNextQuestion}
        disabled={selectedAnswer === null}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {currentQuestion < sampleQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
      </button>
    </div>
  );
};

export default QuizDemo;