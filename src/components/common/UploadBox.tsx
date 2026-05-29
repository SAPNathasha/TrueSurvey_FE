"use client";

import {
  Button,
  Flex,
  Icon,
  Text,
  VStack,
  HStack,
  Field,
} from "@chakra-ui/react";
import { IconType } from "react-icons";
import { HiUpload } from "react-icons/hi";
import { useRef } from "react";

interface UploadBox {
  name: string;
  title: string;
  icon: IconType;
  helper: string;
  value: File | null;
  error?: string;
  onChange: (file: File | null) => void;
  accept?: string;
}

export default function UploadBox({
  name,
  title,
  icon,
  helper,
  value,
  error,
  onChange,
  accept = ".jpg,.jpeg,.png,.webp",
}: UploadBox) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Field.Root invalid={Boolean(error)} w="full">
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

      <input
        ref={inputRef}
        name={name}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(event) => {
          const selectedFile = event.target.files?.[0] ?? null;
          onChange(selectedFile);
          event.currentTarget.value = "";
        }}
      />

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
        onClick={() => inputRef.current?.click()}
      >
        <VStack gap="2">
          <Icon as={HiUpload} fontSize="24px" color="#1D4DFF" />

          <Text fontSize="12px" color="#8B95A7" fontWeight="500">
            Click to browse image
          </Text>

          <Text fontSize="11px" color="#A7AFBF" fontWeight="400">
            {helper}
          </Text>
        </VStack>
      </Button>

      {value && (
        <Text mt="2" fontSize="12px" color="#4B5563">
          Selected: {value.name}
        </Text>
      )}

      {error ? <Field.ErrorText>{error}</Field.ErrorText> : null}
    </Field.Root>
  );
}
