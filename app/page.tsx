import Link from 'next/link';
import { BookOpen, Star, Trophy, Target } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <BookOpen className="w-20 h-20 text-blue-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Reading Tracker & Rewards
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track your reading progress, earn points, unlock achievements, and redeem exciting rewards!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <Target className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Track Reading Time</h3>
            <p className="text-gray-600">
              Use our built-in timer to track your reading sessions and build consistent habits.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <Star className="w-12 h-12 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Earn Points</h3>
            <p className="text-gray-600">
              Get 1 point per minute read, plus bonus points for maintaining streaks!
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <Trophy className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Unlock Rewards</h3>
            <p className="text-gray-600">
              Redeem your points for custom rewards set by your parents!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Why Reading Matters</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-lg">
              <div className="text-4xl font-bold text-blue-900 mb-2">30min</div>
              <div className="text-blue-800">Daily goal</div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-lg">
              <div className="text-4xl font-bold text-green-900 mb-2">8</div>
              <div className="text-green-800">Achievements</div>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-lg">
              <div className="text-4xl font-bold text-purple-900 mb-2">∞</div>
              <div className="text-purple-800">Books to track</div>
            </div>
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 p-6 rounded-lg">
              <div className="text-4xl font-bold text-amber-900 mb-2">50%</div>
              <div className="text-amber-800">Streak bonus</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to start your reading journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of kids building healthy reading habits!
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-block"
          >
            Create Free Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">© 2024 Reading Tracker. Built with Next.js 16, React 19, and NextAuth v5.</p>
        </div>
      </footer>
    </div>
  );
}