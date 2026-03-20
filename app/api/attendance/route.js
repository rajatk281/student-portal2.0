import {prisma} from "@/server/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { studentId, subjectId, status, date } = await req.json()

    const record = await prisma.attendance.upsert({
      where: {
        studentId_subjectId: {
          studentId,
          subjectId,
        },
      },
      update: {
        total: { increment: 1 },
        attended: status === "present" ? { increment: 1 } : undefined,
      },
      create: {
        studentId,
        subjectId,
        total: 1,
        attended: status === "present" ? 1 : 0,
      },
    })

    return NextResponse.json(record)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        subject: true,
      },
    })

    return NextResponse.json(attendances)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}