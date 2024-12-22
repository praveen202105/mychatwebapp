"use client";
import RouteGuard from "@/components/auth/RouteGuard";
import { useUserStore } from "./store/userStore";

export default function Home() {
  console.log("cloud name", process.env.NEXT_APP_CLOUDINARY_CLOUD_NAME);
  const user = useUserStore((state) => state.user);

  console.log(user?.username);
  return (
    <RouteGuard>
      <div>Welcome to the Dashboard!</div>
      <div></div>
    </RouteGuard>
  );
}
