import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-background min-h-screen py-12">
      <main className="container mx-auto max-w-4xl px-4">
        <div className="bg-secondary rounded-lg shadow-md p-8">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-6 text-center">Privacy Policy</h1>
          <p className="text-sm text-foreground/60 text-center mb-8">Last Updated: August 21, 2025</p>

          <div className="prose prose-lg max-w-none text-foreground/80">
            <h2 className="text-2xl font-semibold text-foreground mt-6">1. Introduction</h2>
            <p>
              We are committed to protecting your personal information and your right to privacy. This Privacy Policy applies to all information collected through our website and/or any related services.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">2. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when you register, express an interest in obtaining information about us or our products and services, or otherwise contact us.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">3. How We Use Your Information</h2>
            <p>
              We use personal information collected via our Services for a variety of business purposes, including to facilitate account creation, manage user accounts, and send you administrative information.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">4. Will Your Information Be Shared With Anyone?</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">5. How Long Do We Keep Your Information?</h2>
            <p>
              We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">6. How Do We Keep Your Information Safe?</h2>
            <p>
              We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">7. Your Privacy Rights</h2>
            <p>
              In accordance with Vietnamese law, you have the right to request access to the personal information we collect from you, change that information, or delete it in some circumstances.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">8. Updates To This Policy</h2>
            <p>
              We may update this privacy policy from time to time. The updated version will be indicated by an updated &quot;Revised&quot; date.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mt-6">9. How Can You Contact Us About This Policy?</h2>
            <p>
              If you have questions or comments about this policy, you may contact us.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;