import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-6 bg-gray-100 border-t mt-16 text-center text-gray-600 text-sm">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <span>
          &copy; {new Date().getFullYear()} Kalendero. All rights reserved.
        </span>
        <span className="mt-2 md:mt-0 flex gap-4 items-center">
          <Link
            href="/privacy-policy"
            className="underline hover:text-blue-600 transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="mx-1">|</span>
          <Link
            href="/terms-of-service"
            className="underline hover:text-blue-600 transition-colors"
          >
            Terms of Service
          </Link>
        </span>
      </div>
    </footer>
  );
}
