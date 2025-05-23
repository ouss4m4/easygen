import { Link, useNavigate } from "react-router";
import { useState } from "react";
import logo from "@/assets/eg.svg";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthProvider";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/logout");
  };

  return (
    <nav className="bg-white shadow z-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 bg-white ">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              <img src={logo} alt="logo" />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/profile">
                  <Button className="cursor-pointer " variant="link">
                    Profile
                  </Button>
                </Link>
                <Button onClick={handleLogout} className="cursor-pointer" variant="link">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/signup">
                  <Button className="cursor-pointer" variant="link">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="cursor-pointer" variant="default">
                    Log In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="block">
                  <Button variant="link">Profile</Button>
                </Link>
                <Button onClick={handleLogout} className="cursor-pointer" variant="link">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                  Login
                </Link>
                <Link to="/signup" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
