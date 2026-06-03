import api from "@/lib/axios";
import axios from "axios";

export type ParticipantWalletStatus =
  | "ALL"
  | "COMPLETED"
  | "PENDING"
  | "PAID"
  | "WITHDRAWALS";

export type ParticipantWalletSortBy =
  | "MOST_RECENT"
  | "OLDEST"
  | "AMOUNT_HIGH"
  | "AMOUNT_LOW";

export type ParticipantWalletQuery = {
  participantId: string;
  search?: string;
  status?: ParticipantWalletStatus;
  sortBy?: ParticipantWalletSortBy;
  page?: number;
  limit?: number;
};

export type WalletTrendPoint = {
  label?: string;
  day?: string;
  amount?: number;
  value?: number;
  totalEarned?: number;
};

export type WalletTransactionRow = {
  id: string;
  rowType: "SURVEY_REWARD" | "WITHDRAWAL";
  surveyId: string | null;
  surveyName: string;
  category: string | null;
  status: "COMPLETED" | "PENDING" | "PAID" | "PROCESSING" | "FAILED";
  earnedMoney: number;
  date: string;
  paymentMethod: string;
  action: string;
};

export type RecentWithdrawal = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  createdAt: string;
};

export type EarningsBreakdownRow = {
  label: string;
  value: number;
  currency?: string;
};

export type EarningsBreakdownMap = Record<
  string,
  number | string | { value?: number; amount?: number; currency?: string }
>;

export type ParticipantWalletResponse = {
  participant: {
    id: string;
    username: string;
  };
  summaryCards: {
    currentWalletBalance: number;
    pendingEarnings: number;
    totalEarned: number;
    totalWithdrawn: number;
    currency: string;
  };
  walletBalance: {
    amount: number;
    growthPercentage: number;
    currency: string;
  };
  earningsTrend: WalletTrendPoint[];
  filters: {
    search: string | null;
    status: ParticipantWalletStatus;
    sortBy: ParticipantWalletSortBy;
  };
  transactions: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      showingFrom: number;
      showingTo: number;
    };
    rows: WalletTransactionRow[];
  };
  recentWithdrawals: RecentWithdrawal[];
  earningsBreakdown: EarningsBreakdownRow[] | EarningsBreakdownMap;
  withdrawalMethod: {
    type: string;
    name: string;
    description: string;
    isDefault: boolean;
  };
  walletTips: string[];
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

export async function getParticipantWallet(query: ParticipantWalletQuery) {
  try {
    const response = await api.get<ParticipantWalletResponse>(
      "/participant/wallet",
      {
        params: {
          participantId: query.participantId,
          search: query.search || undefined,
          status: query.status,
          sortBy: query.sortBy,
          page: query.page,
          limit: query.limit,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
