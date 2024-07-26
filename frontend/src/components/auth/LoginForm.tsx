"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { checkLoggedInStatus } from "../../features/authSlice";
import toast from "react-hot-toast";

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading: checkLoading, isLoggedIn } = useSelector(
    (state: RootState) => state.auth
  );

  const [apiError, setApiError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [countdownActive, setCountdownActive] = useState(false);

  useEffect(() => {
    dispatch(checkLoggedInStatus() as any);
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      toast.success("Login successful!");
      setCountdownActive(true);
      const countdownTimer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(countdownTimer);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);

      const redirectTimer = setTimeout(() => {
        router.push("/");
      }, 5000);

      return () => {
        clearInterval(countdownTimer);
        clearTimeout(redirectTimer);
      };
    }
  }, [isLoggedIn, router]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      toast.success("Login successful!");
      setApiError(null);
      dispatch(checkLoggedInStatus() as any); // Trigger a status check
    } catch (error: any) {
      setApiError("Failed to login. Please try again.");
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (checkLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold">User is already logged in</h2>
          {countdownActive && (
            <p className="mt-4 text-lg">Redirecting in {countdown}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 py-12">
      <div className="sm:w-full sm:max-w-sm text-white">
        <Image
          className="mx-auto h-10 w-auto mb-6"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          width={400}
          height={100}
          alt="Your Company"
        />
        <h2 className="text-center text-2xl font-bold leading-9">
          Sign in to your account
        </h2>
        <form className="space-y-6 mt-10" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6"
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
                className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-black shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
            {apiError && (
              <p className="mt-2 text-xs text-red-500">{apiError}</p>
            )}
          </div>
        </form>

        <p className="mt-10 text-center text-sm">
          Not a member?{" "}
          <a
            href="#"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
          >
            Start a 14-day free trial
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
