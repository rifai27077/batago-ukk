"use client";

import { useState, useEffect, useRef } from "react";
import FloatingInput from "@/components/ui/FloatingInput";
import Image from "next/image";
import { Camera, X, Check, Minus, Plus, ShieldCheck, Briefcase, AlertCircle, Mail } from "lucide-react";
import { getProfile, updateProfile, uploadAvatar, resendVerification } from "@/lib/api";

interface CropModalProps {
  imageSrc: string;
  onCrop: (blob: Blob) => void;
  onClose: () => void;
}

function CropModal({ imageSrc, onCrop, onClose }: CropModalProps) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw the image onto the 400x400 canvas based on zoom and offset
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate scaling to fill the square
    const imgAspect = img.width / img.height;
    let drawW, drawH;
    
    if (imgAspect > 1) {
        drawH = canvas.height * zoom;
        drawW = drawH * imgAspect;
    } else {
        drawW = canvas.width * zoom;
        drawH = drawW / imgAspect;
    }

    const x = (canvas.width - drawW) / 2 + offset.x;
    const y = (canvas.height - drawH) / 2 + offset.y;

    ctx.drawImage(img, x, y, drawW, drawH);

    canvas.toBlob((blob) => {
      if (blob) onCrop(blob);
    }, "image/jpeg", 0.9);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg">Adjust Profile Picture</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div 
            className="aspect-square w-full relative bg-gray-100 rounded-xl overflow-hidden cursor-move border"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={(el) => {
                imgRef.current = el;
              }}
              src={imageSrc}
              alt="Crop"
              draggable={false}
              className="absolute pointer-events-none transition-transform duration-75 origin-center"
              style={{
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
                top: "50%",
                left: "50%",
                maxWidth: "none",
                maxHeight: "none",
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
            {/* Center crosshair or frame */}
            <div className="absolute inset-0 pointer-events-none border-2 border-primary/30 rounded-xl"></div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>Zoom</span>
                <span>{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
                <Minus className="w-4 h-4 text-gray-400" />
                <input 
                    type="range" 
                    min="1" 
                    max="3" 
                    step="0.01" 
                    value={zoom} 
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-primary"
                />
                <Plus className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          <canvas ref={canvasRef} width={400} height={400} className="hidden" />
        </div>

        <div className="p-4 bg-gray-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl font-bold bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Apply & Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatar_url: "",
    is_verified: false,
    partner_status: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Crop States
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getProfile();
        if (res.user) {
            setFormData({
                name: res.user.name,
                email: res.user.email,
                phone: res.user.phone,
                avatar_url: res.user.avatar_url || "",
                is_verified: !!res.user.is_verified,
                partner_status: res.user.partner_status || "",
            });
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    if (!formData.email) return;
    setIsResending(true);
    try {
        await resendVerification(formData.email);
        setMessage({ type: "success", text: "Verification email sent! Please check your inbox." });
    } catch (err) {
        setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to resend verification email" });
    } finally {
        setIsResending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage(reader.result as string);
            setShowCropModal(true);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (blob: Blob) => {
    setShowCropModal(false);
    try {
        setMessage({ type: "info", text: "Updating profile picture..." });
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        const res = await uploadAvatar(file);
        setFormData(prev => ({ ...prev, avatar_url: res.avatar_url }));
        setMessage({ type: "success", text: "Avatar uploaded successfully!" });
        
        // Notify Header to refresh profile data
        window.dispatchEvent(new Event("profileUpdated"));
    } catch (err) {
        setMessage({ type: "error", text: "Failed to upload avatar" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: "", text: "" });
    try {
        await updateProfile({
            name: formData.name,
            phone: formData.phone
        });
        setMessage({ type: "success", text: "Profile information updated successfully!" });
        
        // Notify Header to refresh profile data
        window.dispatchEvent(new Event("profileUpdated"));

        // Refresh profile to confirm
        const res = await getProfile();
        if (res.user) {
            setFormData(prev => ({
                ...prev,
                name: res.user?.name || prev.name,
                phone: res.user?.phone || prev.phone
            }));
        }
    } catch (err) {
        setMessage({ type: "error", text: err instanceof Error ? err.message : "Failed to update profile" });
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading profile...</div>;

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Verification Notice */}
      {!formData.is_verified && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-amber-100">
                <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-bold text-amber-900 mb-1">Verify your email</h3>
                <p className="text-sm text-amber-700 leading-relaxed max-w-lg">
                    Verify your email to secure your account and unlock all features like ticket downloads and writing reviews.
                </p>
            </div>
            <button 
                type="button"
                onClick={handleResendEmail}
                disabled={isResending}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-amber-100 border border-amber-200 text-amber-800 text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isResending ? (
                    <>Verifying...</>
                ) : (
                    <>
                        <Mail className="w-4 h-4" />
                        Resend Email
                    </>
                )}
            </button>
        </div>
      )}

      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl relative transition-transform group-hover:scale-105 active:scale-95 bg-gray-100">
                <Image
                src={formData.avatar_url || "https://img.freepik.com/premium-vector/default-avatar-profile-icon-gray-placeholder-vector-illustration_514344-14757.jpg?w=740"}
                alt="Profile"
                fill
                className="object-cover"
                unoptimized // Since it might be from localhost:8080
                />
            </div>
            <div className="absolute bottom-1 right-1 bg-primary p-2.5 rounded-full text-white shadow-lg group-hover:bg-primary-hover transition-all scale-90 group-hover:scale-100 border-2 border-white">
                <Camera className="w-4 h-4" />
            </div>
          </label>
          <input 
            id="avatar-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileSelect}
          />
        </div>
        <div className="text-center">
          <h2 className="font-bold text-lg text-gray-900">{formData.name || "Profile Photo"}</h2>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
              {formData.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100 uppercase tracking-tight">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Account
                  </span>
              )}
              {formData.partner_status && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100 uppercase tracking-tight">
                      <Briefcase className="w-3 h-3" />
                      Partner: {formData.partner_status}
                  </span>
              )}
          </div>
          <p className="text-[10px] text-gray-500 mt-2">JPEG, PNG or GIF (1:1 aspect ratio recommended)</p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 border ${
            message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 
            message.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 
            'bg-blue-50 text-blue-700 border-blue-100'
        }`}>
            {message.type === 'success' && <Check className="w-4 h-4" />}
            {message.type === 'error' && <X className="w-4 h-4" />}
            {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <FloatingInput
          label="Full Name"
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
        />
        <FloatingInput
          label="Email Address"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          disabled
        />
        <FloatingInput
          label="Phone Number"
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="px-10 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving Settings..." : "Save Changes"}
        </button>
      </div>
    </form>

    {showCropModal && selectedImage && (
        <CropModal 
            imageSrc={selectedImage}
            onClose={() => setShowCropModal(false)}
            onCrop={handleCropComplete}
        />
    )}
    </>
  );
}
