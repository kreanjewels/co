'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Please share a little more about your idea.'),
  privacy: z.literal(true, { message: 'Please accept the privacy policy.' }),
});
type FormValues = z.infer<typeof schema>;

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const [status, setStatus] = useState('');

  async function submit(data: FormValues) {
    setStatus('Sending your enquiry…');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setStatus(response.ok ? 'Thank you — we’ll be in touch.' : 'Something went wrong. Please try again.');
    } catch {
      setStatus('Something went wrong. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="mt-12 space-y-5" aria-describedby="contact-status">
      <div>
        <label htmlFor="contact-name" className="sr-only">Name</label>
        <input id="contact-name" autoComplete="name" className="w-full border-b bg-transparent p-3" placeholder="Name" {...register('name')} aria-invalid={Boolean(errors.name)} />
        {errors.name && <p className="mt-1 text-sm text-red-700">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="contact-email" className="sr-only">Email</label>
        <input id="contact-email" type="email" autoComplete="email" className="w-full border-b bg-transparent p-3" placeholder="Email" {...register('email')} aria-invalid={Boolean(errors.email)} />
        {errors.email && <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="contact-message" className="sr-only">Tell us about your idea</label>
        <textarea id="contact-message" className="w-full border-b bg-transparent p-3" rows={5} placeholder="Tell us a little about your idea" {...register('message')} aria-invalid={Boolean(errors.message)} />
        {errors.message && <p className="mt-1 text-sm text-red-700">{errors.message.message}</p>}
      </div>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" {...register('privacy')} aria-invalid={Boolean(errors.privacy)} />
        <span>I agree to the privacy policy.</span>
      </label>
      {errors.privacy && <p className="text-sm text-red-700">{errors.privacy.message}</p>}
      <button className="btn focus-ring" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send enquiry'}</button>
      <p id="contact-status" role="status" aria-live="polite">{status}</p>
    </form>
  );
}
