"use client";

import { useState } from "react";
import FloatingInput from "@/components/ui/FloatingInput";
import Image from "next/image";
import { Camera } from "lucide-react";

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    firstName: "Ahmad",
    lastName: "Rifai",
    email: "rifai@batago.com",
    phone: "+62 812-3456-7890",
    address: "Jl. Jenderal Sudirman No. 1",
    city: "Jakarta",
    zipCode: "12190",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log("Saving profile...", formData);
    alert("Profile saved successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-sm relative">
            <Image
              src="data:image/jpeg;base64,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"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white shadow-md group-hover:bg-primary-hover transition-colors">
            <Camera className="w-4 h-4" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="font-bold text-lg">Change Profile Photo</h2>
          <p className="text-xs text-muted">Allowed *.jpeg, *.jpg, *.png, *.gif</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput
          label="First Name"
          id="firstName"
          name="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
        />
        <FloatingInput
          label="Last Name"
          id="lastName"
          name="lastName"
          type="text"
          value={formData.lastName}
          onChange={handleChange}
        />
        <FloatingInput
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <FloatingInput
          label="Phone Number"
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
        <div className="md:col-span-2">
            <FloatingInput
                label="Address"
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
            />
        </div>
        <FloatingInput
          label="City"
          id="city"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
        />
         <FloatingInput
          label="Zip Code"
          id="zipCode"
          name="zipCode"
          type="text"
          value={formData.zipCode}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
