import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <nav className="flex justify-between items-center mb-20">
          <h1 className="text-3xl font-bold text-white">FundTracker</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-6xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Track Your
                <span className="bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text"> Mutual Funds</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Real-time NAV data from AMFI India. Search, save, and manage your favorite mutual funds with intelligent autocomplete.
              </p>
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Tracking Free →
                </Button>
              </Link>
            </div>
            <div className="relative">
              <Image
                src="/hero-illustration.png"
                alt="Financial tracking illustration"
                width={500}
                height={500}
                className="w-full h-auto rounded-lg"
                priority
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="mb-6 flex justify-center">
              <Image
                src="/icon-search.png"
                alt="Smart search icon"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Smart Search</h3>
            <p className="text-gray-300 text-center">
              Amazon-style autocomplete suggestions as you type. Find any fund instantly from thousands of options.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="mb-6 flex justify-center">
              <Image
                src="/icon-favorites.png"
                alt="Favorites icon"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Save Favorites</h3>
            <p className="text-gray-300 text-center">
              Bookmark your favorite funds for quick access. Track NAV changes and stay updated.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="mb-6 flex justify-center">
              <Image
                src="/icon-realtime.png"
                alt="Real-time data icon"
                width={80}
                height={80}
                className="w-20 h-20"
              />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Real-time Data</h3>
            <p className="text-gray-300 text-center">
              Always up-to-date NAV data directly from AMFI India. No delays, no approximations.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <p className="text-gray-400 mb-4">Join thousands of smart investors</p>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
