import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/mongodb"
import Form from "@/models/Form"
import Feedback from "@/models/Feedback"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const now = new Date()

    // Get all forms
    const allForms = await Form.find({ isActive: true })

    // Filter active and expired forms
    const activeForms = allForms.filter(
      (form) => new Date(form.startDate) <= now && new Date(form.endDate) >= now,
    ).length

    const expiredForms = allForms.filter((form) => new Date(form.endDate) < now).length

    // Get user's feedback count
    const feedbackGiven = await Feedback.countDocuments({
      userId: session.user.id,
    })

    // Get pending forms (active forms user hasn't responded to)
    const userFeedbackFormIds = await Feedback.find({
      userId: session.user.id,
    }).distinct("formId")

    const pendingForms = allForms.filter(
      (form) =>
        new Date(form.startDate) <= now &&
        new Date(form.endDate) >= now &&
        !userFeedbackFormIds.some((id) => id.toString() === form._id.toString()),
    ).length

    return NextResponse.json({
      activeForms,
      expiredForms,
      feedbackGiven,
      pendingForms,
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
