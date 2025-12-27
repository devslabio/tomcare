import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use Supabase or another database
const recipients: Array<{
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  situation: string
  needsAssistance: string[]
  createdAt: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newRecipient = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      situation: body.situation,
      needsAssistance: body.needsAssistance,
      createdAt: new Date().toISOString(),
    }

    recipients.push(newRecipient)

    // TODO: Send confirmation email
    console.log("New recipient registered:", newRecipient)

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. We will contact you soon.",
        recipientId: newRecipient.id,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Registration failed",
      },
      { status: 400 },
    )
  }
}

export async function GET() {
  return NextResponse.json(recipients)
}
