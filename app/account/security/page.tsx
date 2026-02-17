import SecurityForm from "@/components/account/SecurityForm";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-foreground">Login & Security</h2>
        <p className="text-muted">Manage your password and security settings.</p>
      </div>
      <SecurityForm />
    </div>
  );
}
