"use client";

import {
  Box,
  Button,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FiChevronUp } from "react-icons/fi";
import { useState } from "react";

import { surveyCategories } from "./createSurveyData";

type CategoryDropdownProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function CategoryDropdown({
  value,
  onChange,
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(true);

  const selectedCategory = surveyCategories.find(
    (category) => category.value === value,
  );

  return (
    <Box position="relative">
      <Button
        variant="outline"
        w="full"
        h="46px"
        px={5}
        justifyContent="space-between"
        borderColor={open ? "brand.primary" : "brand.border"}
        color={selectedCategory ? "brand.dark" : "brand.mutedText"}
        fontWeight="normal"
        onClick={() => setOpen((previous) => !previous)}
      >
        <Text >
          {selectedCategory ? selectedCategory.label : "Select a category"}
        </Text>

        <FiChevronUp />
      </Button>

      {open && (
        <Box
          position="absolute"
          top="52px"
          left="0"
          right="0"
          bg="white"
          borderWidth="1px"
          borderColor="brand.border"
          borderRadius="12px"
          boxShadow="0px 18px 40px rgba(0, 9, 87, 0.14)"
          py="2"
          zIndex="20"
        >
          <VStack align="stretch" gap="0">
            {surveyCategories.map((category) => {
              const active =
                category.value === value ||
                (!value && category.value === "customer-feedback");

              return (
                <Button
                  key={category.value}
                  variant="ghost"
                  justifyContent="flex-start"
                  h="40px"
                  borderRadius="0"
                  bg={active ? "brand.cardSelected" : "white"}
                  color={active ? "brand.primary" : "brand.dark"}
                  fontWeight={active ? "bold" : "medium"}
                  onClick={() => {
                    onChange(category.value);
                    setOpen(false);
                  }}
                >
                  <HStack gap="3">
                    <Icon as={category.icon} />
                    <Text fontSize="sm">{category.label}</Text>
                  </HStack>
                </Button>
              );
            })}
          </VStack>
        </Box>
      )}
    </Box>
  );
}