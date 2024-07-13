import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SignupForm: React.FC = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

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
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        { username, email, password },
        { withCredentials: true }
      );

      toast.success("Signup successful!");
      console.log("Signup successful!", response.data);
      setApiError(null);
      setUsername("");
      setEmail("");
      setPassword("");
      router.push("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setApiError(error.response.data.message);
        } else {
          setApiError("Failed to Signup. Please try again.");
        }
      } else {
        setApiError("An error occurred. Please try again later.");
      }
      setPassword(""); // Clear password field on error
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
    setPassword(password); // Update password state
  };

  const getProgressBarColor = (strength: number): string => {
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-orange-500";
    if (strength === 3) return "bg-yellow-500";
    if (strength >= 4) return "bg-green-500";
    return "bg-gray-300";
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Toaster /> {/* Ensure Toaster is rendered to display toasts */}
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
                    className={`h-full rounded-full ${getProgressBarColor(
                      passwordStrength
                    )}`}
                    style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="ml-2">
                  <span className="text-xs font-semibold">
                    Password Strength
                  </span>
                </div>
              </div>
            </div>
            {passwordError && (
              <p className="mt-2 text-xs text-red-500">{passwordError}</p>
            )}
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

export default SignupForm;
