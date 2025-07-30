'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';

type Form = {
  _id: string;
  title: string;
  createdAt: string;
  responseCount: number;
};

export default function FormManagementPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        const response = await fetch(`/api/forms/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete form');
        }

        setForms(forms.filter((form) => form._id !== id));
        toast.success('Form deleted successfully');
      } catch (err: any) {
        setError(err.message);
        toast.error('Failed to delete form');
      }
    }
  };

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await fetch('/api/forms');
        if (!response.ok) {
          throw new Error('Failed to fetch forms');
        }
        const data = await response.json();
        setForms(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForms();
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Form Management</h1>
        <Button asChild>
          <Link href="/admin/dashboard/form-management/new">
            Create New Form
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Forms</CardTitle>
          <CardDescription>
            A list of all the forms you have created.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : (
                forms.map((form) => (
                  <TableRow key={form._id}>
                    <TableCell className="font-medium">{form.title}</TableCell>
                    <TableCell>{new Date(form.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{form.responseCount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild className="mr-2">
                        <Link href={`/admin/dashboard/form-management/edit/${form._id}`}>
                          Edit
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(form._id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
