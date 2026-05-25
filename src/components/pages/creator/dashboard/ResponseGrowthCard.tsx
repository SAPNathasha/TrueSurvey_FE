import { Box, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";

import DashboardCard from "./DashboardCard";

const points = [
  [0, 136],
  [38, 150],
  [76, 120],
  [114, 78],
  [152, 88],
  [190, 72],
  [228, 112],
  [266, 108],
  [304, 48],
  [342, 65],
  [380, 86],
  [418, 122],
  [456, 104],
  [494, 58],
  [532, 54],
  [570, 32],
  [620, 16],
];

export default function ResponseGrowthCard() {
  return (
    <DashboardCard>
      <HStack justify="space-between" mb="5">
        <Heading fontSize="md">Response Growth</Heading>

        <Button variant="outline" size="sm" h="32px" py={5} px={3}>
          Last 30 Days
        </Button>
      </HStack>

      <Box h="220px" position="relative">
        <Box position="absolute" inset="0">
          {[0, 1, 2, 3].map((line) => (
            <Box
              key={line}
              position="absolute"
              left="42px"
              right="8px"
              top={`${line * 25}%`}
              borderTopWidth="1px"
              borderStyle="dashed"
              borderColor="gray.border"
            />
          ))}

          <VStack
            position="absolute"
            left="0"
            top="-2px"
            h="170px"
            justify="space-between"
            align="start"
          >
            {["1K", "750", "500", "250", "0"].map((item) => (
              <Text key={item} fontSize="xs" color="brand.mutedText">
                {item}
              </Text>
            ))}
          </VStack>

          <svg
            width="100%"
            height="180"
            viewBox="0 0 620 180"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              left: 35,
              right: 0,
              top: 0,
              width: "calc(100% - 35px)",
            }}
          >
            <defs>
              <linearGradient id="responseArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#0015D6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0015D6" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              d="M0,136 L38,150 L76,120 L114,78 L152,88 L190,72 L228,112 L266,108 L304,48 L342,65 L380,86 L418,122 L456,104 L494,58 L532,54 L570,32 L620,16 L620,180 L0,180 Z"
              fill="url(#responseArea)"
            />

            <polyline
              points={points.map(([x, y]) => `${x},${y}`).join(" ")}
              fill="none"
              stroke="#0015D6"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#0015D6" />
            ))}
          </svg>

          <Box
            position="absolute"
            right="54px"
            top="14px"
            bg="white"
            borderWidth="1px"
            borderColor="brand.border"
            boxShadow="softCard"
            borderRadius="8px"
            px="3"
            py="2"
          >
            <Text fontSize="xs" fontWeight="bold">
              May 14, 2025
            </Text>
            <Text fontSize="xs" color="brand.primary" fontWeight="bold">
              893 responses
            </Text>
          </Box>
        </Box>
      </Box>

      <HStack justify="space-between" mt="-2">
        <Box>
          <Text textStyle="smallText">Total Responses</Text>
          <Text fontSize="xl" fontWeight="bold">
            2,753
          </Text>
        </Box>

        <Text fontSize="sm" color="brand.success">
          ↑ 18% vs Apr 14 – May 13
        </Text>
      </HStack>
    </DashboardCard>
  );
}