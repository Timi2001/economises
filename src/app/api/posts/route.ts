import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const tag = searchParams.get('tag');

  const where: any = { published: true };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (tag) {
    where.tags = { contains: tag, mode: 'insensitive' };
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { username: true } } },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id');

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const { title, content, published, tags } = await req.json();

  const post = await prisma.post.create({
    data: {
      title,
      content,
      published,
      tags,
      authorId: parseInt(userId, 10),
    },
  });

  return NextResponse.json(post, { status: 201 });
}
