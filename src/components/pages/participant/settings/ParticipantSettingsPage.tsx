"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  IconButton,
  Image,
  Input,
  NativeSelect,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import type { ComponentProps, ReactNode } from "react";
import {
  FiBell,
  FiCalendar,
  FiCamera,
  FiCheck,
  FiEdit2,
  FiHome,
  FiKey,
  FiShield,
  FiUploadCloud,
  FiUser,
} from "react-icons/fi";

import ParticipantSidebar from "@/components/pages/participant/dashboard/ParticipantSidebar";

type SettingsTab =
  | "Profile"
  | "Verification"
  | "Preferences"
  | "Security"
  | "Notifications";

type FormFieldProps = {
  label: string;
  children: ReactNode;
};

type OverviewItemProps = {
  icon: ReactNode;
  label: string;
  value: string;
  color?: string;
};

function DashboardCard({ children, ...props }: ComponentProps<typeof Box>) {
  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderColor="brand.border"
      borderRadius="16px"
      boxShadow="0 10px 30px rgba(15, 23, 42, 0.04)"
      {...props}
    >
      {children}
    </Box>
  );
}

function FormField({ label, children }: FormFieldProps) {
  return (
    <Box>
      <Text fontSize="sm" fontWeight="semibold" color="brand.dark" mb="2">
        {label}
      </Text>

      {children}
    </Box>
  );
}

function SettingsInput(props: ComponentProps<typeof Input>) {
  return (
    <Input
      h="44px"
      borderColor="brand.border"
      borderRadius="8px"
      fontSize="sm"
      _focus={{
        borderColor: "brand.primary",
        boxShadow: "0 0 0 1px #0015D6",
      }}
      {...props}
    />
  );
}

function SettingsSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <NativeSelect.Root>
      <NativeSelect.Field
        value={value}
        onChange={(event) => onChange(event.target.value)}
        h="44px"
        borderColor="brand.border"
        borderRadius="8px"
        fontSize="sm"
      >
        {children}
      </NativeSelect.Field>
      <NativeSelect.Indicator />
    </NativeSelect.Root>
  );
}

function SettingsTabs({
  activeTab,
  onChange,
}: {
  activeTab: SettingsTab;
  onChange: (tab: SettingsTab) => void;
}) {
  const tabs: SettingsTab[] = [
    "Profile",
    "Verification",
    "Preferences",
    "Security",
    "Notifications",
  ];

  return (
    <HStack
      gap="8"
      borderBottomWidth="1px"
      borderColor="brand.border"
      overflowX="auto"
      mb="6"
    >
      {tabs.map((tab) => {
        const active = activeTab === tab;

        return (
          <Button
            key={tab}
            variant="ghost"
            onClick={() => onChange(tab)}
            pb="4"
            px="1"
            h="auto"
            borderRadius="0"
            color={active ? "brand.primary" : "brand.dark"}
            borderBottomWidth="2px"
            borderColor={active ? "brand.primary" : "transparent"}
            fontWeight={active ? "bold" : "medium"}
            fontSize="sm"
            whiteSpace="nowrap"
            _hover={{
              bg: "transparent",
              color: "brand.primary",
            }}
          >
            {tab}
          </Button>
        );
      })}
    </HStack>
  );
}

function ProfileInformationCard() {
  const [fullName, setFullName] = useState("Nimesha Perera");
  const [email] = useState("nimesha.perera@example.com");
  const [phoneCode, setPhoneCode] = useState("+94");
  const [phoneNumber, setPhoneNumber] = useState("77 123 4567");
  const [dateOfBirth, setDateOfBirth] = useState("1998-07-15");
  const [gender, setGender] = useState("Female");
  const [city, setCity] = useState("Colombo");
  const [district, setDistrict] = useState("Colombo");
  const [educationLevel, setEducationLevel] = useState("Bachelor's Degree");
  const [occupation, setOccupation] = useState("Student");
  const [address, setAddress] = useState("123, Galle Road, Colombo 03");

  return (
    <DashboardCard p={{ base: "5", lg: "6" }}>
      <Text fontSize="xl" fontWeight="bold" color="brand.dark">
        Profile Information
      </Text>

      <Text fontSize="sm" color="brand.mutedText" mt="1">
        Update your personal information
      </Text>

      <Box mt="6">
        <Text fontSize="sm" fontWeight="semibold" color="brand.dark" mb="3">
          Profile Photo
        </Text>

        <HStack gap="5" align="center">
          <Box position="relative">
            <Box
              w="86px"
              h="86px"
              borderRadius="full"
              bg="brand.lightBlue"
              color="brand.primary"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="34px"
              fontWeight="bold"
              overflow="hidden"
            >
              NP
            </Box>

            <IconButton
              aria-label="Edit photo"
              size="xs"
              position="absolute"
              right="0"
              bottom="0"
              borderRadius="full"
              bg="white"
              borderWidth="1px"
              borderColor="brand.border"
            >
              <FiEdit2 />
            </IconButton>
          </Box>

          <Box>
            <Text fontSize="sm" color="brand.mutedText" mb="3">
              JPG, PNG or GIF. Max size 5MB.
            </Text>

            <Button variant="outline">
              <FiCamera />
              Change Photo
            </Button>
          </Box>
        </HStack>
      </Box>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="5" mt="6">
        <FormField label="Full Name">
          <SettingsInput
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </FormField>

        <FormField label="Email Address">
          <SettingsInput
            value={email}
            readOnly
            bg="#F8FAFC"
            color="brand.mutedText"
          />
        </FormField>

        <FormField label="Phone Number">
          <HStack gap="2">
            <Box w="110px">
              <SettingsSelect value={phoneCode} onChange={setPhoneCode}>
                <option value="+94">+94</option>
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </SettingsSelect>
            </Box>

            <SettingsInput
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </HStack>
        </FormField>

        <FormField label="Date of Birth">
          <SettingsInput
            type="date"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
          />
        </FormField>

        <FormField label="Gender">
          <SettingsSelect value={gender} onChange={setGender}>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </SettingsSelect>
        </FormField>

        <FormField label="City">
          <SettingsInput
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </FormField>

        <FormField label="District">
          <SettingsSelect value={district} onChange={setDistrict}>
            <option value="Colombo">Colombo</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Kandy">Kandy</option>
            <option value="Galle">Galle</option>
            <option value="Kurunegala">Kurunegala</option>
          </SettingsSelect>
        </FormField>

        <FormField label="Education Level">
          <SettingsSelect value={educationLevel} onChange={setEducationLevel}>
            <option value="School Student">School Student</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
            <option value="Master's Degree">Master&apos;s Degree</option>
            <option value="PhD">PhD</option>
          </SettingsSelect>
        </FormField>

        <FormField label="Occupation">
          <SettingsSelect value={occupation} onChange={setOccupation}>
            <option value="Student">Student</option>
            <option value="Private Sector Employee">
              Private Sector Employee
            </option>
            <option value="Government Employee">Government Employee</option>
            <option value="Business Owner">Business Owner</option>
            <option value="Freelancer">Freelancer</option>
          </SettingsSelect>
        </FormField>

        <FormField label="Address (Optional)">
          <SettingsInput
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          />
        </FormField>
      </Grid>

      <Button mt="6" color="white" px="8">
        Save Changes
      </Button>
    </DashboardCard>
  );
}

function OverviewItem({
  icon,
  label,
  value,
  color = "brand.primary",
}: OverviewItemProps) {
  return (
    <HStack gap="4">
      <Box
        w="42px"
        h="42px"
        borderRadius="12px"
        bg="brand.lightBlue"
        color={color}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="20px"
        flexShrink="0"
      >
        {icon}
      </Box>

      <Box>
        <Text fontSize="xs" color="brand.mutedText">
          {label}
        </Text>

        <Text fontSize="sm" color={color} fontWeight="bold" mt="1">
          {value}
        </Text>
      </Box>
    </HStack>
  );
}

function AccountOverviewCard() {
  return (
    <DashboardCard p={{ base: "5", lg: "6" }}>
      <Text fontSize="xl" fontWeight="bold" color="brand.dark" mb="6">
        Account Overview
      </Text>

      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap="5">
        <OverviewItem
          icon={<FiCalendar />}
          label="Member Since"
          value="12 May 2024"
          color="brand.dark"
        />

        <OverviewItem
          icon={<FiCheck />}
          label="Account Status"
          value="Active"
          color="green.600"
        />

        <OverviewItem
          icon={<FiShield />}
          label="Verification Status"
          value="Not Verified"
          color="brand.primary"
        />

        <OverviewItem
          icon={<FiHome />}
          label="Total Surveys Completed"
          value="18"
          color="#7C3AED"
        />
      </Grid>
    </DashboardCard>
  );
}

function VerificationStepTracker() {
  const steps = [
    {
      number: "1",
      title: "Step 1",
      label: "ID Document",
    },
    {
      number: "2",
      title: "Step 2",
      label: "Selfie",
    },
    {
      number: "3",
      title: "Step 3",
      label: "Review",
    },
  ];

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap="3" mt="6">
      {steps.map((step, index) => (
        <Box key={step.number}>
          <HStack justify="center" gap="4">
            <Box
              w="32px"
              h="32px"
              borderRadius="full"
              bg="brand.primary"
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
              fontSize="sm"
            >
              {step.number}
            </Box>

            {index !== steps.length - 1 && (
              <Box
                flex="1"
                h="1px"
                borderTopWidth="1px"
                borderColor="#BFD0FF"
                borderStyle="dashed"
              />
            )}
          </HStack>

          <Text textAlign="center" fontSize="sm" color="brand.dark" mt="3">
            {step.title}
          </Text>

          <Text textAlign="center" fontSize="sm" color="brand.mutedText" mt="1">
            {step.label}
          </Text>
        </Box>
      ))}
    </Grid>
  );
}

function UploadBox({
  icon,
  title,
  description,
  acceptText,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  acceptText: string;
}) {
  return (
    <Box mt="5">
      <HStack gap="3" mb="3">
        <Box color="brand.primary">{icon}</Box>

        <Text fontSize="sm" fontWeight="bold" color="brand.dark">
          {title}
        </Text>
      </HStack>

      <Box
        borderWidth="1px"
        borderStyle="dashed"
        borderColor="#BFD0FF"
        borderRadius="12px"
        bg="#FBFCFF"
        minH="112px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        cursor="pointer"
        _hover={{
          borderColor: "brand.primary",
          bg: "brand.lightBlue",
        }}
      >
        <Box>
          <Box
            color="brand.primary"
            display="flex"
            justifyContent="center"
            fontSize="30px"
            mb="2"
          >
            <FiUploadCloud />
          </Box>

          <Text fontSize="sm" color="brand.mutedText">
            {description}
          </Text>

          <Text fontSize="sm" color="brand.mutedText" mt="1">
            {acceptText}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

function VerificationInfoBox() {
  const items = [
    "Verified users can access more surveys and earn more.",
    "Files are used only to confirm you are a real person.",
    "Responses remain anonymous.",
    "No one can see who voted or filled a survey.",
    "Survey results are shown anonymously.",
    "You can also complete this later.",
  ];

  return (
    <Box mt="6" bg="brand.lightBlue" borderRadius="12px" p="5">
      <VStack align="stretch" gap="3">
        {items.map((item) => (
          <HStack key={item} gap="3" align="start">
            <Box color="brand.primary" pt="1">
              <FiCheck />
            </Box>

            <Text fontSize="sm" color="brand.dark">
              {item}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
}

function AccountVerificationCard() {
  return (
    <DashboardCard p={{ base: "5", lg: "6" }}>
      <HStack justify="space-between" align="start" gap="4">
        <HStack gap="4" align="start">
          <Box
            w="44px"
            h="44px"
            borderRadius="14px"
            bg="brand.lightBlue"
            color="brand.primary"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="24px"
          >
            <FiShield />
          </Box>

          <Box>
            <Text fontSize="xl" fontWeight="bold" color="brand.dark">
              Account Verification
            </Text>

            <Text fontSize="sm" color="brand.mutedText" mt="1" maxW="540px">
              Verify your identity to unlock more surveys and higher earning
              opportunities.
            </Text>
          </Box>
        </HStack>

        <Box
          px="3"
          py="1"
          borderRadius="999px"
          bg="#EEF2FF"
          color="brand.primary"
          fontSize="xs"
          fontWeight="bold"
          whiteSpace="nowrap"
        >
          Not Verified
        </Box>
      </HStack>

      <VerificationStepTracker />

      <UploadBox
        icon={<FiKey />}
        title="Upload NIC / Driving Licence (Front)"
        description="Drag and drop your file here, or click to browse"
        acceptText="JPG, PNG or PDF"
      />

      <UploadBox
        icon={<FiCamera />}
        title="Upload a Selfie"
        description="Drag and drop your file here, or click to browse"
        acceptText="Make sure your face is clearly visible"
      />

      <VerificationInfoBox />

      <Button mt="6" color="white" px="8">
        Start Verification
      </Button>
    </DashboardCard>
  );
}

function PlaceholderSettingsCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <DashboardCard p="8">
      <VStack align="center" justify="center" minH="360px" textAlign="center">
        <Box
          w="70px"
          h="70px"
          borderRadius="20px"
          bg="brand.lightBlue"
          color="brand.primary"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="34px"
        >
          {icon}
        </Box>

        <Text fontSize="2xl" fontWeight="bold" color="brand.dark">
          {title}
        </Text>

        <Text color="brand.mutedText" maxW="520px">
          {description}
        </Text>
      </VStack>
    </DashboardCard>
  );
}

function ProfileTabContent() {
  return (
    <Grid templateColumns={{ base: "1fr", xl: "1.15fr 1fr" }} gap="5">
      <VStack align="stretch" gap="5">
        <ProfileInformationCard />
        <AccountOverviewCard />
      </VStack>

      <AccountVerificationCard />
    </Grid>
  );
}

export default function ParticipantSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Profile");

  return (
    <Flex minH="100vh" bg="white" color="brand.dark">
      <ParticipantSidebar activeItem="Settings" />

      <Box flex="1" px={{ base: "4", lg: "7" }} py={{ base: "5", lg: "6" }}>
        <Box maxW="1420px">
          <Box mb="7">
            <Text
              fontSize={{ base: "3xl", lg: "4xl" }}
              fontWeight="extrabold"
              color="brand.dark"
              lineHeight="1"
            >
              Settings
            </Text>

            <Text fontSize="lg" color="brand.mutedText" mt="3">
              Manage your account, preferences and verification
            </Text>
          </Box>

          <SettingsTabs activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === "Profile" && <ProfileTabContent />}

          {activeTab === "Verification" && <AccountVerificationCard />}

          {activeTab === "Preferences" && (
            <PlaceholderSettingsCard
              icon={<FiUser />}
              title="Preferences"
              description="Manage survey categories, preferred language, location matching, and reward preferences."
            />
          )}

          {activeTab === "Security" && (
            <PlaceholderSettingsCard
              icon={<FiShield />}
              title="Security"
              description="Update password, manage login sessions, and configure account security options."
            />
          )}

          {activeTab === "Notifications" && (
            <PlaceholderSettingsCard
              icon={<FiBell />}
              title="Notifications"
              description="Choose how you want to receive survey alerts, reward updates, and verification messages."
            />
          )}
        </Box>
      </Box>
    </Flex>
  );
}
