'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import withAuth from '@/components/withAuth';

function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, tags, published }),
    });

    if (res.ok) {
      router.push('/admin');
    } else {
      const { error } = await res.json();
      setError(error || 'Failed to create post');
    }
  };

  return (
    <Container className="py-5">
      <h1>Create New Post</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="content">
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="tags">
          <Form.Label>Tags (comma-separated)</Form.Label>
          <Form.Control
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="published">
          <Form.Check
            type="checkbox"
            label="Publish"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Post
        </Button>
      </Form>
    </Container>
  );
}

export default withAuth(NewPostPage);
