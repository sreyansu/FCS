'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/ui/star-rating';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

interface Question {
  _id: string;
  type: string;
  question: string;
  options: string[];
}

interface Form {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
}

export default function FormPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [form, setForm] = useState<Form | null>(null);
  const { data: session } = useSession();
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchForm = async () => {
        try {
          const response = await fetch(`/api/forms/${id}`);
          if (response.ok) {
            const data = await response.json();
            setForm(data);
          } else {
            toast.error('Form not found');
            router.push('/dashboard/forms');
          }
        } catch (error) {
          toast.error('Failed to fetch form');
        }
        setLoading(false);
      };
      fetchForm();
    }
  }, [id, router]);

  const handleInputChange = (questionId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast.error('You must be logged in to submit a response.');
      return;
    }

    try {
      const response = await fetch(`/api/users/${session.user.id}/responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formId: id, answers: responses }),
      });

      if (response.ok) {
        toast.success('Form submitted successfully!');
        router.push('/dashboard/forms');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to submit form');
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading form...</div>;
  }

  if (!form) {
    return <div className="flex items-center justify-center min-h-screen">Form not found.</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{form.title}</CardTitle>
          <CardDescription>{form.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {form.questions.map((q, index) => (
              <div key={q._id} className="p-4 border rounded-lg">
                <Label className="font-semibold text-lg">{index + 1}. {q.question}</Label>
                <div className="mt-4">
                  {renderQuestion(q, responses[q._id], handleInputChange)}
                </div>
              </div>
            ))}
            <Button type="submit" className="w-full">Submit Feedback</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function renderQuestion(question: Question, value: any, onChange: (questionId: string, value: any) => void) {
  switch (question.type) {
    case 'text':
      return <Input type="text" value={value || ''} onChange={(e) => onChange(question._id, e.target.value)} />;
    case 'textarea':
      return <Textarea value={value || ''} onChange={(e) => onChange(question._id, e.target.value)} />;
    case 'radio':
      return (
        <RadioGroup value={value} onValueChange={(val) => onChange(question._id, val)}>
          {question.options.map((option, i) => (
            <div key={i} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`${question._id}-${i}`} />
              <Label htmlFor={`${question._id}-${i}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
      );
    case 'checkbox':
      return (
        <div>
          {question.options.map((option, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Checkbox
                id={`${question._id}-${i}`}
                checked={value?.includes(option) || false}
                onCheckedChange={(checked) => {
                  const newValue = checked
                    ? [...(value || []), option]
                    : (value || []).filter((v: string) => v !== option);
                  onChange(question._id, newValue);
                }}
              />
              <Label htmlFor={`${question._id}-${i}`}>{option}</Label>
            </div>
          ))}
        </div>
      );
    case 'email':
        return <Input type="email" value={value || ''} onChange={(e) => onChange(question._id, e.target.value)} />;
    case 'rating':
      return <StarRating value={value || 0} onChange={(val) => onChange(question._id, val)} />;
    default:
      return <p>Unsupported question type.</p>;
  }
}
