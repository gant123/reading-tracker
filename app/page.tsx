"use client"

import { BookOpen, CheckCircle2, ChevronRight, Clock, Flame, Gift, Sparkles, Star, Target, Trophy } from 'lucide-react';

import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <Image 
                  src="/logo.png" 
                  alt="Reading Tracker Logo" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <span className="font-extrabold text-lg sm:text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Reading Tracker
              </span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 font-medium text-sm sm:text-base transition-colors px-3 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-12 sm:mb-16">
            {/* Logo animation */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-40 scale-150 animate-pulse"></div>
                <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                  <Image 
                    src="/logo.png" 
                    alt="Reading Tracker" 
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight">
              Make Reading
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Fun & Rewarding
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
              Track reading time, earn points, unlock achievements, and redeem exciting rewards. 
              The perfect way to build healthy reading habits!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Start Reading Journey
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-full font-bold text-lg border-2 border-gray-200 hover:border-purple-300 hover:text-purple-600 transition-all flex items-center justify-center gap-2"
              >
                I Have an Account
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>100% Free to Start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Kid-Friendly Design</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>Parent Dashboard</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Mockup */}
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none"></div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-4 sm:p-8 shadow-2xl">
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
                {/* Mock dashboard preview */}
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-xl font-bold">
                    S
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">Welcome back, Sarah! 👋</p>
                    <p className="text-xs sm:text-sm text-green-600">🔥 On fire! Read today!</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  {[
                    { icon: Star, label: 'Points', value: '1,250', color: 'text-amber-500' },
                    { icon: Clock, label: 'Minutes', value: '840', color: 'text-blue-500' },
                    { icon: Flame, label: 'Streak', value: '12', color: 'text-orange-500' },
                    { icon: Trophy, label: 'Books', value: '8', color: 'text-green-500' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-2 sm:p-4 text-center">
                      <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 ${stat.color}`} />
                      <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-3 sm:p-4">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                    <p className="font-bold text-sm sm:text-base">Start Reading</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-3 sm:p-4">
                    <Gift className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                    <p className="font-bold text-sm sm:text-base">Rewards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Simple Steps to Success
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is easy. Here's how your family can begin the reading adventure.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                step: '1',
                icon: BookOpen,
                title: 'Add Books',
                description: 'Search and add books to your reading list. Parents approve for safety.',
                color: 'from-blue-500 to-blue-600',
              },
              {
                step: '2',
                icon: Clock,
                title: 'Track Time',
                description: 'Use the built-in timer to track reading sessions automatically.',
                color: 'from-green-500 to-emerald-600',
              },
              {
                step: '3',
                icon: Star,
                title: 'Earn Points',
                description: 'Get 1 point per minute read, plus bonus points for streaks!',
                color: 'from-amber-500 to-orange-600',
              },
              {
                step: '4',
                icon: Gift,
                title: 'Get Rewards',
                description: 'Redeem points for custom rewards set by parents.',
                color: 'from-purple-500 to-pink-600',
              },
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 h-full">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <item.icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm">
                    {item.step}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              Features
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Packed with features to make reading exciting and progress visible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Flame,
                title: 'Reading Streaks',
                description: 'Build momentum with daily streaks. Read 3+ days for 25% bonus, 7+ days for 50% bonus!',
                gradient: 'from-orange-400 to-red-500',
              },
              {
                icon: Trophy,
                title: 'Achievements',
                description: 'Unlock badges for milestones like total minutes read, streak days, and books completed.',
                gradient: 'from-amber-400 to-yellow-500',
              },
              {
                icon: Sparkles,
                title: 'Avatar Shop',
                description: 'Customize your avatar with cool styles and backgrounds using earned points!',
                gradient: 'from-pink-400 to-purple-500',
              },
              {
                icon: Gift,
                title: 'Custom Rewards',
                description: 'Parents create personalized rewards. Kids redeem points for things they love!',
                gradient: 'from-green-400 to-emerald-500',
              },
              {
                icon: Target,
                title: 'Progress Tracking',
                description: 'Visual dashboards show reading stats, session history, and achievement progress.',
                gradient: 'from-blue-400 to-indigo-500',
              },
              {
                icon: BookOpen,
                title: 'Book Library',
                description: 'Search millions of books via Google Books. Track your entire reading collection.',
                gradient: 'from-violet-400 to-purple-500',
              },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg`}>
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-center mb-8 sm:mb-12">
                Why Reading Matters
              </h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {[
                  { value: '30', label: 'min/day goal', suffix: '' },
                  { value: '8', label: 'Achievements', suffix: '+' },
                  { value: '50', label: 'Streak Bonus', suffix: '%' },
                  { value: '∞', label: 'Books to Track', suffix: '' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl sm:text-5xl md:text-6xl font-black mb-2">
                      {stat.value}<span className="text-2xl sm:text-3xl">{stat.suffix}</span>
                    </div>
                    <div className="text-blue-100 text-sm sm:text-base">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Parents & Kids */}
      <section className="py-16 sm:py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* For Kids */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <span className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                  For Kids 📚
                </span>
                <h3 className="text-2xl sm:text-3xl font-black mb-4 sm:mb-6">
                  Turn Reading Into an Adventure
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    'Earn points for every minute you read',
                    'Build streaks and unlock achievements',
                    'Customize your cool avatar',
                    'Redeem points for awesome rewards',
                    'Track your reading progress',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm sm:text-base">
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-300 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* For Parents */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-6 sm:p-8 lg:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative">
                <span className="inline-block bg-white/20 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                  For Parents 👨‍👩‍👧‍👦
                </span>
                <h3 className="text-2xl sm:text-3xl font-black mb-4 sm:mb-6">
                  Guide & Monitor Progress
                </h3>
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    'Review and approve book selections',
                    'Create custom rewards that motivate',
                    'Track reading time and streaks',
                    'See detailed progress reports',
                    'Celebrate achievements together',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm sm:text-base">
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-300 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl opacity-20 scale-150"></div>
            <div className="relative">
              <div className="flex justify-center mb-6">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                  <Image 
                    src="/logo.png" 
                    alt="Reading Tracker" 
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 sm:mb-6">
                Ready to Start Reading?
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
                Join families building healthy reading habits together. 
                It's free to get started!
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold text-lg sm:text-xl hover:shadow-xl hover:shadow-purple-500/25 transition-all hover:scale-105"
              >
                Create Free Account
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image 
                  src="/logo.png" 
                  alt="Reading Tracker" 
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg">Reading Tracker</span>
            </div>
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Reading Tracker. Built with Love.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
                Sign In
              </Link>
              <Link href="/register" className="text-gray-400 hover:text-white transition-colors text-sm">
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS for blob animation */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}