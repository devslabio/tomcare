import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use Supabase or another database
const volunteers: Array<{
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  experience: string
  availability: string
  status: string
  createdAt: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newVolunteer = {
      id: Math.random().toString(36).substr(2, 9),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      position: body.position,
      experience: body.experience,
      availability: body.availability,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    volunteers.push(newVolunteer)

    // TODO: Send confirmation email and notify admin
    console.log("New volunteer application:", newVolunteer)

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted. We will review and contact you shortly.",
        volunteerId: newVolunteer.id,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Application failed",
      },
      { status: 400 },
    )
  }
}

export async function GET() {
  return NextResponse.json(volunteers)
}
