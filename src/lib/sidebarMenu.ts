import type { IconType } from "react-icons";
import {
  FiClipboard,
  FiFileText,
  FiList,
  FiLogOut,
  FiSearch,
  FiSettings,
  FiUser,
} from "react-icons/fi";

import type { AppUserRole } from "./userRole";

export type SidebarMenuItem = {
  id: string;
  label: string;
  icon: IconType;
  allowedRoles: AppUserRole[];
  href?: string;
  badge?: number;
};

export const sidebarMenuItems: SidebarMenuItem[] = [
  {
    id: "surveys",
    label: "My Surveys",
    icon: FiFileText,
    allowedRoles: ["CREATOR", "BOTH"],
    href: "/creator/surveys",
  },
  {
    id: "transactions",
    label: "Transactions",
    icon: FiClipboard,
    allowedRoles: ["CREATOR", "PARTICIPANT", "BOTH"],
    href: "/dashboard/transactions",
  },
  {
    id: "available-surveys",
    label: "Available Surveys",
    icon: FiSearch,
    allowedRoles: ["PARTICIPANT", "BOTH"],
    href: "/participant/available-surveys",
  },
  {
    id: "submissions",
    label: "My Submissions",
    icon: FiList,
    allowedRoles: ["PARTICIPANT", "BOTH"],
    href: "/participant/submissions",
  },
  {
    id: "wallet",
    label: "Wallet",
    icon: FiUser,
    allowedRoles: ["CREATOR", "PARTICIPANT", "BOTH"],
    href: "/dashboard/wallet",
  },
  {
    id: "settings",
    label: "Settings",
    icon: FiSettings,
    allowedRoles: ["CREATOR", "PARTICIPANT", "BOTH"],
    href: "/participant/settings",
  },
  {
    id: "logout",
    label: "Logout",
    icon: FiLogOut,
    allowedRoles: ["CREATOR", "PARTICIPANT", "BOTH"],
  },
];

export function getSidebarMenuItems(role: AppUserRole | null) {
  const effectiveRole = role ?? "PARTICIPANT";

  return sidebarMenuItems.filter((item) =>
    item.allowedRoles.includes(effectiveRole),
  );
}
