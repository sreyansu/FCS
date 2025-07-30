import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Form from '@/models/Form';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = params;
    const form = await Form.findById(id);
    if (!form) {
      return NextResponse.json({ message: 'Form not found' }, { status: 404 });
    }
    return NextResponse.json(form, { status: 200 });
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = params;
    const body = await req.json();
    const { title, elements } = body;

    const updatedForm = await Form.findByIdAndUpdate(
      id,
      {
        title,
        questions: elements.map((el: any) => ({
          id: el.id,
          type: el.type,
          question: el.label,
        })),
      },
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return NextResponse.json({ message: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(updatedForm, { status: 200 });
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { id } = params;
    await Form.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Form deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
