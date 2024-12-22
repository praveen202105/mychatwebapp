"use client";

import { useUserStore } from "@/app/store/userStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
}

export default function RouteGuard({ children }: RouteGuardProps) {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // To prevent rendering during SSR

  useEffect(() => {
    if (user === null) {
      router.push("/login"); // Redirect to login if not logged in
    } else {
      setIsLoading(false); // Set loading to false once user is available
    }
  }, []);

  // Prevent rendering until the component is mounted on the client
  if (isLoading) {
    return null; // Or a loading spinner
  }

  return <>{user && children}</>;
}
