import type { IconType } from "react-icons";

export type MenuItem = {
  label: string;
  href: string;
  icon: IconType;
  badge?: number;
};

export type SurveyStatus = "Active" | "Draft" | "Closed";

export type Survey = {
  name: string;
  description: string;
  status: SurveyStatus;
  audience: string;
  responses: string;
  updated: string;
};

export type NotificationItem = {
  icon: IconType;
  title: string;
  time: string;
  color: string;
};

export type ProgressItem = {
  label: string;
  done: boolean;
};