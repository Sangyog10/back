import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const questionSchema = new Schema({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true },
  subject: { type: String, required: true },
}, { _id: true });

const subjectResultSchema = new Schema({
  subject: { type: String, required: true },
  score: { type: Number, required: true },
  correctCount: { type: Number, required: true },
  wrongCount: { type: Number, required: true },
  selectedAnswers: { type: [String], required: true },
});

const testResultSchema = new Schema({
  questions: { type: [questionSchema], required: true },
  subjectResults: { type: [subjectResultSchema], required: true },
  selectedAnswers: { type: Map, of: Number, required: true },
  totalScore: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  submittedAt: { type: Date, required: true },
});

const TestResult = mongoose.model('TestResult', testResultSchema);

export default TestResult;
