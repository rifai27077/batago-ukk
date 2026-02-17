"use client";

import { useState } from "react";
import FloatingInput from "@/components/ui/FloatingInput";

export default function SecurityForm() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log("Updating password...", formData);
    alert("Password updated successfully!");
    setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-6">
      <FloatingInput
        label="Current Password"
        id="currentPassword"
        name="currentPassword"
        type="password"
        value={formData.currentPassword}
        onChange={handleChange}
      />
      <FloatingInput
        label="New Password"
        id="newPassword"
        name="newPassword"
        type="password"
        value={formData.newPassword}
        onChange={handleChange}
      />
      <FloatingInput
        label="Confirm New Password"
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        className={formData.newPassword !== formData.confirmPassword && formData.confirmPassword ? "border-red-500 focus:border-red-500" : ""}
      />
      
      {formData.newPassword !== formData.confirmPassword && formData.confirmPassword && (
        <p className="text-red-500 text-xs -mt-4">Passwords do not match</p>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={!formData.currentPassword || !formData.newPassword || formData.newPassword !== formData.confirmPassword}
          className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Update Password
        </button>
      </div>
    </form>
  );
}
