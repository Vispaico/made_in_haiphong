import React from 'react';

const TermsOfServicePage = () => {
  return (
    <div className="bg-background min-h-screen py-12">
      <main className="container mx-auto max-w-4xl px-4">
        <div className="bg-secondary rounded-lg shadow-md p-8">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-6 text-center">Terms of Service</h1>
          <p className="text-sm text-foreground/60 text-center mb-8">Last Updated: August 21, 2025</p>

          <div className="prose prose-lg max-w-none text-foreground/80">
            <h2 className="text-2xl font-semibold text-foreground mt-6">1. Introduction</h2>
            <p>
              Welcome to Made in Haiphong (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;). These Terms of Service govern your use of our website.
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">2. Use of Our Service</h2>
            <p>
              You must be at least 18 years old to use our Service. You agree to use the Service in compliance with all applicable local, national, and international laws and regulations, including but not limited to the laws of Vietnam.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">3. User Content</h2>
            <p>
              Our Service allows you to post content. You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">4. Prohibited Activities</h2>
            <p>
              You are prohibited from using the site for any unlawful purpose, to solicit others to perform unlawful acts, to violate any regulations, or to infringe upon our intellectual property rights.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">5. Intellectual Property</h2>
            <p>
              The Service and its original content, features and functionality are and will remain the exclusive property of Made in Haiphong and its licensors.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">6. Links To Other Web Sites</h2>
            <p>
              Our Service may contain links to third-party web sites or services that are not owned or controlled by Made in Haiphong. We have no control over, and assume no responsibility for, the content or practices of any third party web sites or services.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">7. Limitation Of Liability</h2>
            <p>
              In accordance with Vietnamese law, in no event shall Made in Haiphong be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the Service.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of Vietnam.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">9. Changes</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfServicePage;