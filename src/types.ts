export interface Client {
  id: string;
  display_id: string;
  full_name: string;
  gender: 'Male' | 'Female';
  phone?: string;
  email?: string;
  notes?: string;
  created_at: string;
  enrollments?: Enrollment[];
}

export interface Trainer {
  id: string;
  short_code: string;
  full_name: string;
  initials: string;
  avatar_color: string;
  specialty?: string;
  certification?: string;
  commission_pct: number;
  is_head: boolean;
  is_owner: boolean;
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration: string;
  months_count: number;
  default_price: number;
}

export interface Enrollment {
  id: string;
  client_id: string;
  trainer_id: string;
  plan_id: string;
  total_charged: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'soon';
  clients?: Client;
  trainers?: Trainer;
  membership_plans?: MembershipPlan;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  enrollment_id: string;
  amount: number;
  paid_at: string;
  method: string;
  reference?: string;
}

export interface Session {
  id: string;
  enrollment_id: string;
  client_id: string;
  trainer_id: string;
  scheduled_at: string;
  status: 'scheduled' | 'completed' | 'no_show' | 'cancelled';
  notes?: string;
  clients?: { full_name: string; phone?: string };
  trainers?: { full_name: string; initials: string };
}

export interface Activity {
  id: string;
  actor_type: string;
  action: string;
  description: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface DashboardData {
  stats: {
    total_clients: number;
    active_enrollments: number;
    expired_enrollments: number;
    soon_enrollments: number;
    total_revenue: number;
  };
  monthly_revenue: { month: string; rev: number }[];
  recent_activities: Activity[];
}

export interface TrainerBreakdown {
  id: string;
  full_name: string;
  short_code: string;
  initials: string;
  total_clients: number;
  total_revenue: number;
  commission: number;
}

export interface PlanDistribution {
  id: string;
  name: string;
  duration: string;
  months_count: number;
  enrollments: { count: number }[];
  enrollment_count?: number;
}

export interface OutstandingBalance {
  client_name: string;
  display_id: string;
  plan_name: string;
  total_charged: number;
  total_paid: number;
  balance: number;
  days_remaining: number;
  enrollment_status: string;
  trainer_name: string;
  trainer_code: string;
}

export interface ForecastData {
  forecast: { month: string; revenue: number }[];
  total_6month: number;
  active_enrollments_count: number;
}

export interface GenderDistribution {
  gender: string;
  count: number;
}

export interface WeeklySummary {
  daily_counts: number[];
  by_trainer: Record<string, number>;
  total_sessions: number;
}
