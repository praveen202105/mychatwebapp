"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface RegisterFormProps {
  cloudinaryCloudName: string;
  cloudinaryUploadPreset: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  cloudinaryCloudName,
  cloudinaryUploadPreset,
}) => {
  const { toast } = useToast();
  const [registerData, setRegisterData] = useState({
    username: "",
    profilePic: null as File | null,
    gender: "",
    dob: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  useEffect(() => {
    console.log("cloud name", process.env.NEXT_APP_CLOUDINARY_CLOUD_NAME);
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "profilePic" && files) {
      setRegisterData({ ...registerData, profilePic: files[0] });
    } else {
      setRegisterData({ ...registerData, [name]: value });
    }
  };
  // praveenchatapp

  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`;
  const CLOUDINARY_UPLOAD_PRESET = cloudinaryUploadPreset;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("dsad", registerData);

    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Registration Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 1. Upload the profile picture to Cloudinary
      let profilePicUrl = "";
      // console.log("aaya nhi");
      if (registerData.profilePic) {
        // console.log("aaya");

        const formData = new FormData();
        formData.append("file", registerData.profilePic);
        if (CLOUDINARY_UPLOAD_PRESET)
          formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryResponse = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });
        const cloudinaryData = await cloudinaryResponse.json();
        // console.log("cccc", cloudinaryData);

        if (!cloudinaryResponse.ok) {
          throw new Error("Cloudinary upload failed");
        }

        profilePicUrl = cloudinaryData.secure_url; // Get the URL of the uploaded image
      }
      // console.log("link", profilePicUrl);

      // // 2. Submit the other form data with the profile picture URL
      const response = await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...registerData,
          profilePic: profilePicUrl, // Include the uploaded profile picture URL
        }),
      });

      // if (!response.ok) {
      //   // Check for HTTP errors (4xx or 5xx status codes)
      //   let errorMessage = "Registration failed."; // Default error message

      //   try {
      //     const errorData = await response.json(); // Try to parse JSON error response
      //     errorMessage = errorData.message || errorMessage; // Use server's message if available
      //     console.error("Server Error (JSON):", errorData);
      //   } catch (jsonError) {
      //     try {
      //       const errorText = await response.text();
      //       errorMessage = errorText || errorMessage;
      //       console.error("Server Error (Text):", errorText);
      //     } catch (textError) {
      //       console.error("Could not parse error response", textError);
      //     }
      //   }

      //   throw new Error(errorMessage); // Throw an error to be caught by the outer catch block
      // }

      // If response.ok is true (status in 200-299 range)
      const responseData = await response.json(); // Await the JSON parsing
      if (response.status === 201) {
        toast({
          title: "Registered Successful",
          description: "Welcome !",
          variant: "success",
        });
        return;
      } else {
        console.log("res", responseData.message);

        toast({
          title: "Error",
          description: responseData.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("weee", error);

      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
      return;
      // console.error("Registration failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="block text-sm font-medium">Username</Label>
        <Input
          type="text"
          name="username"
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />
      </div>

      <div className="flex flex-col items-center space-y-3">
        <Label htmlFor="profilePic" className="block text-sm font-medium">
          Profile Picture
        </Label>
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
          {registerData.profilePic ? (
            <img
              src={URL.createObjectURL(registerData.profilePic)}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              <span className="text-sm">Upload</span>
            </div>
          )}
        </div>
        <input
          type="file"
          id="profilePic"
          name="profilePic"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <label
          htmlFor="profilePic"
          className="text-purple-600 cursor-pointer hover:underline"
        >
          Choose Image
        </label>
      </div>

      <div>
        <Label className="block text-sm font-medium">Gender</Label>

        <Select
          onValueChange={(value) =>
            setRegisterData({ ...registerData, gender: value })
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="block text-sm font-medium">Date of Birth</Label>
        <Input
          type="date"
          name="dob"
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />
      </div>

      <div>
        <Label className="block text-sm font-medium">Full Name</Label>
        <Input
          type="text"
          name="fullName"
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />
      </div>

      <div>
        <Label className="block text-sm font-medium">Password</Label>
        <Input
          type="password"
          name="password"
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />
      </div>

      <div>
        <Label className="block text-sm font-medium">Confirm Password</Label>
        <Input
          type="password"
          name="confirmPassword"
          onChange={handleChange}
          className="w-full p-3 border rounded-md"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-purple-900 text-white p-3 rounded-md"
      >
        Register
      </Button>

      <p className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <button
          // onClick={onBackToLogin}
          className="text-purple-600 hover:underline"
        >
          Login here
        </button>
      </p>
    </form>
  );
};
