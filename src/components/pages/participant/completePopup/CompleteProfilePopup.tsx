"use client";

import { Button, Dialog, Portal, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface CompleteProfilePopupProps {
  open: boolean;
  onClose: () => void;
}

export default function CompleteProfilePopup({
  open,
  onClose,
}: CompleteProfilePopupProps) {
  const router = useRouter();

  const handleGoToSettings = () => {
    onClose();
    router.push("/participant/settings");
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="2xl" p="6">
            <Dialog.Header>
              <Dialog.Title>Complete Your Profile</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <VStack align="start" gap="3">
                <Text color="gray.600">
                  Please complete your participant details such as date of
                  birth, education level, occupation, and other profile
                  information.
                </Text>

                <Text color="gray.600">
                  These details help survey creators categorize participants and
                  show you suitable surveys.
                </Text>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer>
              <Button variant="outline" py={5} px={5} onClick={onClose}>
                Later
              </Button>

              <Button
                colorPalette="blue"
                py={5}
                px={5}
                onClick={handleGoToSettings}
              >
                Go to Settings
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
