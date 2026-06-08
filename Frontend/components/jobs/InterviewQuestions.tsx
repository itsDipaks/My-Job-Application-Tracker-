import { Sparkles } from 'lucide-react';

interface InterviewQuestionsProps {
  questions: string[];
}

export default function InterviewQuestions({ questions }: InterviewQuestionsProps) {
  return (
    <div className="bg-gray-50 rounded-md p-3 mt-3 space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <Sparkles size={16} className="text-blue-600" />
        Claude-generated interview questions
      </div>
      {questions.map((question, index) => (
        <div
          key={index}
          className="bg-white rounded-md p-3 text-sm text-gray-700 border-l-2 border-blue-600"
        >
          {question}
        </div>
      ))}
    </div>
  )
}
