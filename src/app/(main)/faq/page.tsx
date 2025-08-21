
import React from 'react';

const faqs = [
  {
    question: "What is Made in Haiphong?",
    answer: "Made in Haiphong is a comprehensive online platform dedicated to showcasing the best of Haiphong, Vietnam. We connect travelers, expatriates, and locals with information on places to stay, eat, explore, and connect with the community."
  },
  {
    question: "How can I book accommodation?",
    answer: "You can browse our 'Stay' section to find a variety of accommodations. Once you've found a place you like, you can send a booking request directly to the host. You will be notified once the host accepts your request."
  },
  {
    question: "Is it free to create an account?",
    answer: "Yes, creating an account on Made in Haiphong is completely free. An account allows you to save your favorite listings, participate in the community forum, and contact hosts."
  },
  {
    question: "How do I list my property or service?",
    answer: "If you're interested in becoming a host, you can create a listing through your dashboard after signing up. You'll be asked to provide details about your space, upload photos, and set your pricing and availability."
  },
  {
    question: "What kind of things can I find in the Marketplace?",
    answer: "Our Marketplace is a space for the local community to buy, sell, or trade goods and services. You can find everything from handmade crafts and secondhand items to local services and job postings."
  },
  {
    question: "How does the Community section work?",
    answer: "The Community section is a forum for users to ask questions, share experiences, and connect with others in Haiphong. It's a great place to get local tips and advice."
  },
  {
    question: "Who writes the articles in the Explore section?",
    answer: "Our articles are written by a team of local writers and contributors who are passionate about Haiphong. We aim to provide authentic and up-to-date information to help you discover the city's hidden gems."
  },
  {
    question: "How is my personal information protected?",
    answer: "We take your privacy very seriously. All personal data is handled in accordance with our Privacy Policy and the relevant data protection laws in Vietnam. We use secure servers and encryption to protect your information."
  },
  {
    question: "What should I do if I have a problem with a booking?",
    answer: "If you encounter any issues with a booking, we recommend contacting the host first to try and resolve the situation. If you're unable to reach a resolution, you can contact our support team through the Contact Us page for assistance."
  },
  {
    question: "How can I contribute to Made in Haiphong?",
    answer: "We are always looking for passionate individuals to contribute to our platform. If you're interested in writing for us, sharing your photography, or have other ideas, please get in touch with us via our Contact page."
  }
];

const FAQPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h1>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{faq.question}</h3>
                <p className="text-lg text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQPage;
