'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        const data = await response.json();
        setStatus(`Error: ${data.error || 'Something went wrong.'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('Error: Could not send message.');
    }
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <main className="container mx-auto max-w-4xl px-4">
        <div className="bg-secondary rounded-lg shadow-md p-8">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-8 text-center">Contact Us</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground/80">Full Name</label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    className="mt-1 block w-full"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground/80">Email Address</label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    className="mt-1 block w-full"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground/80">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md border border-secondary bg-background/50 p-2.5 text-foreground transition-colors placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div>
                  <Button type="submit" variant="accent" className="w-full" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
                {status && (
                  <p className={`mt-4 text-center text-sm ${status.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
                    {status === 'success' ? 'Message sent successfully!' : status}
                  </p>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
              <div className="space-y-4 text-lg text-foreground/80">
                <p>
                  <span className="font-semibold text-foreground">Address:</span><br />
                  23 To 2 Xom Trung, Ngo Quyen District<br />
                  Haiphong, Vietnam
                </p>
                <p>
                  <span className="font-semibold text-foreground">Email:</span><br />
                  <a href="mailto:contact@made-in-haiphong.com" className="text-primary hover:underline">contact@made-in-haiphong.com</a>
                </p>
                <p>
                  <span className="font-semibold text-foreground">Phone:</span><br />
                  +84 (0) 902 197 160
                </p>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-foreground mb-2">Office Hours</h3>
                <p className="text-lg text-foreground/80">
                  Monday - Friday: 5:00 AM - 11:00 PM<br />
                  Saturday - Sunday: 6:00 AM - 10:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
