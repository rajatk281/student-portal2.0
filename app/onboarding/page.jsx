"use client"

import React from 'react';
import { Linkedin, Github } from 'lucide-react'; // Optional: Use an icon library
import { handleGitHubSignIn, handleGoogleSignIn, handleLinkedInSignIn } from '../hooks/handlers';

// Custom Google Icon component
const GoogleIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.6z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const SignupCard = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      {/* The Card Container */}
      <div className="relative group">
        {/* Subtle Background Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-700 to-gray-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

        <div className="relative flex flex-col items-center justify-center h-96 w-[400px] bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-8 py-10">

          {/* Logo/Brand Branding */}
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Join Nexora</h2>
            <p className="text-gray-400 text-sm">Select your platform to continue</p>
          </div>

          {/* Buttons Stack */}
          <div className="w-full space-y-4">
            <form action={handleGoogleSignIn}><SocialButton icon={<GoogleIcon size={20} />} label="Google" /></form>
            <form action={handleLinkedInSignIn}><SocialButton icon={<Linkedin size={20} />} label="LinkedIn" /></form>
            <form action={handleGitHubSignIn}><SocialButton icon={<Github size={20} />} label="GitHub" /></form>
          </div>

          <p className="mt-8 text-xs text-gray-500 uppercase tracking-widest">
            Crafted for Modern Education
          </p>
        </div>
      </div>
    </div>
  );
};

// Reusable Button Component for better clean code
const SocialButton = ({ icon, label }) => (
  <button className="flex items-center justify-center gap-3 w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-medium transition-all duration-300 active:scale-[0.98]">
    <span className="opacity-80">{icon}</span>
    <span>Sign up with {label}</span>
  </button>
);

export default SignupCard;