import { Badge } from "@chakra-ui/react";

import type { SurveyStatus } from "./dashboardTypes";

type StatusBadgeProps = {
  status: SurveyStatus;
};

const statusStyles = {
  Active: {
    bg: "#E8F8F2",
    color: "brand.success",
    borderColor: "#BFEADB",
  },
  Draft: {
    bg: "#FFF7E6",
    color: "#B7791F",
    borderColor: "#FBD38D",
  },
  Closed: {
    bg: "#F2EAFE",
    color: "#7C3AED",
    borderColor: "#DDD6FE",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      w="fit-content"
      px="3"
      py="1"
      borderRadius="pill"
      borderWidth="1px"
      fontSize="xs"
      {...statusStyles[status]}
    >
      {status}
    </Badge>
  );
}