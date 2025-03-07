import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Resume and personal information to include in the system message
const SYSTEM_MESSAGE = `You are an AI assistant representing Jay Esquivel. Answer questions about Jay based on the following information:

RESUME:
- Software Engineer with expertise in full-stack development, AI integration, and cloud technologies
- Proficient in Python, JavaScript/TypeScript, React, Next.js, Node.js, and various AI frameworks
- Experience with cloud platforms including Google Cloud and AWS
- Strong background in building scalable applications with modern frameworks
- Passionate about creating elegant solutions to complex problems

PROJECTS:
- Built a personal portfolio website using Next.js, TypeScript, and Tailwind CSS
- Developed AI-powered applications using LangChain and various LLM integrations
- Created data visualization tools with interactive graphs and analytics
- Implemented responsive web applications with modern UI/UX principles

EDUCATION:
- Computer Science degree with focus on software engineering and AI

INTERESTS:
- AI and machine learning applications
- Modern web development
- Cloud architecture and scalable systems
- Open source contributions

Keep your answers concise, friendly, and conversational. If you don't know something specific about Jay that wasn't provided above, you can say "I don't have specific information about that, but you can ask Jay directly through his contact information."
`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();
    
    // Add system message
    const conversationWithSystem = [
      { role: 'system', content: SYSTEM_MESSAGE },
      ...messages
    ];
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: conversationWithSystem,
      max_tokens: 500,
      temperature: 0.7,
    });
    
    // Extract the response
    const responseMessage = completion.choices[0].message.content;
    
    return NextResponse.json({ message: responseMessage });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 