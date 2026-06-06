import api from "@/lib/axios";
import axios from "axios";

export type TransactionRecordsQuery = {
  page?: number;
  limit?: number;
};

export type TransactionUserRole = "PARTICIPANT" | "CREATOR" | "BOTH";

export type TransactionStatus =
  | "PENDING"
  | "COMPLETED"
  | "FAILED"
  | "REJECTED"
  | string;

export type TransactionType =
  | "SURVEY_REWARD"
  | "WITHDRAWAL"
  | "ADJUSTMENT"
  | string;

export type TransactionRecordRow = {
  id: string;
  date: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  currency: string;
  description: string | null;
};

export type TransactionRecordsResponse = {
  user: {
    id: string;
    username: string;
    role: TransactionUserRole;
  };
  summary: {
    totalPendingItems: number;
    totalTopupAmount: number;
    paidOutAmount: number;
    totalRewardsEarned: number;
    currency: string;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    showingFrom: number;
    showingTo: number;
  };
  transactions: TransactionRecordRow[];
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

export async function getTransactionRecords(
  query: TransactionRecordsQuery,
) {
  try {
    const response = await api.post<TransactionRecordsResponse>(
      "/participant/transactions",
      {
        page: query.page,
        limit: query.limit,
      },
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
