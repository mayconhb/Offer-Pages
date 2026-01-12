import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col">
      <header className="p-6 border-b border-gray-100">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tighter text-blue-600">
            SALUD
          </div>
          <nav className="flex gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/services" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Services
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">SALUD</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            Your health, our priority. Experience premium healthcare services designed for your wellbeing.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Get Started
            </button>
            <button className="px-8 py-3 border border-gray-200 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </main>
      
      <footer className="p-6 border-t border-gray-100 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} SALUD Healthcare. All rights reserved.
      </footer>
    </div>
  );
}
