'use client';

import { useState, useEffect } from 'react';
import withAuth from '@/components/withAuth';
import { Container, Button, Table, Badge } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';

interface Post {
  id: number;
  title: string;
  published: boolean;
}

function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const token = Cookies.get('token');
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPosts(posts.filter((post) => post.id !== id));
      } else {
        alert('Failed to delete post');
      }
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/admin/login');
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <div>
          <Button variant="primary" onClick={() => router.push('/admin/posts/new')} className="me-2">
            Create New Post
          </Button>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>{post.title}</td>
              <td>
                {post.published ? (
                  <Badge bg="success">Published</Badge>
                ) : (
                  <Badge bg="secondary">Draft</Badge>
                )}
              </td>
              <td>
                <Link href={`/admin/posts/edit/${post.id}`} passHref>
                  <Button variant="warning" size="sm" className="me-2">Edit</Button>
                </Link>
                <Button variant="danger" size="sm" onClick={() => handleDelete(post.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default withAuth(AdminDashboard);