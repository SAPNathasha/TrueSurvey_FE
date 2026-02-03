import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#FFFFFF]">

      {/* LEFT SIDE – CENTERED CONTENT */}
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

          {/* TEXT */}
          <h1 className="text-3xl font-semibold mb-2 text-[#16151A]">
            Welcome
          </h1>

          <p className="mb-8 text-[#16151A]">
            Create your account to start your journey.
          </p>

          {/* FORM */}
          <form className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#16151A]">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-xl px-3 py-2 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-[#061E29]"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium mb-1 text-[#16151A]">
                Password
              </label>
              <input
                type="password"
                placeholder="******"
                className="w-full border rounded-xl px-3 py-2 text-black placeholder-black/50 focus:outline-none focus:ring-2 focus:ring-[#061E29]"
              />
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-left text-sm">
              <Link
                href="#"
                className="text-[#5F9598] hover:underline"
              >
                Forgot Password
              </Link>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#061E29] text-white py-2 rounded-xl hover:opacity-90"
            >
              Log in
            </button>
          </form>

          {/* OR */}
          <div className="text-center text-sm text-gray-400 my-6">
            OR
          </div>

{/* SOCIAL LOGIN */}
<div className="flex justify-center gap-4">
  <Link
    href="#"
    className="border p-3 rounded-full hover:bg-gray-100"
  >
    <Image
      src="/faceBook.png"
      alt="Sign in with face book"
      width={20}
      height={20}
    />
  </Link>

  <Link
    href="#"
    className="border p-3 rounded-full hover:bg-gray-100"
  >
    <Image
      src="/google.png"
      alt="Sign in with Google"
      width={20}
      height={20}
    />
  </Link>

  <Link
    href="#"
    className="border p-3 rounded-full hover:bg-gray-100"
  >
    <Image
      src="/apple.png"
      alt="Sign in with Apple"
      width={20}
      height={20}
    />
  </Link>
</div>

          {/* SIGN UP LINK */}
          <p className="text-center text-sm mt-6 text-black/50">
            Already have an account?{" "}
            <Link href="/signup" className="text-[#5F9598] hover:underline">
              Sign in
            </Link>
          </p>

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
