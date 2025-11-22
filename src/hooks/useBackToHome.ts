import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Redirects user to HOME ("/") when pressing browser back button.
 */
export function useBackToHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBack = () => {
      navigate("/", { replace: true });
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [navigate]);
}
