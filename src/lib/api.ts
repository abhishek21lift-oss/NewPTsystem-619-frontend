const API_BASE = import.meta.env.VITE_API_URL || 'https://newpt-system-backend.onrender.com/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Dashboard
  getDashboard: () => request<any>('/analytics/dashboard'),
  getMonthlyRevenue: (months = 15) => request<any[]>(`/analytics/revenue/monthly?months=${months}`),
  getTrainerBreakdown: () => request<any[]>('/analytics/trainer-breakdown'),
  getPlanDistribution: () => request<any[]>('/analytics/plan-distribution'),
  getGenderDistribution: () => request<any[]>('/analytics/gender-distribution'),
  getForecast: () => request<any>('/analytics/forecast'),

  // Clients
  getClients: (params?: string) => request<any>(`/clients${params ? `?${params}` : ''}`),
  getClient: (id: string) => request<any>(`/clients/${id}`),
  createClient: (data: any) => request<any>('/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClient: (id: string, data: any) => request<any>(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClient: (id: string) => request<any>(`/clients/${id}`, { method: 'DELETE' }),

  // Trainers
  getTrainers: () => request<any[]>('/trainers'),
  getTrainerStats: (id: string) => request<any>(`/trainers/${id}/stats`),
  createTrainer: (data: any) => request<any>('/trainers', { method: 'POST', body: JSON.stringify(data) }),

  // Membership Plans
  getMembershipPlans: () => request<any[]>('/membership-plans'),
  getMembershipPlan: (id: string) => request<any>(`/membership-plans/${id}`),
  createMembershipPlan: (data: any) => request<any>('/membership-plans', { method: 'POST', body: JSON.stringify(data) }),
  updateMembershipPlan: (id: string, data: any) => request<any>(`/membership-plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMembershipPlan: (id: string) => request<any>(`/membership-plans/${id}`, { method: 'DELETE' }),

  // Enrollments
  getEnrollments: (params?: string) => request<any>(`/enrollments${params ? `?${params}` : ''}`),
  getActiveEnrollments: () => request<any[]>('/enrollments/active'),
  createEnrollment: (data: any) => request<any>('/enrollments', { method: 'POST', body: JSON.stringify(data) }),

  // Payments
  getPayments: (params?: string) => request<any>(`/payments${params ? `?${params}` : ''}`),
  createPayment: (data: any) => request<any>('/payments', { method: 'POST', body: JSON.stringify(data) }),
  getOutstanding: () => request<any[]>('/payments/outstanding'),

  // Sessions
  getSessions: (params?: string) => request<any>(`/sessions${params ? `?${params}` : ''}`),
  getTodaySessions: () => request<any[]>('/sessions/today'),
  getWeeklySummary: () => request<any>('/sessions/weekly-summary'),
  createSession: (data: any) => request<any>('/sessions', { method: 'POST', body: JSON.stringify(data) }),

  // Payouts
  getPayouts: (params?: string) => request<any>(`/payouts${params ? `?${params}` : ''}`),

  // Auth
  signUp: (data: { email: string; password: string; full_name: string }) =>
    request<any>('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
  signIn: (data: { email: string; password: string }) =>
    request<any>('/auth/signin', { method: 'POST', body: JSON.stringify(data) }),
  signOut: () => request<any>('/auth/signout', { method: 'POST' }),
  getMe: (token: string) => request<any>('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
};
