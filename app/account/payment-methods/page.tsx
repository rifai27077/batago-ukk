import PaymentMethods from "@/components/account/PaymentMethods";

export default function PaymentMethodsPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-bold text-foreground">Payment Methods</h2>
        <p className="text-muted">Add and manage your payment cards.</p>
      </div>
      <PaymentMethods />
    </div>
  );
}
