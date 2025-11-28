import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { BookService } from '@/services/bookService';
import { bookSchema } from '@/lib/validations';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;

    // If parent requesting PENDING books, get all children's pending books
    if (session.user.role === 'PARENT' && status === 'PENDING') {
      const books = await BookService.getPendingBooks(session.user.id);
      return NextResponse.json(books);
    }

    // Otherwise, get user's own books
    const books = await BookService.getUserBooks(session.user.id, status);

    return NextResponse.json(books);
  } catch (error) {
    console.error('Get books error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = bookSchema.parse(body);

    // Call the updated service which now handles the "check if exists" logic
    const book = await BookService.createBook(session.user.id, validatedData);

    // Return 200 (OK) because it might be an existing book. 
    // If you strictly want 201 for new creations, you'd need the service to return a flag.
    return NextResponse.json(book, { status: 200 }); 
  } catch (error: any) {
    console.error('Create book error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}