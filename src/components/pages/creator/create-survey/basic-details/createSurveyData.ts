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
  SurveyStep,
} from "./createSurveyTypes";

export const surveySteps: SurveyStep[] = [
  { number: 1, label: "Basic Details" },
  { number: 2, label: "Select Method" },
  { number: 3, label: "Create Questions" },
  { number: 4, label: "Target Audience" },
  { number: 5, label: "Sample Size & Budget" },
  { number: 6, label: "Preview & Submit" },
];

export const surveyCategories: SurveyCategory[] = [
  {
    label: "Customer Feedback",
    value: "customer-feedback",
    icon: FiMessageSquare,
  },
  {
    label: "Market Research",
    value: "market-research",
    icon: FiTarget,
  },
  {
    label: "Employee Engagement",
    value: "employee-engagement",
    icon: FiUsers,
  },
  {
    label: "Education",
    value: "education",
    icon: FiBookOpen,
  },
  {
    label: "Healthcare",
    value: "healthcare",
    icon: FiHeart,
  },
  {
    label: "Product Research",
    value: "product-research",
    icon: FiShoppingBag,
  },
  {
    label: "Event Feedback",
    value: "event-feedback",
    icon: FiBriefcase,
  },
  {
    label: "Other",
    value: "other",
    icon: FiMoreHorizontal,
  },
];

export const setupTips: SetupTip[] = [
  {
    title: "Be clear and specific",
    description: "A clear title and description help respondents understand the purpose.",
    icon: FiTarget,
  },
  {
    title: "Choose the right category",
    description: "Selecting the right domain helps us provide better survey options.",
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