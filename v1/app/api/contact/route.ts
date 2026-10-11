import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, store in Supabase
const messages: Array<{
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  createdAt: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      message: body.message,
      createdAt: new Date().toISOString(),
    }

    messages.push(newMessage)

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to user
    console.log("New contact message:", newMessage)

    return NextResponse.json(
      {
        success: true,
        message: "Message received. We will get back to you soon.",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send message",
      },
      { status: 400 },
    )
  }
}

export async function GET() {
  return NextResponse.json(messages)
}
