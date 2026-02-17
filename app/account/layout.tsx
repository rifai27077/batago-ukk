import AccountSidebar from "@/components/account/AccountSidebar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col font-sans">
      <Header />
      
      {/* Page Header (reusing style from other pages if possible or simple header) */}
      <div className="relative h-[200px] md:h-[250px] w-full bg-primary mt-[72px]">
         <div className="absolute inset-0 bg-linear-to-r from-primary to-primary-hover opacity-90"></div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-end pb-8 md:pb-12">
                <div>
                   <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Account Settings</h1>
                   <p className="text-white/80 text-lg">Manage your profile and preferences</p>
                </div>
            </div>
      </div>

      <main className="grow max-w-7xl mx-auto px-6 py-8 md:py-12 w-full -mt-20 relative z-20">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-1/4">
            <AccountSidebar />
          </aside>
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8 min-h-[500px]">
                {children}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
