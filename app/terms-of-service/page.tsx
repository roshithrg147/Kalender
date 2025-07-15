import React from "react";

export default function TermsOfServicePage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="mb-4">
        Welcome to Kalendero! By using our application, you agree to the
        following terms and conditions. Please read them carefully.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Use of Service</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>You must be at least 13 years old to use Kalendero.</li>
        <li>
          You are responsible for maintaining the security of your account.
        </li>
        <li>
          You may not use Kalendero for any unlawful or prohibited activities.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">User Content</h2>
      <ul className="list-disc ml-6 mb-4">
        <li>You retain ownership of any content you create or upload.</li>
        <li>
          You grant Kalendero a license to use, display, and distribute your
          content as necessary to provide the service.
        </li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">Account Termination</h2>
      <p className="mb-4">
        We reserve the right to suspend or terminate your account if you violate
        these terms or use the service in a harmful manner.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">
        Limitation of Liability
      </h2>
      <p className="mb-4">
        Kalendero is provided "as is" without warranties of any kind. We are not
        liable for any damages or losses resulting from your use of the service.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Changes to Terms</h2>
      <p className="mb-4">
        We may update these Terms of Service from time to time. Continued use of
        Kalendero after changes means you accept the new terms.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">Contact</h2>
      <p>
        If you have any questions about these Terms of Service, please contact
        us at{" "}
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
