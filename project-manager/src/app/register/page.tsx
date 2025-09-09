"use client"

import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import Lottie from "lottie-react";
import TaskAnimation from '@/assets/Man with task list.json';

export default function Register() {
  return (
    <div className="min-h-screen flex bg-black text-white">

      <div className="flex flex-col justify-center items-center w-1/2 p-8 relative">
        <Link href="/" className="absolute top-4 right-4 text-sm hover:underline">
          Login
        </Link>
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>

      <div className="flex flex-col justify-between w-1/2 p-8 border-l border-gray-700">
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-semibold text-lg">Project Manager</span>
        </div>

        <Lottie animationData={TaskAnimation} loop={true} className="h-120" />

        <blockquote className="text-sm italic text-gray-400">
          Developed by Adil •DumbWays Indonesia • #1 Coding Bootcamp
        </blockquote>
      </div>
    </div>
  );
}
