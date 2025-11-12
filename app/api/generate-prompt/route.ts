import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const { title, notes } = await request.json()

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const systemPrompt = `You are an expert software engineer and Claude Code prompt writer.
Your task is to convert a task title (and optional notes) into a detailed, actionable prompt that Claude Code can use to implement the feature.

The prompt should:
1. Clearly describe what feature needs to be built
2. Include specific implementation details and requirements
3. Mention any related components or modifications needed
4. Suggest best practices and patterns to use
5. Be concise but comprehensive enough to guide implementation

Format the output as a clear, professional prompt that a developer could immediately use with Claude Code.`

    const userMessage = notes
      ? `Task Title: "${title}"\n\nTask Notes: "${notes}"\n\nPlease create a Claude Code prompt for implementing this feature.`
      : `Task Title: "${title}"\n\nPlease create a Claude Code prompt for implementing this feature.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const prompt =
      response.choices[0].message.content ||
      'Failed to generate prompt. Please try again.'

    return NextResponse.json({
      prompt,
      title,
    })
  } catch (error) {
    console.error('Error generating prompt:', error)

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API Error: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to generate prompt. Please try again later.' },
      { status: 500 }
    )
  }
}
