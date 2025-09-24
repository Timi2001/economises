import prisma from '@/lib/prisma';
import { Container, Badge } from 'react-bootstrap';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

async function getPost(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    if (res.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    notFound();
  }

  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  return (
    <Container className="py-5">
      <article>
        <header className="mb-4">
          <h1>{post.title}</h1>
          <div className="text-muted fst-italic mb-2">
            Posted on {new Date(post.createdAt).toLocaleDateString()} by {post.author.username}
          </div>
          <div>
            {post.tags?.split(',').map(tag => (
              <Badge key={tag} pill bg="info" className="me-1">
                {tag.trim()}
              </Badge>
            ))}
          </div>
        </header>
        <section className="mb-5">
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        </section>
      </article>
    </Container>
  );
}
