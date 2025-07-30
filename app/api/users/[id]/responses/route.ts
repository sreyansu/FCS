import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Response from '@/models/Response';
import Form from '@/models/Form';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== params.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { formId, answers } = await request.json();

    if (!formId || !answers) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();

    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    const newResponse = new Response({
      formId,
      userId: params.id,
      answers: formattedAnswers,
    });

    await newResponse.save();

    await Form.findByIdAndUpdate(formId, { $inc: { responseCount: 1 } });

    return NextResponse.json({ message: 'Response submitted successfully' }, { status: 201 });
  } catch (error) {
    console.error('Response submission error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.id !== params.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();

    const responses = await Response.find({ userId: params.id })
      .populate({
        path: 'formId',
        select: 'title questions',
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(responses, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch responses:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
