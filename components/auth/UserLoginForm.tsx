"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { useUserStore } from "@/app/store/userStore";
import { useRouter } from "next/navigation";

export default function UserLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  // const { user, setUser } = useUserStore();
  const setUser = useUserStore((state) => state.setUser);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          toast({
            title: "Unauthorized",
            description: "Invalid username or password. Please try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Something went wrong. Please try again later.",
            variant: "destructive",
          });
        }
        return;
      }

      const data = await response.json();
      Cookies.set("authToken", data.token, { expires: 7 });

      setUser({
        id: data.user.id,
        username: data.user.username,
        fullName: data.user.fullName,
        profilePic: data.user.profilePic,
        gender: data.user.gender,
        dob: data.user.dob,
      });
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        variant: "success",
      });

      console.log("User Data Submitted:", data);
      router.push("/");
      // Handle successful login (e.g., redirect or set session)
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "Unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Username</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 w-full p-3 border rounded-md focus:ring-purple-600"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full p-3 border rounded-md focus:ring-purple-600"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-purple-900 text-white p-3 rounded-md"
      >
        Login
      </button>

      <p className="text-center mt-4 text-sm">
        Don't have an account?{" "}
        <button
          onClick={() => router.push("/register")}
          className="text-purple-600 hover:underline"
        >
          Create new
        </button>
      </p>
    </form>
  );
}
