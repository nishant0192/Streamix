"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { checkLoggedInStatus } from "../../features/authSlice";
import toast, { Toaster } from "react-hot-toast";

const SignupForm: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading: checkLoading, isLoggedIn } = useSelector(
    (state: RootState) => state.auth
  );

  const [loading, setLoading] = useState(true);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    dispatch(checkLoggedInStatus() as any); // Check login status on component mount
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      const countdownTimer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      const redirectTimer = setTimeout(() => {
        router.push("/");
      }, 5000);

      return () => {
        clearInterval(countdownTimer);
        clearTimeout(redirectTimer);
      };
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, router]);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!passwordValid) {
      setPasswordError("Please enter a strong password.");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        { username, email, password },
        { withCredentials: true }
      );
      toast.success("Signup successful!");
      setApiError(null);
      setUsername("");
      setEmail("");
      setPassword("");
      dispatch(checkLoggedInStatus() as any); // Trigger a status check after registration
    } catch (error: any) {
      console.error("Signup error:", error);
      setApiError(error.response?.data.message || "Failed to Signup. Please try again.");
      setPassword("");
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (/[a-z]+/.test(password)) strength += 1;
    if (/[A-Z]+/.test(password)) strength += 1;
    if (/\d+/.test(password)) strength += 1;
    if (/[!@#$%^&*]+/.test(password)) strength += 1;
    if (password.length >= 8) strength += 1;
    return strength;
  };

  const validatePassword = (password: string): boolean => {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    return regex.test(password);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordValid(validatePassword(password));
    setPasswordStrength(calculatePasswordStrength(password));
    setPasswordError(null);
    setPassword(password);
  };

  const getProgressBarColor = (strength: number): string => {
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-orange-500";
    if (strength === 3) return "bg-yellow-500";
    if (strength >= 4) return "bg-green-500";
    return "bg-gray-300";
  };

  if (checkLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            User is already logged in
          </h2>
          {countdown > 0 && (
            <p className="mt-4 text-center text-lg text-gray-700">
              Redirecting in {countdown}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Toaster />
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          className="mx-auto h-10 w-auto mb-6"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          width={400}
          height={100}
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Signup to your account
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleRegister}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={handlePasswordChange}
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  passwordError ? "border-red-500" : ""
                }`}
              />
              <div className="mt-2 flex items-center">
                <div className="w-full bg-gray-300 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${getProgressBarColor(
                      passwordStrength
                    )}`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  />
                </div>
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
              </div>
            </div>
          </div>
          {apiError && (
            <div className="text-red-500 text-xs mt-2">{apiError}</div>
          )}
          <div>
            <button
              type="submit"
              className="block w-full rounded-md bg-indigo-600 px-3 py-1.5 text-base font-semibold text-white shadow-sm ring-1 ring-gray-300 hover:bg-indigo-700 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
