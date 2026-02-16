export default function GuestDetailsForm() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Guest Details</h2>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground block">First Name</label>
            <input 
              type="text" 
              placeholder="e.g. James" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground block">Last Name</label>
            <input 
              type="text" 
              placeholder="e.g. Doe" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground block">Email Address</label>
            <input 
              type="email" 
              placeholder="james.doe@example.com" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
            />
            <p className="text-xs text-muted">Booking confirmation will be sent here</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground block">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+62 812 3456 7890" 
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50"
            />
          </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground block">Special Requests (Optional)</label>
            <textarea 
              placeholder="e.g. Late check-in, Non-smoking room" 
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder:text-muted/50 resize-none"
            />
        </div>
      </form>
    </div>
  );
}
