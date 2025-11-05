import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
const Header = () => {
  return (
    <header className="glass-effect border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <Link className="block" href="/">
              <span className="sr-only">Home</span>
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-neon">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold gradient-text">
                  AI Interview
                </span>
              </div>
            </Link>
          </div>

          <div className="md:flex md:items-center md:gap-8">
            <nav aria-label="Global" className="md:block">
              <ul className="flex items-center gap-6">
                <SignedIn>
                  <li>
                    <Link href={"/resume"} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-6 rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300 inline-block">
                      Dashboard
                    </Link>
                  </li>
                </SignedIn>
              </ul>
            </nav>
            <div className="flex gap-4 items-center">
              <SignedOut>
                <div className="glass-effect border border-white/10 hover:bg-white/5 text-gray-300 px-4 py-2 rounded-xl transition-all duration-300">
                  <SignUpButton />
                </div>
              </SignedOut>
              <SignedOut>
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl shadow-neon hover:shadow-neon-hover transition-all duration-300">
                  <SignInButton />
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
