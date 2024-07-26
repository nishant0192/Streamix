"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { checkLoggedInStatus, logout } from "../../features/authSlice";
import { RootState, AppDispatch } from "../../store";

const Logout: React.FC = () => {
  const [countdown, setCountdown] = useState(5);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check if the user is logged in
    dispatch(checkLoggedInStatus());

    if (!isLoggedIn) {
      // Redirect to login if the user is not authenticated
      router.push("/auth/login");
      return;
    }

    let countdownInterval: NodeJS.Timeout;

    const handleLogout = async () => {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
          {},
          { withCredentials: true }
        );

        // Dispatch logout action
        dispatch(logout());

        countdownInterval = setInterval(() => {
          setCountdown((prevCount) => {
            if (prevCount <= 1) {
              clearInterval(countdownInterval);
              router.push("/");
              router.refresh();
              return 0; // Ensure countdown doesn't go negative
            }
            return prevCount - 1;
          });
        }, 1000);

        toast.error("Logged Out successfully");
      } catch (error) {
        console.error("Logout failed", error);
      }
    };

    handleLogout();

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [isLoggedIn, dispatch, router]);

  if (!isLoggedIn) {
    return null; // Optionally return a loading state or nothing while redirecting
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-xl font-bold mb-4 text-white">
        Logging out in {countdown} {countdown === 1 ? "second" : "seconds"}...
      </p>
      {countdown === 0 && (
        <p className="text-lg text-white">
          You have successfully logged out. Redirecting to home page...
        </p>
      )}
    </div>
  );
};

export default Logout;
