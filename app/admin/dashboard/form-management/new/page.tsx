'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { v4 as uuidv4 } from 'uuid';
import { TrashIcon } from '@radix-ui/react-icons';
import { Toaster, toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Define the types for form elements
type FormElement = {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'rating';
  label: string;
};

// A simple star rating component
const StarRating = () => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className="w-6 h-6 text-yellow-400 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path d="M12 17.27l-5.18 2.73 1-5.81-4.24-4.14 5.83-.84L12 3l2.59 5.21 5.83.84-4.24 4.14 1 5.81z" />
      </svg>
    ))}
  </div>
);

export default function NewFormPage() {
  const router = useRouter();
  const [formTitle, setFormTitle] = useState('Untitled Form');
  const [formElements, setFormElements] = useState<FormElement[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const addElement = (type: FormElement['type']) => {
    const newElement: FormElement = {
      id: uuidv4(),
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
    };
    setFormElements([...formElements, newElement]);
  };

  const removeElement = (id: string) => {
    setFormElements(formElements.filter((el) => el.id !== id));
  };

  const handleLabelChange = (id: string, newLabel: string) => {
    setFormElements(
      formElements.map((el) => (el.id === id ? { ...el, label: newLabel } : el))
    );
  };

  const renderElement = (element: FormElement) => {
    return (
      <Card key={element.id} className="mb-4 p-4 relative group">
        <div className="flex justify-between items-center mb-2">
          <Input
            value={element.label}
            onChange={(e) => handleLabelChange(element.id, e.target.value)}
            className="text-md font-semibold border-none focus:ring-0 p-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100"
            onClick={() => removeElement(element.id)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
        {element.type === 'text' && <Input placeholder="User will enter text here" />}
        {element.type === 'email' && <Input type="email" placeholder="user@example.com" />}
        {element.type === 'textarea' && <Textarea placeholder="User will enter longer text here" />}
        {element.type === 'rating' && <StarRating />}
      </Card>
    );
  };

  return (
    <div className="flex h-full gap-8">
      <aside className="w-1/3 lg:w-1/4">
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => addElement('text')}>Add Text Input</Button>
            <Button variant="outline" onClick={() => addElement('email')}>Add Email Input</Button>
            <Button variant="outline" onClick={() => addElement('textarea')}>Add Textarea</Button>
            <Button variant="outline" onClick={() => addElement('rating')}>Add Rating</Button>
          </CardContent>
        </Card>
      </aside>
      <main className="flex-1">
        <Card>
          <CardHeader>
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="text-2xl font-bold border-none focus:ring-0 p-0"
            />
          </CardHeader>
          <CardContent>
            {formElements.length > 0 ? (
              formElements.map(renderElement)
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p>Click on an element from the left to add it to your form.</p>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSaveForm} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Form'}
          </Button>
        </div>
      </main>
    </div>
  );

  async function handleSaveForm() {
    setIsSaving(true);
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formTitle,
          elements: formElements.map(({ id, type, label }) => ({ id, type, question: label })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save the form.');
      }

      toast.success('Form saved successfully!');
      router.push('/admin/dashboard/form-management');

    } catch (error) {
      console.error(error);
      toast.error('An error occurred while saving the form.');
    } finally {
      setIsSaving(false);
    }
  }
}
