import { RegisterForm } from "@/components/auth/RegisterForm";

export default function Register() {
  const cloudName = process.env.NEXT_APP_CLOUDINARY_CLOUD_NAME || "S";
  const uploadPreset = process.env.NEXT_APP_CLOUDINARY_UPLOAD_PRESET || "s";
  return (
    <div className="p-[20%]">
      <RegisterForm
        cloudinaryCloudName={cloudName}
        cloudinaryUploadPreset={uploadPreset}
      />
    </div>
  );
}
