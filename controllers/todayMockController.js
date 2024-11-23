import TestResult  from "../model/todayMock.js";

const sotreTodayMock = async (req, res) => {
    const { questions, subjectResults, selectedAnswers, totalScore, totalQuestions, submittedAt } = req.body;
  
      // Create a new test result document 
      const newTestResult = new TestResult({
        questions,
        subjectResults,
        selectedAnswers,
        totalScore,
        totalQuestions,
        submittedAt,
      });
  
      // Save the test result to the database
      const savedTestResult = await newTestResult.save();
  
      res.status(201).json({
        message: 'Test result stored successfully',
        data: savedTestResult,
      });
    };

    export { sotreTodayMock };