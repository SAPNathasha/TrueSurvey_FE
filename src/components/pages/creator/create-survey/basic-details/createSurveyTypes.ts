import type { IconType } from "react-icons";

export type SurveyStep = {
  number: number;
  label: string;
};

export type SurveyCategory = {
  label: string;
  value: string;
  icon: IconType;
};

export type SetupTip = {
  title: string;
  description: string;
  icon: IconType;
};

export type NextStepItem = {
  text: string;
};