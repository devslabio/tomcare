import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use Supabase or Stripe for real payments
const donations: Array<{
  id: string
  amount: number
  donorName?: string
  donorEmail?: string
  type: string
  status: string
  createdAt: string
}> = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newDonation = {
      id: Math.random().toString(36).substr(2, 9),
      amount: body.amount,
      donorName: body.donorName,
      donorEmail: body.donorEmail,
      type: body.type || "general",
      status: "pending", // In production: process with Stripe
      createdAt: new Date().toISOString(),
    }

    donations.push(newDonation)

    // TODO: Integrate with Stripe for payment processing
    console.log("New donation received:", newDonation)

    return NextResponse.json(
      {
        success: true,
        message: "Donation processed. Thank you for your generosity!",
        donationId: newDonation.id,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Donation processing failed",
      },
      { status: 400 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    totalDonations: donations.length,
    totalAmount: donations.reduce((sum, d) => sum + d.amount, 0),
    donations,
  })
}
