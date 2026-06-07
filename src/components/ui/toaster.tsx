"use client"

import {
  Box,
  CloseButton,
  HStack,
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: true,
})

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster
        toaster={toaster}
        insetInlineStart="auto"
        insetInlineEnd="4"
        insetBlockEnd="4"
      >
        {(toast) => (
          <Toast.Root
            width={{ base: "calc(100vw - 24px)", sm: "350px" }}
            maxW="350px"
            borderRadius="card"
            borderWidth="1px"
            borderColor="brand.border"
            bg="white"
            color="brand.dark"
            boxShadow="softCard"
            minH="auto"
            p="4"
            overflow="hidden"
          >
            <HStack align="start" gap="3" w="full">
              <Box pt="0.5" flexShrink={0}>
                {toast.type === "loading" ? (
                  <Spinner size="sm" color="brand.primary" />
                ) : (
                  <Toast.Indicator />
                )}
              </Box>

              <Stack
                gap="1"
                flex="1"
                minW={0}
                whiteSpace="normal"
                wordBreak="break-word"
              >
                {toast.title && (
                  <Toast.Title
                    fontWeight="bold"
                    whiteSpace="normal"
                    wordBreak="break-word"
                  >
                    {toast.title}
                  </Toast.Title>
                )}
                {toast.description && (
                  <Toast.Description
                    color="brand.mutedText"
                    whiteSpace="normal"
                    wordBreak="break-word"
                  >
                    {toast.description}
                  </Toast.Description>
                )}
                {toast.action && (
                  <Toast.ActionTrigger alignSelf="flex-start">
                    {toast.action.label}
                  </Toast.ActionTrigger>
                )}
              </Stack>

              {toast.closable && (
                <Toast.CloseTrigger asChild>
                  <CloseButton size="sm" flexShrink={0} mt="-1" />
                </Toast.CloseTrigger>
              )}
            </HStack>
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
