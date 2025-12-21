import Image from 'next/image';
import Link from 'next/link';

// Replace with the actual color code from Figma if available
const brandColor = 'bg-[#F24E1E]'; 
const brandHoverColor = 'hover:bg-[#D23C12]';

export default function SignIn() {
  return (
    <div className="flex min-h-screen w-full bg-white font-sans">
      {/* Left Side - Illustration and Logo */}
      <div className="hidden lg:flex w-1/2 bg-[#FFF5F2] relative flex-col justify-between p-8">
        {/* Logo */}
        <div className="absolute top-8 left-8">
          <Image
            src="/fortvest-logo.png" // Place your logo in the public folder
            alt="Fortvest Logo"
            width={150}
            height={40}
            priority
          />
        </div>
        {/* Illustration */}
        <div className="flex-grow flex items-center justify-center">
            <Image
            src="/fortvest-logo.png" // Place your illustration in the public folder
            alt="Fortvest Authentication"
            width={500}
            height={600}
            className="object-contain"
            priority
            />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Sign in
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Enter your login details below
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#F24E1E] focus:border-[#F24E1E] sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-gray-50 border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#F24E1E] focus:border-[#F24E1E] sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-start">
              <Link
                href="/forgot-password"
                className="font-medium text-sm text-[#F24E1E] hover:text-[#D23C12]"
              >
                Forgot password
              </Link>
            </div>

            <div className="space-y-4">
              <button
                type="submit"
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${brandColor} ${brandHoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F24E1E]`}
              >
                Login
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                 <Image
                  src="/globe.svg" // Place a Google G logo svg in your public folder
                  alt="Google Logo"
                  width={20}
                  height={20}
                  className="mr-3"
                />
                Continue with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}