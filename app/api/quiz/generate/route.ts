import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    // 1. Check for API key
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    
    if (!apiKey) {
      console.error('GOOGLE_AI_API_KEY is not set in environment variables');
      return NextResponse.json(
        { error: 'Quiz service is not configured. Please add GOOGLE_AI_API_KEY to your environment.' },
        { status: 500 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const { title, author } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Book title is required' },
        { status: 400 }
      );
    }

    // 3. Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Use the updated model name - gemini-pro was renamed to gemini-1.5-flash or gemini-1.5-pro
    // gemini-1.5-flash is faster and cheaper, good for simple tasks like quiz generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 4. Create the prompt
    const prompt = `Create a simple 3-question multiple choice quiz for a child who just read the book "${title}"${author ? ` by ${author}` : ''}. 
    
The questions should be about general themes, characters, or plot points that would be in a typical children's book with this title.

Return ONLY valid JSON in this exact format with no additional text or markdown:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0
  },
  {
    "question": "Second question?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 1
  },
  {
    "question": "Third question?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 2
  }
]

The correctAnswer should be the index (0-3) of the correct option. Make the questions age-appropriate and fun!`;

    // 5. Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // 6. Clean up the response - remove markdown code blocks if present
    let cleanedText = text
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    // 7. Parse JSON
    let quiz;
    try {
      quiz = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse quiz JSON:', cleanedText);
      console.error('Parse error:', parseError);
      
      // Return a fallback quiz if parsing fails
      return NextResponse.json([
        {
          question: `What is the main topic of "${title}"?`,
          options: ["Adventure", "Friendship", "Learning", "Family"],
          correctAnswer: 0
        },
        {
          question: "What did you enjoy most about this book?",
          options: ["The characters", "The story", "The pictures", "The ending"],
          correctAnswer: 1
        },
        {
          question: "Would you recommend this book to a friend?",
          options: ["Yes, definitely!", "Maybe", "I'm not sure", "Yes, it was great!"],
          correctAnswer: 0
        }
      ]);
    }

    // 8. Validate quiz structure
    if (!Array.isArray(quiz) || quiz.length === 0) {
      console.error('Invalid quiz structure:', quiz);
      return NextResponse.json(
        { error: 'Failed to generate valid quiz questions' },
        { status: 500 }
      );
    }

    return NextResponse.json(quiz);

  } catch (error: any) {
    console.error('Quiz generation error:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('API_KEY')) {
      return NextResponse.json(
        { error: 'Invalid API key configuration' },
        { status: 500 }
      );
    }
    
    if (error.message?.includes('quota') || error.message?.includes('rate')) {
      return NextResponse.json(
        { error: 'Quiz service is temporarily unavailable. Please try again later.' },
        { status: 429 }
      );
    }

    if (error.message?.includes('model')) {
      return NextResponse.json(
        { error: 'Quiz model is not available. Please check configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate quiz. Please try again.' },
      { status: 500 }
    );
  }
}