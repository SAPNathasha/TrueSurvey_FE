import {
  FiAward,
  FiBarChart2,
  FiBell,
  FiClipboard,
  FiDownload,
  FiFileText,
  FiGrid,
  FiPlusCircle,
  FiSettings,
  FiTrendingUp,
  FiUser,
  FiUsers,
} from "react-icons/fi";

import type {
  MenuItem,
  NotificationItem,
  ProgressItem,
  Survey,
} from "./dashboardTypes";

export const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/creator/dashboard", icon: FiGrid },
  {
    label: "Create Survey",
    href: "/creator/create-survey",
    icon: FiPlusCircle,
  },
  { label: "My Surveys", href: "/creator/surveys", icon: FiFileText },
  { label: "Analytics", href: "/creator/analytics", icon: FiBarChart2 },
  { label: "Responses", href: "/creator/responses", icon: FiUsers },
  {
    label: "Notifications",
    href: "/creator/notifications",
    icon: FiBell,
    badge: 3,
  },
  { label: "Profile", href: "/creator/profile", icon: FiUser },
  { label: "Settings", href: "/creator/settings", icon: FiSettings },
];

export const surveys: Survey[] = [
  {
    name: "Product Feedback 2025",
    description: "Get feedback on our new product features",
    status: "Active",
    audience: "Customers",
    responses: "893",
    updated: "May 14, 2025",
  },
  {
    name: "Customer Satisfaction Q1",
    description: "Quarterly customer satisfaction survey",
    status: "Active",
    audience: "Customers",
    responses: "742",
    updated: "May 12, 2025",
  },
  {
    name: "Website Experience Survey",
    description: "Help us improve your website experience",
    status: "Draft",
    audience: "Visitors",
    responses: "-",
    updated: "May 10, 2025",
  },
  {
    name: "Employee Engagement 2025",
    description: "Annual employee engagement survey",
    status: "Closed",
    audience: "Employees",
    responses: "1,118",
    updated: "May 5, 2025",
  },
];

export const notifications: NotificationItem[] = [
  {
    icon: FiBarChart2,
    title: 'Your survey "Product Feedback 2025" received 57 new responses.',
    time: "2m ago",
    color: "brand.primary",
  },
  {
    icon: FiFileText,
    title: 'Survey "Customer Satisfaction Q1" has a completion rate of 78%.',
    time: "1h ago",
    color: "brand.warning",
  },
  {
    icon: FiDownload,
    title: "Your scheduled report is ready to download.",
    time: "3h ago",
    color: "#8B5CF6",
  },
];

export const progressItems: ProgressItem[] = [
  { label: "Add profile picture", done: true },
  { label: "Verify email address", done: true },
  { label: "Create your first survey", done: true },
  { label: "Get 10 responses", done: true },
  { label: "Invite team members", done: false },
];

export const statCards = [
  {
    title: "Total Surveys",
    value: "24",
    growth: "12%",
    icon: FiClipboard,
    active: true,
  },
  {
    title: "Active Surveys",
    value: "4",
    growth: "33%",
    icon: FiTrendingUp,
    iconBg: "#E8F8F2",
    iconColor: "brand.success",
  },
  {
    title: "Total Responses",
    value: "2,753",
    growth: "18%",
    icon: FiUsers,
    iconBg: "#F0E7FF",
    iconColor: "#8B5CF6",
  },
];

export const creatorPlanIcon = FiAward;
