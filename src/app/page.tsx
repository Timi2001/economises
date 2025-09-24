import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Container, Card, Badge, Button } from 'react-bootstrap';
import Search from '@/components/Search';

async function getPosts({ search, tag }: { search?: string; tag?: string }) {
  const url = new URL('/api/posts', process.env.NEXT_PUBLIC_API_URL);
  if (search) url.searchParams.append('search', search);
  if (tag) url.searchParams.append('tag', tag);

  const res = await fetch(url.toString());
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { search?: string; tag?: string };
}) {
  const posts = await getPosts(searchParams || {});

  return (
    <>
      <header className="bg-light text-dark text-center py-5 mb-4">
        <Container>
          <h1 className="fw-light">Economises</h1>
          <p className="lead">A personal blog by Timilehin</p>
        </Container>
      </header>
      <Container>
        <Search />
        <div className="row">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="col-md-4 mb-4">
                <Card className="h-100">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{post.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      By {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}
                    </Card.Subtitle>
                    <Card.Text className="flex-grow-1">
                      {post.content?.substring(0, 150)}...
                    </Card.Text>
                    <div>
                      {post.tags?.split(',').map(tag => (
                        <Link key={tag} href={`/?tag=${tag.trim()}`} passHref>
                          <Badge pill={true} bg="info" className="me-1" style={{ cursor: 'pointer' }}>
                            {tag.trim()}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                    <Link href={`/posts/${post.id}`} passHref>
                      <Button variant="primary" className="mt-auto">Read More</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center">
              <h2>No posts found</h2>
              <p>Try adjusting your search or tag filter.</p>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
