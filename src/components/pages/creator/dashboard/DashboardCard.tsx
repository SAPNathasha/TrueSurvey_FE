import { Box } from "@chakra-ui/react";
import type { ReactNode } from "react";

type DashboardCardProps = {
  children: ReactNode;
  p?: string;
  mt?: string;
  overflow?: string;
};

export default function DashboardCard({
  children,
  p = "5",
  mt,
  overflow,
}: DashboardCardProps) {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="brand.border"
      borderRadius="card"
      p={p}
      mt={mt}
      overflow={overflow}
      boxShadow="0px 10px 30px rgba(0, 9, 87, 0.06)"
    >
      {children}
    </Box>
  );
}