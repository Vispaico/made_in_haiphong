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
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Contact Us</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
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
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
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
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  {/* Honeypot field */}
                  <input type="text" name="fax" tabIndex={-1} autoComplete="off" className="hidden" />
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div>
                  <Button type="submit" className="w-full" disabled={status === 'sending'}>
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
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contact Information</h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  <span className="font-semibold">Address:</span><br />
                  123 Le Hong Phong, Ngo Quyen District<br />
                  Haiphong, Vietnam
                </p>
                <p>
                  <span className="font-semibold">Email:</span><br />
                  <a href="mailto:contact@madeinhaiphong.com" className="text-indigo-600 hover:underline">contact@madeinhaiphong.com</a>
                </p>
                <p>
                  <span className="font-semibold">Phone:</span><br />
                  +84 123 456 789
                </p>
              </div>
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Office Hours</h3>
                <p className="text-lg text-gray-600">
                  Monday - Friday: 9:00 AM - 5:00 PM<br />
                  Saturday - Sunday: Closed
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