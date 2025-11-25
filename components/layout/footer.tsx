export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} Reading Tracker & Rewards. Built with Next.js 16, React 19, and NextAuth v5.
        </p>
      </div>
    </footer>
  );
}