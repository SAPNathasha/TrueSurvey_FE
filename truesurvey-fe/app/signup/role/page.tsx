"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Role = "participant" | "creator" | "both";

export default function SignupRolePage() {
  const [selectedRole, setSelectedRole] = useState<Role>("participant");

  const roleButton = (role: Role, label: string) => {
    const isActive = selectedRole === role;

    return (
      <button
        type="button"
        onClick={() => setSelectedRole(role)}
        className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl border transition
          ${
            isActive
              ? "bg-[#1D546D] text-white border-[#1D546D]"
              : "bg-[#1D546D] text-white border-[#1D546D] opacity-100"
          }
        `}
      >
        <div className="w-6 h-6 flex items-center justify-center border rounded bg-white">
          {isActive && <span className="text-black font-bold">✓</span>}
        </div>
        <span className="font-medium tracking-wide">
          {label}
        </span>
      </button>
    );
  };

  return (
    <div className="min-h-screen flex bg-[#FFFFFF]">

      {/* LEFT SIDE */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <div className="mb-10">
            <Image
              src="/main-logo.png"
              alt="TrueSurvey Logo"
              width={140}
              height={40}
              priority
            />
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-semibold mb-2 text-[#16151A]">
            Choose Your Role
          </h1>

          <p className="mb-8 text-[#16151A] text-sm">
            You can participate in surveys, create surveys, or do both.
            You can change this anytime.
          </p>

          {/* ROLE OPTIONS */}
          <div className="space-y-4 mb-10">
            {roleButton("participant", "PARTICIPATE & EARN")}
            {roleButton("creator", "CREATE SURVEYS")}
            {roleButton("both", "BOTH")}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4">
            <Link
              href="/signup"
              className="w-1/2 text-center bg-[#061E29] text-white py-2 rounded-xl hover:opacity-90"
            >
              Back
            </Link>

            <button
              type="button"
              className="w-1/2 bg-[#061E29] text-white py-2 rounded-xl hover:opacity-90"
            >
              Create account
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE – IMAGE */}
      <div className="w-1/2 relative hidden md:block">
        <Image
          src="/login-img 1.png"
          alt="Survey illustration"
          fill
          className="object-cover"
        />
      </div>

    </div>
  );
}
