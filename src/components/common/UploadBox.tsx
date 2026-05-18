"use client";

import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  FileUpload,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { HiUpload } from "react-icons/hi";

interface UploadBox {
  title: string;
  icon: IconType;
  helper: string;
}

export default function UploadBox({ title, icon, helper }: UploadBox) {
  return (
    <Box w="full">
      <HStack mb="2" gap="3">
        <Flex
          w="27px"
          h="22px"
          bg="white"
          borderRadius="4px"
          border="1px solid #D9E4FF"
          align="center"
          justify="center"
          boxShadow="sm"
        >
          <Icon as={icon} color="#1D4DFF" fontSize="14px" />
        </Flex>

        <Text fontSize="13px" fontWeight="700" color="#666">
          {title}
        </Text>
      </HStack>

      <FileUpload.Root w="full">
        <FileUpload.HiddenInput />

        <FileUpload.Trigger asChild>
          <Button
            w="full"
            h="86px"
            bg="#EEF4FF"
            border="1.5px dashed #9DB5E8"
            borderRadius="10px"
            color="#0015D6"
            _hover={{
              bg: "#E5EEFF",
              borderColor: "#0015D6",
            }}
          >
            <VStack gap="2">
              <Icon as={HiUpload} fontSize="24px" color="#1D4DFF" />

              <Text fontSize="12px" color="#8B95A7" fontWeight="500">
                Drag and drop your file here, or click to browse
              </Text>

              <Text fontSize="11px" color="#A7AFBF" fontWeight="400">
                {helper}
              </Text>
            </VStack>
          </Button>
        </FileUpload.Trigger>

        <FileUpload.List />
      </FileUpload.Root>
    </Box>
  );
}
