import api from "@/lib/axios";
import axios from "axios";

export type DashboardSurvey = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  estimatedCompletionDays?: number | null;
  rewardAmount?: number | string | null;
  reward?: number | string | null;
  rewardPerParticipant?: number | string | null;
  sampleBudget?: {
    rewardPerParticipant?: number | string | null;
    currency?: string | null;
  } | null;
};

export type DashboardActivity = {
  id: string;
  surveyId: string;
  surveyTitle: string;
  category?: string | null;
  status: string;
  rewardAmount: number;
  rewardStatus: string;
  completedAt: string;
};

export type DashboardNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

export type WeeklyEarning = {
  day?: string;
  label?: string;
  amount?: number;
  earnings?: number;
  totalEarned?: number;
};

export type ParticipantDashboardData = {
  welcome: {
    username: string;
  };
  summaryCards: {
    availableSurveys: number;
    completedSurveys: number;
    totalEarned: number;
    walletBalance: number;
  };
  wallet: {
    currentBalance: number;
    pendingRewards: number;
    totalEarned: number;
    totalWithdrawn: number;
    currency: string;
  };
  verification: Record<string, unknown>;
  availableSurveys: DashboardSurvey[];
  lockedSurveys: DashboardSurvey[];
  recentActivity: DashboardActivity[];
  earningsThisWeek: WeeklyEarning[];
  notifications: DashboardNotification[];
};

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message[0];
    }

    return message || "Request failed";
  }

  return "Request failed";
}

export async function getParticipantDashboard() {
  try {
    const response = await api.get<ParticipantDashboardData>(
      "/participant/dashboard"
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
