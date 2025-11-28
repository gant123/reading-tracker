import { prisma } from '@/lib/prisma';
import { BookInput, GoogleBook } from '@/types';

export class BookService {
  static async searchBooks(query: string): Promise<any[]> {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=10`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to search books');
    }

    const data = await response.json();
    
    return (data.items || []).map((item: GoogleBook) => ({
      googleBooksId: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.join(', ') || 'Unknown Author',
      coverUrl: item.volumeInfo.imageLinks?.thumbnail || item.volumeInfo.imageLinks?.smallThumbnail,
      pageCount: item.volumeInfo.pageCount,
      description: item.volumeInfo.description,
    }));
  }

  static async createBook(userId: string, data: BookInput) {
    // 1. If we have a Google ID, check if this specific child already has the book
    if (data.googleBooksId) {
      const existingBook = await prisma.book.findFirst({
        where: {
          userId, // Scoped to this specific child
          googleBooksId: data.googleBooksId,
        },
      });

      // 2. If it exists, return it immediately (idempotent action)
      if (existingBook) {
        return existingBook;
      }
    }

    // 3. If it doesn't exist (or no Google ID provided), create it
    return prisma.book.create({
      data: {
        ...data,
        userId,
        status: 'PENDING',
      },
    });
  }

  static async getUserBooks(userId: string, status?: string) {
    return prisma.book.findMany({
      where: {
        userId,
        ...(status && { status: status as any }),
      },
      include: {
        sessions: {
          take: 5,
          orderBy: { startTime: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getPendingBooks(parentId: string) {
    const children = await prisma.user.findMany({
      where: { parentId },
      select: { id: true },
    });

    const childIds = children.map(child => child.id);

    return prisma.book.findMany({
      where: {
        userId: { in: childIds },
        status: 'PENDING',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async updateBookStatus(bookId: string, status: 'APPROVED' | 'REJECTED') {
    return prisma.book.update({
      where: { id: bookId },
      data: { status },
    });
  }

  static async deleteBook(bookId: string) {
    return prisma.book.delete({
      where: { id: bookId },
    });
  }
}