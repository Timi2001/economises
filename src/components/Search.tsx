'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Button, InputGroup } from 'react-bootstrap';

export default function Search() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?search=${query}`);
  };

  return (
    <Form onSubmit={handleSearch} className="mb-4">
      <InputGroup>
        <Form.Control
          type="text"
          placeholder="Search for posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="outline-secondary" type="submit">
          Search
        </Button>
      </InputGroup>
    </Form>
  );
}
