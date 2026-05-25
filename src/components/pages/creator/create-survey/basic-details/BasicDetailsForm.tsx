"use client";

import NextLink from "next/link";
import {
  Box,
  Button,
  Grid,
  HStack,
  Input,
  InputGroup,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { FiArrowRight, FiFileText } from "react-icons/fi";
import { useState } from "react";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";
import CategoryDropdown from "./CategoryDropdown";

export default function BasicDetailsForm() {
  const [surveyTitle, setSurveyTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [completionDays, setCompletionDays] = useState("7");

  const descriptionLength = description.length;

  return (
    <DashboardCard p="0" overflow="visible">
      <Box p={{ base: "5", lg: "7" }}>
        <VStack align="stretch" gap="7">
          <Box>
            <Text fontWeight="bold" fontSize="sm" mb="2">
              Survey Title{" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </Text>

            <Input
              value={surveyTitle}
              onChange={(event) => setSurveyTitle(event.target.value)}
              placeholder="e.g., Customer Satisfaction Survey"
              h="46px"
              borderColor="brand.border"
              _focus={{
                borderColor: "brand.primary",
                boxShadow: "0 0 0 1px #0015D6",
              }}
              px={5}
            />

            <Text textStyle="smallText" mt="2">
              Give your survey a clear and concise title.
            </Text>
          </Box>

          <Box>
            <Text fontWeight="bold" fontSize="sm" mb="2">
              Survey Description{" "}
              <Text as="span" color="red.500">
                *
              </Text>
            </Text>

            <Textarea
              value={description}
              onChange={(event) => {
                if (event.target.value.length <= 500) {
                  setDescription(event.target.value);
                }
              }}
              placeholder="Short explanation of the survey purpose"
              minH="115px"
              resize="none"
              px={5}
              py={3}
              borderColor="brand.border"
              _focus={{
                borderColor: "brand.primary",
                boxShadow: "0 0 0 1px #0015D6",
              }}
            />

            <HStack justify="space-between" mt="2">
              <Text textStyle="smallText">
                Provide a brief overview of what this survey aims to achieve.
              </Text>

              <Text textStyle="smallText">{descriptionLength} / 500</Text>
            </HStack>
          </Box>

          <Grid templateColumns={{ base: "1fr", lg: "1fr 0.9fr" }} gap="4">
            <Box >
              <Text fontWeight="bold" fontSize="sm" mb="2">
                Survey Category / Domain{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </Text>

              <CategoryDropdown value={category} onChange={setCategory} />
            </Box>

            <Box>
              <Text fontWeight="bold" fontSize="sm" mb="2">
                Estimated Completion Time Days{" "}
                <Text as="span" color="red.500">
                  *
                </Text>
              </Text>

              <InputGroup
                endElement={
                  <Text color="brand.dark" fontSize="sm" pr="4">
                    Days
                  </Text>
                }
              >
                <Input
                  value={completionDays}
                  onChange={(event) => setCompletionDays(event.target.value)}
                  type="number"
                  min="1"
                  h="46px"
                  px={5}
                  borderColor="brand.border"
                  _focus={{
                    borderColor: "brand.primary",
                    boxShadow: "0 0 0 1px #0015D6",
                  }}
                />
              </InputGroup>

              <Text textStyle="smallText" mt="2">
                Estimated time needed to complete the survey.
              </Text>
            </Box>
          </Grid>
        </VStack>
      </Box>

      <Box
        borderTopWidth="1px"
        borderColor="brand.border"
        px={{ base: "5", lg: "7" }}
        py="5"
      >
        <HStack justify="flex-end" gap="4" flexWrap="wrap">
          <Button variant="outline" px={5} py={3}>
            <FiFileText />
            Save as Draft
          </Button>

          <Button px={5} py={3} variant="subtle">Cancel</Button>

          <Button asChild px={5} py={3} color={"white"}>
            <NextLink href="/creator/surveys/create/select-method">
              Continue to Select Method <FiArrowRight />
            </NextLink>
          </Button>
        </HStack>
      </Box>
    </DashboardCard>
  );
}
