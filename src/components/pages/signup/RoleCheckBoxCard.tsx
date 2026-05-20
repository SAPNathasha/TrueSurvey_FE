import { CheckboxCard } from "@chakra-ui/react";

interface RoleCheckboxesProps {
  label: string;
  description: string;
  value: string;
  selectedValue: string;
  onSelect: (value: string) => void;
}

export default function RoleCheckboxes({
  label,
  description,
  value,
  selectedValue,
  onSelect,
}: RoleCheckboxesProps) {
  const isChecked = selectedValue === value;

  return (
    <CheckboxCard.Root
      width="full"
      minH="90px"
      checked={isChecked}
      onCheckedChange={() => onSelect(value)}
      border="1px solid"
      borderColor={isChecked ? "blue.500" : "black"}
      borderRadius="12px"
    >
      <CheckboxCard.HiddenInput name="role" value={value} />

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
          borderColor={isChecked ? "blue.500" : "black"}
          bg={isChecked ? "blue.500" : "white"}
          color={isChecked ? "white" : "black"}
        />
      </CheckboxCard.Control>
    </CheckboxCard.Root>
  );
}
