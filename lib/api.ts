const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1";

// --- Token Management ---
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("batago_token");
}

export function setToken(token: string) {
  localStorage.setItem("batago_token", token);
}

export function removeToken() {
  localStorage.removeItem("batago_token");
}

// --- Base Fetch ---
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `API error: ${res.status}`);
  }

  return res.json();
}

// --- Auth ---
export interface AuthResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
    is_verified: boolean;
    phone: string;
    partner_status?: string;
    partner_company_name?: string;
    partner_type?: string;
    partner_address?: string;
  };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (data.token) {
    setToken(data.token);
  }
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  phone: string
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, phone }),
  });
}

export async function verifyEmail(email: string, code: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/verify", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function resendVerification(email: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/verify/resend", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function getProfile() {
  return apiFetch<{ user: AuthResponse["user"] }>("/profile");
}

export async function getNotifications() {
    return apiFetch<{ data: any[] }>("/notifications");
}

export async function markNotificationAsRead(id: number) {
    return apiFetch<void>(`/notifications/${id}/read`, { method: "PUT" });
}

export async function markAllNotificationsAsRead() {
    return apiFetch<void>("/notifications/read-all", { method: "PUT" });
}

export async function updateProfile(data: { name?: string; phone?: string; company_name?: string; company_type?: string; address?: string }) {
  return apiFetch<{ message: string; user: AuthResponse["user"] }>("/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export interface BecomePartnerData {
  company_name: string;
  type: string;
  address: string;
}

export async function becomePartner(data: BecomePartnerData): Promise<{ message: string; partner: any }> {
  return apiFetch<{ message: string; partner: any }>("/profile/partner", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export interface PartnerRegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  company_name: string;
  type: string;
  address: string;
}

export async function registerPartner(data: PartnerRegisterData): Promise<{ message: string; email: string }> {
  return apiFetch<{ message: string; email: string }>("/auth/partner/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  // Custom fetch because apiFetch sets Content-Type to application/json by default
  const token = getToken();
  const headers: HeadersInit = {};
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/profile/avatar`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Upload failed: ${res.status}`);
  }

  return res.json() as Promise<{ message: string; avatar_url: string }>;
}

export function logout() {
  removeToken();
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/password/forgot", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  email: string,
  code: string,
  password: string,
  confirm_password: string
): Promise<{ message: string }> {
  return apiFetch<{ message: string }>("/auth/password/reset", {
    method: "POST",
    body: JSON.stringify({ email, code, password, confirm_password }),
  });
}

// --- Flights ---
export interface FlightResult {
  ID: number;
  flight_number: string;
  airline: string;
  departure_airport: { code: string; name: string; city: string };
  arrival_airport: { code: string; name: string; city: string };
  departure_time: string;
  arrival_time: string;
  duration: number;
  baggage_allowance_kg: number;
  partner: { company_name: string };
  seats: {
    class: string;
    price: number;
    available_seats: number;
  }[];
}

export interface SearchFlightsParams {
  from?: string;
  to?: string;
  date?: string;
  class?: string;
  passengers?: number;
  page?: number;
  limit?: number;
}

export async function searchFlights(params: SearchFlightsParams) {
  const query = new URLSearchParams();
  if (params.from) query.set("from", params.from);
  if (params.to) query.set("to", params.to);
  if (params.date) query.set("date", params.date);
  if (params.class) query.set("class", params.class);
  if (params.passengers) query.set("passengers", String(params.passengers));
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  return apiFetch<{ data: FlightResult[]; meta: { page: number; limit: number; total: number } }>(
    `/flights?${query.toString()}`
  );
}

// --- Flights ---
export interface FlightDetailResponse {
  flight: {
    ID: number;
    flight_number: string;
    airline: string;
    departure_airport: { code: string; name: string; city: string };
    arrival_airport: { code: string; name: string; city: string };
    departure_time: string;
    arrival_time: string;
    duration: number;
    baggage_allowance_kg: number;
    partner: { company_name: string };
  };
  seats: {
    ID: number;
    class: string;
    price: number;
    total_seats: number;
    available_seats: number;
    features: string;
  }[];
}

export async function getFlightDetail(id: number | string) {
  return apiFetch<{ data: FlightDetailResponse }>(`/flights/${id}`);
}

export async function searchAirports(q: string) {
  return apiFetch<{ data: { ID: number; code: string; name: string; city: string; country: string }[] }>(
    `/airports?q=${encodeURIComponent(q)}`
  );
}

// --- Hotels ---
export interface HotelResult {
  ID: number;
  name: string;
  description: string;
  address: string;
  rating: number;
  total_reviews: number;
  city: { name: string; country: string };
  images: { url: string; is_primary: boolean }[];
  facilities: { name: string; icon: string }[];
  lowest_price: number;
}

export interface SearchHotelsParams {
  city?: string;
  checkin?: string;
  checkout?: string;
  guests?: number;
  page?: number;
  limit?: number;
}

export async function searchHotels(params: SearchHotelsParams) {
  const query = new URLSearchParams();
  if (params.city) query.set("city", params.city);
  if (params.checkin) query.set("checkin", params.checkin);
  if (params.checkout) query.set("checkout", params.checkout);
  if (params.guests) query.set("guests", String(params.guests));
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  return apiFetch<{ data: HotelResult[]; meta: { page: number; limit: number; total: number } }>(
    `/hotels?${query.toString()}`
  );
}

export interface RoomTypeResult {
  ID: number;
  name: string;
  description: string;
  size_m2: number;
  max_guests: number;
  base_price: number;
  features: string;
  images: { ID: number; url: string }[];
}

export interface ReviewResult {
  ID: number;
  rating: number;
  comment: string;
  CreatedAt: string;
  user: { name: string; email: string };
}

export async function getHotelDetail(id: number) {
  return apiFetch<{ data: { hotel: HotelResult; rooms: RoomTypeResult[]; reviews: ReviewResult[] } }>(
    `/hotels/${id}`
  );
}

export async function searchCities(q?: string, popular?: boolean) {
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (popular) query.set("popular", "true");
  return apiFetch<{ data: { ID: number; name: string; country: string; image_url: string; is_popular: boolean }[] }>(
    `/cities?${query.toString()}`
  );
}

// --- Bookings ---
export interface BookingResult {
  ID: number;
  booking_code: string;
  type: string;
  payment_status: string;
  booking_status: string;
  total_amount: number;
  expires_at: string;
  CreatedAt: string;
  partner: { company_name: string };
}

export async function getMyBookings(type?: string, page = 1, limit = 10) {
  const query = new URLSearchParams();
  if (type) query.set("type", type);
  query.set("page", String(page));
  query.set("limit", String(limit));

  return apiFetch<{ data: BookingResult[]; meta: { page: number; limit: number; total: number } }>(
    `/bookings?${query.toString()}`
  );
}

export interface BookingDetailResponse {
  booking: BookingResult;
  flight_booking?: {
    flight: {
      flight_number: string;
      airline: string;
      departure_airport: { code: string; name: string; city: string };
      arrival_airport: { code: string; name: string; city: string };
      departure_time: string;
      arrival_time: string;
    };
    class: string;
  };
  passengers?: { title: string; name: string; passport_number: string }[];
  e_ticket?: { eticket_number: string; file_url: string };
  voucher?: { voucher_code: string; file_url: string; valid_until: string };
  payment?: { payment_method: string; amount: number; status: string; transaction_id: string };
}

export async function getBookingDetail(id: number | string) {
  return apiFetch<{ data: BookingDetailResponse }>(`/bookings/${id}`);
}

export async function createFlightBooking(
  flightId: number,
  flightClass: string,
  passengers: { name: string; type: string }[]
) {
  return apiFetch<{ message: string; booking_code: string; booking_id: number; total_amount: number }>(
    "/bookings/flight",
    {
      method: "POST",
      body: JSON.stringify({
        flight_id: flightId,
        class: flightClass,
        passengers,
      }),
    }
  );
}

export async function createHotelBooking(
  roomTypeId: number,
  checkIn: string,
  checkOut: string,
  guests: number
) {
  return apiFetch<{ message: string; booking_code: string; booking_id: number; total_amount: number }>(
    "/bookings/hotel",
    {
      method: "POST",
      body: JSON.stringify({
        room_type_id: roomTypeId,
        check_in: checkIn,
        check_out: checkOut,
        guests,
      }),
    }
  );
}

// --- Payments ---
export interface PaymentTokenResponse {
  snap_token: string;
  redirect_url: string;
  booking_code: string;
  amount: number;
  expires_at: string;
}

export async function createPaymentToken(bookingId: number) {
  return apiFetch<PaymentTokenResponse>("/payments/token", {
    method: "POST",
    body: JSON.stringify({ booking_id: bookingId }),
  });
}

// --- Reviews ---
export async function createReview(bookingId: number, rating: number, comment: string) {
  return apiFetch<{ message: string; data: unknown }>("/reviews", {
    method: "POST",
    body: JSON.stringify({
      booking_id: bookingId,
      rating,
      comment,
    }),
  });
}

export async function cancelBooking(id: number | string) {
  return apiFetch<{ message: string }>(`/bookings/${id}`, {
    method: "DELETE",
  });
}

// --- Partner Dashboard ---
export interface DashboardStats {
  bookings: { total: number; trend: number };
  revenue: { total: number; trend: number };
  occupancy: { rate: number; trend: number };
  rating: { average: number; count: number; trend: number };
  recent_activity: { title: string; desc: string; time: string; type: string }[];
}

export async function getDashboardStats() {
  return apiFetch<{ data: DashboardStats }>("/partner/dashboard");
}

// --- Partner Listings ---
export interface PartnerListing {
  ID: number;
  name: string;
  address: string;
  description: string;
  rating: number;
  total_reviews: number;
  city: { name: string; country: string };
  images: { url: string; is_primary: boolean }[];
  rooms: number;
  room_count?: number;
  occupancy: number;
  status: string;
  type?: string;
}

export async function getPartnerListings(params?: { page?: number; limit?: number; search?: string; status?: string; type?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  if (params?.status) query.set("status", params.status);
  if (params?.type) query.set("type", params.type);
  return apiFetch<{ data: PartnerListing[]; meta: { page: number; limit: number; total: number } }>(
    `/partner/listings?${query.toString()}`
  );
}

export async function createPartnerListing(data: { 
  name: string; 
  city_id?: number; 
  description?: string; 
  address: string;
  type?: string;
  rooms?: number;
  price?: number | string;
  amenities?: string[];
  image_url?: string;
  latitude?: number;
  longitude?: number;
}) {
  return apiFetch<{ message: string; data: PartnerListing }>("/partner/listings", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      price: typeof data.price === 'string' ? parseFloat(data.price.replace(/[^0-9.]/g, '')) : data.price
    }),
  });
}

export async function uploadListingImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const token = getToken();
  const headers: HeadersInit = {};
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/partner/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Upload failed: ${res.status}`);
  }

  return res.json() as Promise<{ url: string }>;
}

export async function updatePartnerListing(id: number, data: Record<string, unknown>) {
  return apiFetch<{ message: string; data: PartnerListing }>(`/partner/listings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deletePartnerListing(id: number) {
  return apiFetch<{ message: string }>(`/partner/listings/${id}`, { method: "DELETE" });
}

// --- Partner Promotions ---
export interface PartnerPromotion {
  ID: number;
  name: string;
  type: "flash_sale" | "last_minute" | "early_bird" | "seasonal";
  discount: number;
  status: "active" | "scheduled" | "paused" | "expired";
  start_date: string;
  end_date: string;
  listings: number[];
  claims: number;
  revenue: number;
}

export async function getPartnerPromotions(params?: { page?: number; limit?: number; search?: string; status?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.search) query.set("search", params.search);
  if (params?.status) query.set("status", params.status);
  return apiFetch<{
    data: PartnerPromotion[];
    meta: {
      page: number;
      limit: number;
      total: number;
      stats?: {
        total_active: number;
        total_claims: number;
        total_revenue: number;
      };
    };
  }>(
    `/partner/promotions?${query.toString()}`
  );
}

export async function createPartnerPromotion(data: { name: string; type: string; discount: number; status?: string; start_date: string; end_date: string; listings?: number[] }) {
  return apiFetch<{ message: string; data: PartnerPromotion }>("/partner/promotions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updatePartnerPromotion(id: number, data: Record<string, unknown>) {
  return apiFetch<{ message: string; data: PartnerPromotion }>(`/partner/promotions/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deletePartnerPromotion(id: number) {
  return apiFetch<{ message: string }>(`/partner/promotions/${id}`, { method: "DELETE" });
}

// --- Partner Bookings ---
export interface PartnerBooking {
  ID: number;
  booking_code: string;
  type: string;
  payment_status: string;
  booking_status: string;
  total_amount: number;
  expires_at: string;
  CreatedAt: string;
  user: { name: string; email: string };
}

export async function getPartnerBookings(params?: { page?: number; limit?: number; status?: string; search?: string }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status) query.set("status", params.status);
  if (params?.search) query.set("search", params.search);
  return apiFetch<{ data: PartnerBooking[]; meta: { page: number; limit: number; total: number } }>(
    `/partner/bookings?${query.toString()}`
  );
}

// --- Partner Reviews ---
export interface PartnerReview {
  ID: number;
  booking_id: number;
  user: { name: string; email: string };
  rating: number;
  comment: string;
  CreatedAt: string;
  booking: { booking_code: string; type: string };
}

export async function getPartnerReviews(params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  return apiFetch<{
    data: PartnerReview[];
    meta: {
      page: number;
      limit: number;
      total: number;
      stats?: {
        avg_rating: number;
        response_rate: number;
        positive_sentiment: number;
      };
    };
  }>(
    `/partner/reviews?${query.toString()}`
  );
}

// --- Partner Finance ---
export interface PartnerFinanceSummary {
  total_revenue: number;
  commission: number;
  net_revenue: number;
  total_bookings: number;
  paid_bookings: number;
}

export async function getPartnerFinance(params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  return apiFetch<{ summary: PartnerFinanceSummary; chart_data?: any[]; transactions: PartnerBooking[]; meta: { page: number; limit: number; total: number } }>(
    `/partner/finance?${query.toString()}`
  );
}


// --- Partner Analytics ---
export interface PartnerAnalyticsResponse {
  funnel: { name: string; value: number }[];
  metric_data: { month: string; value: number }[];
  conversion: { month: string; rate: number }[];
  demographics: { name: string; value: number; color: string }[];
}

export async function getPartnerAnalytics() {
  return apiFetch<PartnerAnalyticsResponse>("/partner/analytics");
}

// --- Partner Staff ---
export interface PartnerStaff {
  ID: number;
  partner_id: number;
  user_id: number;
  user: { name: string; email: string; avatar_url?: string };
  role: string;
}

export async function getPartnerStaff() {
  return apiFetch<{ data: PartnerStaff[] }>("/partner/staff");
}

export async function addPartnerStaff(email: string, role: string) {
  return apiFetch<{ message: string; data: PartnerStaff }>("/partner/staff", {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });
}

export async function removePartnerStaff(id: number) {
  return apiFetch<{ message: string }>(`/partner/staff/${id}`, { method: "DELETE" });
}

// --- Partner Availability ---
export interface Availability {
  ID: number;
  date: string;
  status: "available" | "booked" | "blocked" | "pending";
  price?: number;
  room_type_id?: number;
  flight_id?: number;
}

export async function getPartnerAvailability() {
  return apiFetch<{ 
    availability: Availability[]; 
    bookings: any[]; 
    rooms?: any[]; 
    flights?: any[]; 
  }>("/partner/availability");
}

export async function blockDates(
  startDate: string, 
  endDate: string, 
  action: "block" | "unblock" | "price" = "block", 
  price?: number,
  room_type_id?: number,
  flight_id?: number
) {
  return apiFetch<{ message: string }>("/partner/availability/block", {
    method: "POST",
    body: JSON.stringify({ 
      start_date: startDate, 
      end_date: endDate, 
      action, 
      price,
      room_type_id,
      flight_id
    }),
  });
}

// --- Partner Fleet ---
export interface PartnerAircraft {
  id: number;
  partner_id: number;
  registration: string;
  model: string;
  capacity: number;
  yom: string;
  status: "active" | "maintenance" | "retired";
  next_maintenance?: string;
  CreatedAt: string;
}

export interface FleetResponse {
  data: PartnerAircraft[];
  meta: { page: number; limit: number; total: number };
  stats: { total: number; maintenance: number; utilization: number };
}

export async function getPartnerFleet(search?: string, page = 1, limit = 20) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  return apiFetch<FleetResponse>(`/partner/fleet?${params}`);
}

export async function createAircraft(data: {
  registration: string;
  model: string;
  capacity: number;
  yom?: string;
  status?: string;
}) {
  return apiFetch<{ message: string; data: PartnerAircraft }>("/partner/fleet", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAircraft(id: number, data: Partial<PartnerAircraft>) {
  return apiFetch<{ message: string; data: PartnerAircraft }>(`/partner/fleet/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAircraft(id: number) {
  return apiFetch<{ message: string }>(`/partner/fleet/${id}`, { method: "DELETE" });
}

// --- Partner Routes (Flight Routes) ---
export interface PartnerRoute {
  id: number;
  origin: string;
  origin_city: string;
  destination: string;
  destination_city: string;
  flight_number: string;
  duration: string;
  aircraft: string;
  schedule: string;
  status: string;
}

export interface RoutesResponse {
  data: PartnerRoute[];
  meta: { page: number; limit: number; total: number };
  stats: { active_routes: number; daily_flights: number; on_time_performance: number };
}

export async function getPartnerRoutes(search?: string, region?: string, page = 1, limit = 20) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  if (region) params.set("region", region);
  return apiFetch<RoutesResponse>(`/partner/routes?${params}`);
}

export async function createPartnerRoute(data: {
  origin: string;
  destination: string;
  flight_number: string;
  duration?: string;
  aircraft?: string;
  base_price?: number;
}) {
  return apiFetch<{ message: string; data: any }>("/partner/routes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deletePartnerRoute(id: number) {
  return apiFetch<{ message: string }>(`/partner/routes/${id}`, { method: "DELETE" });
}

// --- Partner Insights ---
export interface InsightMetric {
  label: string;
  value: number;
  change: string;
  trend: "up" | "down";
  desc: string;
}

export interface InsightsResponse {
  metrics: InsightMetric[];
  comparison_data: { date: string; you: number; market: number }[];
  pricing_data: { name: string; your_price: number; market_avg: number }[];
  high_demand: { date: string; reason: string; demand: string; availability: string; color: string }[];
  partner_type: string;
}

export async function getPartnerInsights() {
  return apiFetch<InsightsResponse>("/partner/insights");
}
// --- Favourites ---
export async function toggleFavourite(type: "flight" | "hotel", flightId?: number, hotelId?: number) {
  return apiFetch<{ message: string; is_favourite: boolean }>("/favourites/toggle", {
    method: "POST",
    body: JSON.stringify({ type, flight_id: flightId, hotel_id: hotelId }),
  });
}

export async function getFavourites(type?: "flight" | "hotel") {
  const query = type ? `?type=${type}` : "";
  return apiFetch<{ data: any[] }>(`/favourites${query}`);
}

// --- Promotions ---
export interface Promotion {
  ID: number;
  name: string;
  code: string;
  description: string;
  image_url: string;
  type: string;
  discount: number;
  start_date: string;
  end_date: string;
  partner?: { company_name: string };
}

export async function getPromotions(params?: { type?: string; search?: string; page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.type) query.set("type", params.type);
  if (params?.search) query.set("search", params.search);
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  
  return apiFetch<{ data: Promotion[]; meta: { page: number; limit: number; total: number } }>(
    `/promotions?${query.toString()}`
  );
}

export async function validatePromoCode(code: string) {
  return apiFetch<{ message: string; discount: number; type: string; name: string }>(
    `/promotions/validate?code=${encodeURIComponent(code)}`
  );
}
