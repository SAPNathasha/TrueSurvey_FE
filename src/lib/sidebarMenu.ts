import type { IconType } from "react-icons";
import {
  FiBell,
  FiFileText,
  FiGrid,
  FiHelpCircle,
  FiList,
  FiLogOut,
  FiPlusCircle,
  FiSearch,
  FiSettings,
  FiUser,
  FiClipboard,
} from "react-icons/fi";

import type { AppUserRole } from "./userRole";

export type SidebarArea = "participant" | "creator";

export type SidebarMenuItem = {
  id: string;
  label: string;
  icon: IconType;
  area: SidebarArea;
  allowedRoles: AppUserRole[];
  href?: string;
  badge?: number;
};

export const sidebarMenuItems: SidebarMenuItem[] = [
  {
    id: "creator-dashboard",
    label: "Dashboard",
    icon: FiGrid,
    area: "creator",
    allowedRoles: ["CREATOR", "BOTH"],
    href: "/creator/dashboard",
  },
  {
    id: "creator-create-survey",
    label: "Create Survey",
    icon: FiPlusCircle,
    area: "creator",
    allowedRoles: ["CREATOR", "BOTH"],
    href: "/creator/create-survey",
  },
  {
    id: "creator-surveys",
    label: "My Surveys",
    icon: FiFileText,
    area: "creator",
    allowedRoles: ["CREATOR", "BOTH"],
    href: "/creator/surveys",
  },
  {
    id: "creator-transactions",
    label: "Transactions",
    icon: FiClipboard,
    area: "creator",
    allowedRoles: ["BOTH"],
    href: "/participant/earnings",
  },
    {
    id: "creator-wallet",
    label: "Wallet",
    icon: FiUser,
    area: "creator",
    allowedRoles: ["CREATOR"],
    href: "/participant/wallet",
  },
  {
    id: "creator-logout",
    label: "Logout",
    icon: FiLogOut,
    area: "creator",
    allowedRoles: ["CREATOR"],
  },
  {
    id: "creator-settings",
    label: "Settings",
    icon: FiSettings,
    area: "creator",
    allowedRoles: ["CREATOR", "BOTH"],
    href: "/creator/settings",
  },
  {
    id: "participant-dashboard",
    label: "Dashboard",
    icon: FiGrid,
    area: "participant",
    allowedRoles: ["PARTICIPANT", "BOTH"],
    href: "/participant/dashboard",
  },
  {
    id: "participant-available-surveys",
    label: "Available Surveys",
    icon: FiSearch,
    area: "participant",
    allowedRoles: ["PARTICIPANT", "BOTH"],
    href: "/participant/available-surveys",
  },
  {
    id: "participant-my-surveys",
    label: "My Submissions",
    icon: FiList,
    area: "participant",
    allowedRoles: ["PARTICIPANT", "BOTH"],
    href: "/participant/submissions",
  },
  {
    id: "participant-wallet",
    label: "Wallet",
    icon: FiUser,
    area: "participant",
    allowedRoles: ["PARTICIPANT", "BOTH"],
    href: "/participant/wallet",
  },
  {
    id: "participant-transactions",
    label: "Transactions",
    icon: FiClipboard,
    area: "participant",
    allowedRoles: ["PARTICIPANT", "CREATOR", "BOTH"],
    href: "/participant/earnings",
  },
  {
    id: "participant-settings",
    label: "Settings",
    icon: FiSettings,
    area: "participant",
    allowedRoles: ["PARTICIPANT", "BOTH"],
    href: "/participant/settings",
  },
  {
    id: "participant-logout",
    label: "Logout",
    icon: FiLogOut,
    area: "participant",
    allowedRoles: ["PARTICIPANT", "BOTH"],
  },
];

export function getSidebarMenuItems(
  area: SidebarArea,
  role: AppUserRole | null,
) {
  const effectiveRole =
    role ?? (area === "creator" ? "CREATOR" : "PARTICIPANT");

  return sidebarMenuItems.filter(
    (item) => item.area === area && item.allowedRoles.includes(effectiveRole),
  );
}
