import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Form from '@/models/Form';
import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth'; // Assuming you have authOptions defined

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  await dbConnect();

  try {
    const forms = await Form.find({}).sort({ createdAt: -1 });
    return NextResponse.json(forms, { status: 200 });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // const session = await getServerSession(authOptions);
  // if (!session || !session.user) {
  //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  // }

  await dbConnect();

  try {
    const body = await req.json();
    console.log('Received request body:', JSON.stringify(body, null, 2));
    const { title, elements } = body;

    if (!title || !elements) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newForm = new Form({
      title,
      description: 'Default form description',
      questions: elements.map((el: any) => ({
        id: el.id,
        type: el.type,
        question: el.question,
        options: [],
        required: false,
      })),
      createdBy: new (require('mongoose').Types.ObjectId)(), // Dummy user ID
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Set to expire in 30 days
      isActive: true,
      responseCount: 0,
    });

    console.log('Attempting to save new form:', JSON.stringify(newForm.toObject(), null, 2));

    await newForm.save();

    return NextResponse.json(newForm, { status: 201 });
  } catch (error) {
    console.error('Error creating form:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
