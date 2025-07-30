'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Form {
  _id: string;
  title: string;
  description: string;
  status: 'active' | 'expired';
  endDate: string;
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch('/api/forms');
        if (response.ok) {
          const data = await response.json();
          setForms(data);
        }
      } catch (error) {
        console.error('Failed to fetch forms:', error);
      }
      setLoading(false);
    };

    fetchForms();
  }, []);

  const activeForms = forms.filter((form) => new Date(form.endDate) > new Date());
  const expiredForms = forms.filter((form) => new Date(form.endDate) <= new Date());

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Available Forms</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Here are the forms available for you to provide feedback.</p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Active Forms</h2>
        {loading ? (
          <p>Loading...</p>
        ) : activeForms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeForms.map((form) => (
              <Card key={form._id}>
                <CardHeader>
                  <CardTitle>{form.title}</CardTitle>
                  <CardDescription>{form.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <Badge>Ends: {new Date(form.endDate).toLocaleDateString()}</Badge>
                  <Link href={`/forms/${form._id}`} passHref>
                    <Button>View Form</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>No active forms available.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Expired Forms</h2>
        {loading ? (
          <p>Loading...</p>
        ) : expiredForms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expiredForms.map((form) => (
              <Card key={form._id} className="opacity-60">
                <CardHeader>
                  <CardTitle>{form.title}</CardTitle>
                  <CardDescription>{form.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="destructive">Expired on {new Date(form.endDate).toLocaleDateString()}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p>No expired forms.</p>
        )}
      </section>
    </div>
  );
}
