import ProfileForm from "@/components/account/ProfileForm";

export default function PreferencesPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
        <p className="text-muted">Update your personal details and address.</p>
      </div>
      <ProfileForm />
    </div>
  );
}
