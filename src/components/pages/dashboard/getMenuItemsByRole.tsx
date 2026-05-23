"use client";

import { FiHome, FiPlus, FiClipboard, FiBarChart2 } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";

export type DashboardRole = "creator" | "participant" | "both";

type MenuItem = {
  label: string;
  icon: React.ElementType;
  href: string;
};

const creatorMenuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: FiHome,
    href: "/dashboard",
  },
  {
    label: "Create Survey",
    icon: FiPlus,
    href: "/dashboard/create-survey",
  },
  {
    label: "My Surveys",
    icon: FiClipboard,
    href: "/dashboard/my-surveys",
  },
  {
    label: "Analytics",
    icon: FiBarChart2,
    href: "/dashboard/analytics",
  },
  {
    label: "Wallet Balance",
    icon: FaWallet,
    href: "/dashboard/wallet",
  },
];

const participantMenuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: FiHome,
    href: "/dashboard",
  },
  {
    label: "Available Surveys",
    icon: FiClipboard,
    href: "/dashboard/available-surveys",
  },
  {
    label: "My Responses",
    icon: FiBarChart2,
    href: "/dashboard/my-responses",
  },
  {
    label: "Earnings",
    icon: FaWallet,
    href: "/dashboard/earnings",
  },
];

export default function getMenuItemsByRole(role: DashboardRole) {
  if (role === "participant") {
    return participantMenuItems;
  }

  if (role === "both") {
    return [
      {
        label: "Dashboard",
        icon: FiHome,
        href: "/dashboard",
      },
      {
        label: "Create Survey",
        icon: FiPlus,
        href: "/dashboard/create-survey",
      },
      {
        label: "My Surveys",
        icon: FiClipboard,
        href: "/dashboard/my-surveys",
      },
      {
        label: "Available Surveys",
        icon: FiClipboard,
        href: "/dashboard/available-surveys",
      },
      {
        label: "Analytics",
        icon: FiBarChart2,
        href: "/dashboard/analytics",
      },
      {
        label: "Wallet Balance",
        icon: FaWallet,
        href: "/dashboard/wallet",
      },
    ];
  }

  return creatorMenuItems;
}
