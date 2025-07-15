import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4">
        Your privacy is important to us. This Privacy Policy explains how
        Kalendero collects, uses, and protects your information when you use our
        application.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        Information We Collect
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>Account information (via Clerk authentication)</li>
        <li>Event and scheduling data you create</li>
        <li>Google Calendar integration data (if connected)</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        How We Use Your Information
      </h2>
      <ul className="list-disc ml-6 mb-4">
        <li>To provide and improve the Kalendero service</li>
        <li>To enable event scheduling and calendar integration</li>
        <li>To communicate with you about your account or events</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">Data Security</h2>
      <p className="mb-4">
        We use industry-standard security measures to protect your data.
        Sensitive information is encrypted and access is restricted to
        authorized personnel only.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Third-Party Services</h2>
      <p className="mb-4">
        We integrate with third-party services such as Clerk and Google
        Calendar. Please review their privacy policies for more information on
        how they handle your data.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Your Rights</h2>
      <p className="mb-4">
        You may request access to, correction of, or deletion of your personal
        data at any time by contacting us.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us
        at{" "}
        <a
          href="mailto:support@kalendero.com"
          className="text-blue-600 underline"
        >
          support@kalendero.com
        </a>
        .
      </p>
    </main>
  );
}
