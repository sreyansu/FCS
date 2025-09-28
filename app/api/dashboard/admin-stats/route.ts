import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Form from "@/models/Form"
import User from "@/models/User"
import Feedback from "@/models/Feedback"

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Get total counts
    const totalForms = await Form.countDocuments()
    const totalUsers = await User.countDocuments()
    const totalResponses = await Feedback.countDocuments()

    // Get active users (users who have submitted feedback in the last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const activeUsers = await Feedback.distinct("userId", {
      submittedAt: { $gte: thirtyDaysAgo },
    })

    return NextResponse.json({
      totalForms,
      totalUsers,
      totalResponses,
      activeUsers: activeUsers.length,
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
