import { CheckboxCard } from "@chakra-ui/react";

interface RoleCheckboxes {
  label: string;
  description: string;
}

export default function RoleCheckboxes({ label, description }: RoleCheckboxes) {
  return (
    <CheckboxCard.Root
      key={label}
      width="full"
      minH="90px"
      border="1px solid"
      borderColor="black"
      borderRadius="12px"
      _checked={{
        borderColor: "blue.500",
      }}
    >
      <CheckboxCard.HiddenInput />

      <CheckboxCard.Control
        width="full"
        minH="90px"
        px="5"
        py="4"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <CheckboxCard.Content>
          <CheckboxCard.Label color="black" fontWeight="600">
            {label}
          </CheckboxCard.Label>

          <CheckboxCard.Description color="gray.600">
            {description}
          </CheckboxCard.Description>
        </CheckboxCard.Content>

        <CheckboxCard.Indicator
          border="1px solid"
          borderColor="black"
          _checked={{
            borderColor: "brand.primary",
            bg: "blue.500",
            color: "white",
          }}
        />
      </CheckboxCard.Control>
    </CheckboxCard.Root>
  );
}
