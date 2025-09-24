import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// GET a single post
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { username: true } } },
  });

  if (!post) {
    return new NextResponse(JSON.stringify({ error: 'Post not found' }), { status: 404 });
  }

  return NextResponse.json(post);
}

// UPDATE a post
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const userId = req.headers.get('x-user-id');

  if (!userId) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const id = parseInt(params.id, 10);
  const { title, content, published, tags } = await req.json();

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      published,
      tags,
    },
  });

  return NextResponse.json(post);
}

// DELETE a post
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const userId = req.headers.get('x-user-id');

    if (!userId) {
        return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const id = parseInt(params.id, 10);

    await prisma.post.delete({
        where: { id },
    });

    return new NextResponse(null, { status: 204 });
}
