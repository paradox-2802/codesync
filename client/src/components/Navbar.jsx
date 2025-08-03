import { ArrowRight } from "lucide-react";
import { useClerk, useUser, UserButton } from "@clerk/clerk-react";
import Logo from "./ui/Logo";

export function Navbar() {
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <nav className="sticky top-0 z-50 border-b bg-white backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* === Logo === */}
          <Logo />
          {/* === Right Side === */}
          <div>
            {user ? (
              <UserButton />
            ) : (
              <button
                onClick={openSignIn}
                className="flex items-center gap-2 px-5 py-2 border border-blue-600 text-white bg-blue-600 rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
