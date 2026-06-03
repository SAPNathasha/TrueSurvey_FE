import {
  FiBriefcase,
  FiFolder,
  FiHeart,
  FiMessageSquare,
  FiMoreHorizontal,
  FiShoppingBag,
  FiTarget,
  FiUsers,
  FiBookOpen,
  FiClock,
} from "react-icons/fi";

import type {
  NextStepItem,
  SetupTip,
  SurveyCategory,
} from "./basicDetailsTypes";

export const surveyCategories: SurveyCategory[] = [
  {
    label: "Customer Feedback",
    value: "CUSTOMER_FEEDBACK",
    icon: FiMessageSquare,
  },
  {
    label: "Market Research",
    value: "MARKET_RESEARCH",
    icon: FiTarget,
  },
  {
    label: "Employee Engagement",
    value: "EMPLOYEE_ENGAGEMENT",
    icon: FiUsers,
  },
  {
    label: "Education",
    value: "EDUCATION",
    icon: FiBookOpen,
  },
  {
    label: "Healthcare",
    value: "HEALTHCARE",
    icon: FiHeart,
  },
  {
    label: "Product Research",
    value: "PRODUCT_RESEARCH",
    icon: FiShoppingBag,
  },
  {
    label: "Event Feedback",
    value: "EVENT_FEEDBACK",
    icon: FiBriefcase,
  },
  {
    label: "Other",
    value: "OTHER",
    icon: FiMoreHorizontal,
  },
];

export const setupTips: SetupTip[] = [
  {
    title: "Be clear and specific",
    description:
      "A clear title and description help respondents understand the purpose.",
    icon: FiTarget,
  },
  {
    title: "Choose the right category",
    description:
      "Selecting the right domain helps us provide better survey options.",
    icon: FiFolder,
  },
  {
    title: "Estimate accurately",
    description: "A realistic time estimate improves completion rates.",
    icon: FiClock,
  },
];

export const nextStepItems: NextStepItem[] = [
  { text: "Select the survey method that fits your goals" },
  { text: "Add and customize your survey questions" },
  { text: "Define your target audience" },
  { text: "Set sample size and budget" },
  { text: "Review and submit your survey for launch" },
];
