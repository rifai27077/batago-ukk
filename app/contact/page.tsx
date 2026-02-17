"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert("Message sent successfully!");
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <Header />
      
      <main className="flex-1 pt-[72px]">
         <div className="bg-gray-50 py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-6 text-center">
                 <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
                 <p className="text-muted max-w-2xl mx-auto">Have questions? We're here to help. Reach out to our team using the form below or through our direct channels.</p>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 -mt-8">
             <div className="grid lg:grid-cols-3 gap-8">
                 {/* Contact Info Cards */}
                 <div className="space-y-6">
                     <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Email Us</h3>
                            <p className="text-muted text-sm mb-2">For general inquiries and support</p>
                            <a href="mailto:support@batago.com" className="text-primary font-semibold hover:underline">support@batago.com</a>
                        </div>
                     </div>
                     
                     <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <Phone className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Call Us</h3>
                            <p className="text-muted text-sm mb-2">Mon-Fri from 8am to 5pm</p>
                            <a href="tel:+622112345678" className="text-primary font-semibold hover:underline">+62 21 1234 5678</a>
                        </div>
                     </div>

                     <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Visit Us</h3>
                            <p className="text-muted text-sm mb-2">Our main office HQ</p>
                            <p className="text-foreground font-medium">Jl. Sudirman No. 1, Jakarta</p>
                        </div>
                     </div>
                 </div>

                 {/* Contact Form */}
                 <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
                     <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                     <form onSubmit={handleSubmit} className="space-y-6">
                         <div className="grid md:grid-cols-2 gap-6">
                             <div className="space-y-2">
                                 <label className="text-sm font-semibold text-gray-700">Name</label>
                                 <input 
                                    type="text" 
                                    name="name"
                                    required 
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="Your Name"
                                 />
                             </div>
                             <div className="space-y-2">
                                 <label className="text-sm font-semibold text-gray-700">Email</label>
                                 <input 
                                    type="email" 
                                    name="email"
                                    required 
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="your@email.com"
                                 />
                             </div>
                         </div>
                         <div className="space-y-2">
                                 <label className="text-sm font-semibold text-gray-700">Subject</label>
                                 <input 
                                    type="text" 
                                    name="subject"
                                    required 
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="How can we help?"
                                 />
                         </div>
                         <div className="space-y-2">
                                 <label className="text-sm font-semibold text-gray-700">Message</label>
                                 <textarea 
                                    name="message"
                                    required 
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                    placeholder="Tell us more regarding your inquiry..."
                                 ></textarea>
                         </div>
                         <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                         >
                             {isSubmitting ? "Sending..." : (
                                 <>
                                    Send Message <Send className="w-4 h-4" />
                                 </>
                             )}
                         </button>
                     </form>
                 </div>
             </div>
         </div>
      </main>

      <Footer />
    </div>
  );
}
