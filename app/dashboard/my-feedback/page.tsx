'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

interface Answer {
  questionId: string;
  answer: any;
}

interface Question {
  _id: string;
  question: string;
}

interface Form {
  _id: string;
  title: string;
  questions: Question[];
}

interface Response {
  _id: string;
  formId: Form;
  answers: Answer[];
  createdAt: string;
}

export default function MyFeedbackPage() {
  const { data: session, status } = useSession();
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchResponses = async () => {
        try {
          const res = await fetch(`/api/users/${session.user.id}/responses`);
          if (res.ok) {
            const data = await res.json();
            setResponses(data);
          }
        } catch (error) {
          console.error('Failed to fetch responses:', error);
        }
        setLoading(false);
      };
      fetchResponses();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status]);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">My Feedback</h1>

      {status === 'loading' || loading ? (
        <p>Loading your feedback...</p>
      ) : responses.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Your Submitted Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {responses.map((response) => (
                <AccordionItem key={response._id} value={response._id}>
                  <AccordionTrigger>
                    <div className="flex justify-between items-center w-full pr-4">
                      <span>{response.formId.title}</span>
                      <Badge>{new Date(response.createdAt).toLocaleDateString()}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pl-4 pt-2">
                      {response.answers.map((answer, index) => {
                        const question = response.formId.questions.find(q => q._id === answer.questionId);
                        return (
                          <div key={index} className="text-sm">
                            <p className="font-semibold">{question ? question.question : 'Question not found'}</p>
                            <p className="text-gray-600 dark:text-gray-300 pl-2">{Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer.toString()}</p>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ) : (
        <p>You have not submitted any feedback yet.</p>
      )}
    </div>
  );
}
