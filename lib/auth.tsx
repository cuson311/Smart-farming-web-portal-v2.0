"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const isAuthenticated = () => {
  return (
    typeof window !== "undefined" && localStorage.getItem("token") !== null
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace(`/login`);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Loading...</p>;

  return <>{children}</>;
};

export default ProtectedRoute;
