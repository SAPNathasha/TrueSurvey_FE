import type { IconType } from "react-icons";

export type SurveyMethodId = "ai" | "manual";

export type MethodTag = {
  label: string;
  icon: IconType;
};

export type SurveyMethod = {
  id: SurveyMethodId;
  title: string;
  description: string;
  buttonLabel: string;
  buttonVariant: "solid" | "outline";
  features: string[];
  tags: MethodTag[];
};

export type MethodTip = {
  title: string;
  description: string;
  icon: IconType;
};