import React, { useState, useEffect } from "react";
import SkeletonLoader from "../common/SkeletonLoader";
import axios from "axios";
import Image from "next/image";

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true, // Send cookies
        }
      );

      // Assuming your API responds with appropriate status codes
      console.log("Login successful!", response.data);
      setApiError(null);

      // Handle successful login, e.g., redirect or update state
    } catch (error) {
      console.error("Login error:", error);
      setApiError("Failed to login. Please try again.");
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (loading) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-14 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <SkeletonLoader height="10" width="auto" />
          <SkeletonLoader height="8" width="40%" />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <SkeletonLoader height="2" width="100%" />
          <form className="space-y-6 mt-6" onSubmit={handleLogin}>
            <div>
              <SkeletonLoader height="8" width="100%" />
            </div>

            <div>
              <SkeletonLoader height="8" width="100%" />
            </div>

            <div>
              <SkeletonLoader height="12" width="100%" />
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500"></p>
          <SkeletonLoader height="8" width="40%" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto h-10 w-auto mb-6"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          width={400}
          height={100}
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
            {apiError && (
              <p className="mt-2 text-xs text-red-500">{apiError}</p>
            )}
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <a
            href="#"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Start a 14 day free trial
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
