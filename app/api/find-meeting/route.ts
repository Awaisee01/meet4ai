import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface TimeSlot {
  date: string;
  times: string[];
}

interface Person {
  name: string;
  email: string;
  zipCode: string;
  availability: TimeSlot[];
}

interface MeetingRequest {
  people: Person[];
}

interface MeetingSuggestion {
  date: string;
  time: string;
  zipCode: string;
}

interface AIResponse {
  suggestions: MeetingSuggestion[];
  summary?: string;
}

export async function POST(request: Request) {
  try {
    const body: MeetingRequest = await request.json();
    const { people } = body;

    if (!people || people.length !== 3) {
      return NextResponse.json(
        { error: 'Exactly 3 people are required' },
        { status: 400 }
      );
    }

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json(
        { error: 'Groq API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `You are an intelligent meeting scheduler. Analyze the following availability data for 3 people and find up to 3 optimal meeting times.

IMPORTANT CONSTRAINTS:
- All 3 people must be available at the suggested times
- The meeting location (zip code) should be within 30 minutes travel distance for all attendees
- Consider the zip codes: ${people.map(p => `${p.name} at ${p.zipCode}`).join(', ')}
- Only suggest times within the next 7 days

AVAILABILITY DATA:
${people.map(p => `
${p.name} (${p.email}, Zip: ${p.zipCode}):
${p.availability.map(a => `  ${a.date}: ${a.times.join(', ')}`).join('\n')}
`).join('\n')}

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "suggestions": [
    {
      "date": "YYYY-MM-DD",
      "time": "HH:MM AM/PM - HH:MM AM/PM",
      "zipCode": "central zip code"
    }
  ],
  "summary": "Brief explanation of the best option"
}

Find overlapping time slots where all 3 people are available and suggest a central meeting location.`;

    const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', // ✅ UPDATED MODEL
        messages: [
          {
            role: 'system',
            content: 'You are a meeting scheduling assistant. Always respond with valid JSON only, no markdown formatting or code blocks.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1500,
        top_p: 1,
        stream: false,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('Groq API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get AI response', details: errorText },
        { status: 500 }
      );
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      console.error('No content in AI response:', aiData);
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    let parsedResponse: AIResponse;
    try {
      const cleanContent = content
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^[^{]*/g, '')
        .replace(/[^}]*$/g, '')
        .trim();
      
      parsedResponse = JSON.parse(cleanContent);

      if (!parsedResponse.suggestions || !Array.isArray(parsedResponse.suggestions)) {
        throw new Error('Invalid response structure');
      }

      parsedResponse.suggestions = parsedResponse.suggestions.filter(s => 
        s.date && s.time && s.zipCode
      );

      if (parsedResponse.suggestions.length === 0) {
        return NextResponse.json(
          { 
            suggestions: [],
            summary: 'No common availability found among all participants.'
          }
        );
      }

    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      console.error('Parse error:', parseError);
      
      return NextResponse.json(
        { 
          error: 'Invalid AI response format',
          debug: process.env.NODE_ENV === 'development' ? content : undefined
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}