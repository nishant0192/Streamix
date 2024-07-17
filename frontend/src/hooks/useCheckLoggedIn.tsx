import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
const useCheckLoggedIn = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkLoggedInStatus = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/status`,
          {},
          {
            withCredentials: true,
          }
        );
        console.log("User logged in status:", response.data);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Failed to check login status:", error);
        setIsLoggedIn(false);
        setError("Failed to check login status.");
      } finally {
        setLoading(false);
      }
    };

    checkLoggedInStatus();
  }, []);

  return { loading, isLoggedIn, error };
};

export default useCheckLoggedIn;
