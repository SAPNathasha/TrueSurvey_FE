"use client";

import type { ChangeEvent, ComponentProps, ReactNode } from "react";
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
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  FiAlertCircle,
  FiCalendar,
  FiCamera,
  FiCheck,
  FiClock,
  FiEdit2,
  FiHome,
  FiKey,
  FiShield,
  FiUploadCloud,
  FiUser,
} from "react-icons/fi";

import ParticipantSidebar from "@/components/pages/participant/dashboard/ParticipantSidebar";
import { getStoredParticipantId } from "@/lib/participantIdentity";
import { getStoredUserRole } from "@/lib/userRole";
import { toaster } from "@/components/ui/toaster";
import {
  getParticipantProfileSettings,
  type ParticipantProfileSettingsResponse,
  type UpdateParticipantProfilePayload,
  updateParticipantProfilePhoto,
  updateParticipantProfileSettings,
  verifyParticipantNic,
} from "@/services/participantSettingsService";

const PARTICIPANT_VERIFICATION_STATUS_KEY = "participantVerificationStatus";

type SettingsTab =
  | "Profile"
  | "Verification"
  | "Security";

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

type ProfileFormValues = {
  fullName: string;
  username: string;
  phoneCountryCode: string;
  phoneNumber: string;
  dateOfBirth: string;
  participantAge: string;
  participantGender: string;
  participantCity: string;
  participantDistrict: string;
  participantEducationLevel: string;
  participantOccupation: string;
  participantAddress: string;
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
  showVerificationTab,
}: {
  activeTab: SettingsTab;
  onChange: (tab: SettingsTab) => void;
  showVerificationTab: boolean;
}) {
  const tabs: SettingsTab[] = showVerificationTab
    ? ["Profile", "Verification", "Security"]
    : ["Profile", "Security"];

  return (
    <HStack
      gap="8"
      borderBottomWidth="1px"
      borderColor="brand.border"
      overflowX="auto"
      mb="6"
      align="end"
    >
      {tabs.map((tab) => {
        const active = activeTab === tab;

        return (
          <Button
            key={tab}
            variant="ghost"
            onClick={() => onChange(tab)}
            pb="4"
            px="4"
            pt="3"
            h="auto"
            borderRadius="0"
            color={active ? "brand.primary" : "brand.dark"}
            borderBottomWidth="2px"
            borderColor={active ? "brand.primary" : "transparent"}
            fontWeight={active ? "bold" : "medium"}
            fontSize="sm"
            whiteSpace="nowrap"
            boxShadow="none"
            _hover={{
              bg: "transparent",
              color: "brand.primary",
            }}
            _focus={{
              boxShadow: "none",
              outline: "none",
            }}
            _focusVisible={{
              boxShadow: "outline",
            }}
          >
            {tab}
          </Button>
        );
      })}
    </HStack>
  );
}

function formatDate(value?: string | null) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name?: string | null, username?: string | null) {
  const source = name || username || "TS";
  const parts = source.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function createProfileFormValues(
  profile: ParticipantProfileSettingsResponse["profile"]
): ProfileFormValues {
  return {
    fullName: profile.fullName || "",
    username: profile.username || "",
    phoneCountryCode: profile.phoneCountryCode || "",
    phoneNumber: profile.phoneNumber || "",
    dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.slice(0, 10) : "",
    participantAge: profile.participantAge?.toString() || "",
    participantGender: profile.participantGender || "",
    participantCity: profile.participantCity || "",
    participantDistrict: profile.participantDistrict || "",
    participantEducationLevel: profile.participantEducationLevel || "",
    participantOccupation: profile.participantOccupation || "",
    participantAddress: profile.participantAddress || "",
  };
}

function normalizeChangedString(
  nextValue: string,
  previousValue?: string | null
) {
  const trimmedNext = nextValue.trim();
  const trimmedPrevious = (previousValue || "").trim();

  if (trimmedNext.length === 0 || trimmedNext === trimmedPrevious) {
    return undefined;
  }

  return trimmedNext;
}

function buildUpdatePayload(
  participantId: string,
  formValues: ProfileFormValues,
  previousProfile: ParticipantProfileSettingsResponse["profile"]
): UpdateParticipantProfilePayload {
  const payload: UpdateParticipantProfilePayload = { participantId };

  const fullName = normalizeChangedString(formValues.fullName, previousProfile.fullName);
  const username = normalizeChangedString(formValues.username, previousProfile.username);
  const phoneCountryCode = normalizeChangedString(
    formValues.phoneCountryCode,
    previousProfile.phoneCountryCode
  );
  const phoneNumber = normalizeChangedString(
    formValues.phoneNumber,
    previousProfile.phoneNumber
  );
  const participantCity = normalizeChangedString(
    formValues.participantCity,
    previousProfile.participantCity
  );
  const participantDistrict = normalizeChangedString(
    formValues.participantDistrict,
    previousProfile.participantDistrict
  );
  const participantEducationLevel = normalizeChangedString(
    formValues.participantEducationLevel,
    previousProfile.participantEducationLevel
  );
  const participantOccupation = normalizeChangedString(
    formValues.participantOccupation,
    previousProfile.participantOccupation
  );
  const participantAddress = normalizeChangedString(
    formValues.participantAddress,
    previousProfile.participantAddress
  );

  if (fullName !== undefined) payload.fullName = fullName;
  if (username !== undefined) payload.username = username;
  if (phoneCountryCode !== undefined) payload.phoneCountryCode = phoneCountryCode;
  if (phoneNumber !== undefined) payload.phoneNumber = phoneNumber;
  if (participantCity !== undefined) payload.participantCity = participantCity;
  if (participantDistrict !== undefined) payload.participantDistrict = participantDistrict;
  if (participantEducationLevel !== undefined) {
    payload.participantEducationLevel = participantEducationLevel;
  }
  if (participantOccupation !== undefined) {
    payload.participantOccupation = participantOccupation;
  }
  if (participantAddress !== undefined) payload.participantAddress = participantAddress;

  const previousDateOfBirth = previousProfile.dateOfBirth
    ? previousProfile.dateOfBirth.slice(0, 10)
    : "";
  if (
    formValues.dateOfBirth.trim() &&
    formValues.dateOfBirth.trim() !== previousDateOfBirth
  ) {
    payload.dateOfBirth = formValues.dateOfBirth.trim();
  }

  if (
    formValues.participantGender.trim() &&
    formValues.participantGender !== (previousProfile.participantGender || "")
  ) {
    payload.participantGender = formValues.participantGender.trim();
  }

  const nextAge = formValues.participantAge.trim();
  const previousAge = previousProfile.participantAge?.toString() || "";
  if (nextAge && nextAge !== previousAge) {
    payload.participantAge = Number(nextAge);
  }

  return payload;
}

function ProfileInformationCard({
  data,
  formValues,
  onFieldChange,
  onSave,
  isSaving,
  onProfilePhotoUpload,
  isUploadingPhoto,
}: {
  data: ParticipantProfileSettingsResponse;
  formValues: ProfileFormValues;
  onFieldChange: <K extends keyof ProfileFormValues>(
    field: K,
    value: ProfileFormValues[K]
  ) => void;
  onSave: () => void;
  isSaving: boolean;
  onProfilePhotoUpload: (file: File) => Promise<void>;
  isUploadingPhoto: boolean;
}) {
  const { profile } = data;
  const initials = getInitials(formValues.fullName, formValues.username);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectPhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    await onProfilePhotoUpload(file);
  };

  return (
    <DashboardCard p={{ base: "5", lg: "6" }}>
      <Text fontSize="xl" fontWeight="bold" color="brand.dark">
        Profile Information
      </Text>

      <Text fontSize="sm" color="brand.mutedText" mt="1">
        Update your personal information
      </Text>

      <Box mt="6">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          display="none"
          onChange={(event) => {
            void handlePhotoChange(event);
          }}
        />

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
              {profile.profileImagePath ? (
                <Image
                  src={profile.profileImagePath}
                  alt={profile.fullName || profile.username}
                  w="full"
                  h="full"
                  objectFit="cover"
                />
              ) : (
                initials
              )}
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
              onClick={handleSelectPhoto}
              disabled={isUploadingPhoto}
            >
              <FiEdit2 />
            </IconButton>
          </Box>

          <Box>
            <Text fontSize="sm" color="brand.mutedText" mb="3">
              JPG, JPEG, PNG or WEBP. Max size 5MB.
            </Text>

            <Button
              variant="outline"
              onClick={handleSelectPhoto}
              loading={isUploadingPhoto}
            >
              <FiCamera />
              {isUploadingPhoto ? "Uploading..." : "Change Photo"}
            </Button>
          </Box>
        </HStack>
      </Box>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="5" mt="6">
        <FormField label="Full Name">
          <SettingsInput
            value={formValues.fullName}
            onChange={(event) => onFieldChange("fullName", event.target.value)}
          />
        </FormField>

        <FormField label="Username">
          <SettingsInput
            value={formValues.username}
            onChange={(event) => onFieldChange("username", event.target.value)}
          />
        </FormField>

        <FormField label="Email Address">
          <SettingsInput value={profile.email || ""} readOnly bg="#F8FAFC" />
        </FormField>

        <FormField label="Phone Number">
          <HStack gap="2">
            <Box w="110px">
              <SettingsSelect
                value={formValues.phoneCountryCode}
                onChange={(value) => onFieldChange("phoneCountryCode", value)}
              >
                <option value="">Select</option>
                <option value="+94">+94</option>
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </SettingsSelect>
            </Box>

            <SettingsInput
              value={formValues.phoneNumber}
              onChange={(event) =>
                onFieldChange("phoneNumber", event.target.value)
              }
            />
          </HStack>
        </FormField>

        <FormField label="Date of Birth">
          <SettingsInput
            type="date"
            value={formValues.dateOfBirth}
            onChange={(event) => onFieldChange("dateOfBirth", event.target.value)}
          />
        </FormField>

        <FormField label="Age">
          <SettingsInput
            type="number"
            min={13}
            max={100}
            value={formValues.participantAge}
            onChange={(event) =>
              onFieldChange("participantAge", event.target.value)
            }
          />
        </FormField>

        <FormField label="Gender">
          <SettingsSelect
            value={formValues.participantGender}
            onChange={(value) => onFieldChange("participantGender", value)}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </SettingsSelect>
        </FormField>

        <FormField label="City">
          <SettingsInput
            value={formValues.participantCity}
            onChange={(event) =>
              onFieldChange("participantCity", event.target.value)
            }
          />
        </FormField>

        <FormField label="District">
          <SettingsSelect
            value={formValues.participantDistrict}
            onChange={(value) => onFieldChange("participantDistrict", value)}
          >
            <option value="">Select district</option>
            <option value="Colombo">Colombo</option>
            <option value="Gampaha">Gampaha</option>
            <option value="Kandy">Kandy</option>
            <option value="Galle">Galle</option>
            <option value="Kurunegala">Kurunegala</option>
          </SettingsSelect>
        </FormField>

        <FormField label="Education Level">
          <SettingsSelect
            value={formValues.participantEducationLevel}
            onChange={(value) =>
              onFieldChange("participantEducationLevel", value)
            }
          >
            <option value="">Select education level</option>
            <option value="School Student">School Student</option>
            <option value="Diploma">Diploma</option>
            <option value="Bachelor's Degree">Bachelor&apos;s Degree</option>
            <option value="Master's Degree">Master&apos;s Degree</option>
            <option value="PhD">PhD</option>
          </SettingsSelect>
        </FormField>

        <FormField label="Occupation">
          <SettingsSelect
            value={formValues.participantOccupation}
            onChange={(value) => onFieldChange("participantOccupation", value)}
          >
            <option value="">Select occupation</option>
            <option value="Student">Student</option>
            <option value="Private Sector Employee">
              Private Sector Employee
            </option>
            <option value="Government Employee">Government Employee</option>
            <option value="Business Owner">Business Owner</option>
            <option value="Freelancer">Freelancer</option>
          </SettingsSelect>
        </FormField>

        <FormField label="Address">
          <SettingsInput
            value={formValues.participantAddress}
            onChange={(event) =>
              onFieldChange("participantAddress", event.target.value)
            }
          />
        </FormField>
      </Grid>

      <Button mt="6" color="white" px="8" onClick={onSave} loading={isSaving}>
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

function AccountOverviewCard({
  data,
}: {
  data: ParticipantProfileSettingsResponse;
}) {
  const { accountOverview } = data;

  return (
    <DashboardCard p={{ base: "5", lg: "6" }}>
      <Text fontSize="xl" fontWeight="bold" color="brand.dark" mb="6">
        Account Overview
      </Text>

      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap="5">
        <OverviewItem
          icon={<FiCalendar />}
          label="Member Since"
          value={formatDate(accountOverview.memberSince)}
          color="brand.dark"
        />

        <OverviewItem
          icon={<FiCheck />}
          label="Account Status"
          value={accountOverview.accountStatus}
          color="green.600"
        />

        <OverviewItem
          icon={<FiShield />}
          label="Verification Status"
          value={
            accountOverview.verificationStatus === "VERIFIED"
              ? "Verified"
              : "Not Verified"
          }
          color={
            accountOverview.verificationStatus === "VERIFIED"
              ? "green.600"
              : "brand.primary"
          }
        />

        <OverviewItem
          icon={<FiHome />}
          label="Total Surveys Completed"
          value={String(accountOverview.totalSurveysCompleted)}
          color="#7C3AED"
        />
      </Grid>
    </DashboardCard>
  );
}

function VerificationStepTracker({
  isVerified,
}: {
  isVerified: boolean;
}) {
  const steps = [
    {
      number: "1",
      title: "Step 1",
      label: "ID Document",
      completed: isVerified,
    },
    {
      number: "2",
      title: "Step 2",
      label: "Selfie",
      completed: isVerified,
    },
    {
      number: "3",
      title: "Step 3",
      label: "Review",
      completed: isVerified,
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
              bg={step.completed ? "green.600" : "brand.primary"}
              color="white"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontWeight="bold"
              fontSize="sm"
            >
              {step.completed ? <FiCheck /> : step.number}
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
  fileName,
  onClick,
  isDisabled = false,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  acceptText: string;
  fileName?: string;
  onClick?: () => void;
  isDisabled?: boolean;
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
        cursor={isDisabled ? "not-allowed" : "pointer"}
        opacity={isDisabled ? 0.65 : 1}
        onClick={isDisabled ? undefined : onClick}
        _hover={{
          borderColor: isDisabled ? "#BFD0FF" : "brand.primary",
          bg: isDisabled ? "#FBFCFF" : "brand.lightBlue",
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

          {fileName ? (
            <Text fontSize="sm" color="brand.dark" fontWeight="semibold" mt="3">
              Selected: {fileName}
            </Text>
          ) : null}
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

function VerificationStatusNotice({
  icon,
  title,
  description,
  bg,
  color,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  bg: string;
  color: string;
}) {
  return (
    <HStack
      mt="6"
      align="start"
      gap="4"
      bg={bg}
      borderRadius="12px"
      px="4"
      py="4"
    >
      <Box color={color} fontSize="20px" pt="0.5">
        {icon}
      </Box>

      <Box>
        <Text fontSize="sm" fontWeight="bold" color="brand.dark">
          {title}
        </Text>

        <Text fontSize="sm" color="brand.mutedText" mt="1">
          {description}
        </Text>
      </Box>
    </HStack>
  );
}

function AccountVerificationCard({
  data,
}: {
  data: ParticipantProfileSettingsResponse;
}) {
  const isVerified = data.accountOverview.verificationStatus === "VERIFIED";
  const idVerificationStatus = data.accountOverview.idVerificationStatus;
  const showForm =
    idVerificationStatus === "NOT_TRIED" || idVerificationStatus === "REJECTED";
  const isAccepted = idVerificationStatus === "ACCEPTED";
  const [nicNumber, setNicNumber] = useState("");
  const [identityFrontImage, setIdentityFrontImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQueued, setIsQueued] = useState(false);
  const identityFrontInputRef = useRef<HTMLInputElement | null>(null);
  const selfieInputRef = useRef<HTMLInputElement | null>(null);

  const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ]);

  const handleVerificationFileSelect =
    (type: "identity" | "selfie") => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      if (!allowedMimeTypes.has(file.type)) {
        toaster.create({
          type: "error",
          title: "Invalid file type",
          description: "Please upload a JPG, JPEG, PNG, or WEBP image.",
        });
        event.target.value = "";
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toaster.create({
          type: "error",
          title: "File too large",
          description: "Verification images must be 5MB or smaller.",
        });
        event.target.value = "";
        return;
      }

      if (type === "identity") {
        setIdentityFrontImage(file);
      } else {
        setSelfieImage(file);
      }
    };

  const handleSubmitVerification = async () => {
    if (isVerified) {
      return;
    }

    if (!nicNumber.trim()) {
      toaster.create({
        type: "error",
        title: "NIC number required",
        description: "Please enter your NIC number before continuing.",
      });
      return;
    }

    if (!identityFrontImage) {
      toaster.create({
        type: "error",
        title: "Identity image required",
        description: "Please upload the front image of your NIC or licence.",
      });
      return;
    }

    if (!selfieImage) {
      toaster.create({
        type: "error",
        title: "Selfie required",
        description: "Please upload a clear selfie to continue.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await verifyParticipantNic(
        nicNumber.trim(),
        identityFrontImage,
        selfieImage
      );

      setIsQueued(true);
      toaster.create({
        type: "success",
        title: "Verification submitted",
        description: response.message,
      });
    } catch (verificationError) {
      toaster.create({
        type: "error",
        title: "Verification failed",
        description:
          verificationError instanceof Error
            ? verificationError.message
            : "Could not submit NIC verification",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          bg={isVerified ? "#DCFCE7" : "#EEF2FF"}
          color={isVerified ? "green.600" : "brand.primary"}
          fontSize="xs"
          fontWeight="bold"
          whiteSpace="nowrap"
        >
          {isVerified ? "Verified" : "Not Verified"}
        </Box>
      </HStack>

      {/* <VerificationStepTracker isVerified={isVerified} /> */}

      <Input
        ref={identityFrontInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        display="none"
        onChange={handleVerificationFileSelect("identity")}
      />

      <Input
        ref={selfieInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        display="none"
        onChange={handleVerificationFileSelect("selfie")}
      />

      {idVerificationStatus === "PENDING" ? (
        <VerificationStatusNotice
          icon={<FiClock />}
          title="Your NIC verification is still in progress"
          description="Check back later while we review your submitted details."
          bg="#EEF2FF"
          color="brand.primary"
        />
      ) : null}

      {isAccepted ? (
        <VerificationStatusNotice
          icon={<FiCheck />}
          title="Your verification is successful"
          description="Your identity has been verified and you can now access more surveys."
          bg="#DCFCE7"
          color="green.600"
        />
      ) : null}

      {idVerificationStatus === "REJECTED" ? (
        <VerificationStatusNotice
          icon={<FiAlertCircle />}
          title="Your NIC verification got rejected"
          description="Please review your details and submit your verification again below."
          bg="#FEF2F2"
          color="red.500"
        />
      ) : null}

      {showForm ? (
        <>
          <Box mt="6" maxW={{ base: "100%", md: "420px" }}>
            <FormField label="NIC Number">
              <SettingsInput
                value={nicNumber}
                onChange={(event) => setNicNumber(event.target.value)}
                placeholder="Enter your NIC number"
              />
            </FormField>
          </Box>

          <UploadBox
            icon={<FiKey />}
            title="Upload NIC / Driving Licence (Front)"
            description="Drag and drop your file here, or click to browse"
            acceptText="JPG, JPEG, PNG, or WEBP"
            fileName={identityFrontImage?.name}
            onClick={() => identityFrontInputRef.current?.click()}
            isDisabled={isVerified || isSubmitting}
          />

          <UploadBox
            icon={<FiCamera />}
            title="Upload a Selfie"
            description="Drag and drop your file here, or click to browse"
            acceptText="Make sure your face is clearly visible"
            fileName={selfieImage?.name}
            onClick={() => selfieInputRef.current?.click()}
            isDisabled={isVerified || isSubmitting}
          />

          <VerificationInfoBox />

          <Button
            mt="6"
            color="white"
            px="8"
            onClick={handleSubmitVerification}
            loading={isSubmitting}
            disabled={isVerified || isSubmitting}
          >
            {isQueued
              ? "Verification Submitted"
              : idVerificationStatus === "REJECTED"
                ? "Submit Again"
                : "Start Verification"}
          </Button>
        </>
      ) : null}
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

function ProfileTabContent({
  data,
  formValues,
  onFieldChange,
  onSave,
  isSaving,
  onProfilePhotoUpload,
  isUploadingPhoto,
}: {
  data: ParticipantProfileSettingsResponse;
  formValues: ProfileFormValues;
  onFieldChange: <K extends keyof ProfileFormValues>(
    field: K,
    value: ProfileFormValues[K]
  ) => void;
  onSave: () => void;
  isSaving: boolean;
  onProfilePhotoUpload: (file: File) => Promise<void>;
  isUploadingPhoto: boolean;
}) {
  return (
    <Grid templateColumns={{ base: "1fr", xl: "1fr" }} gap="5">
      <VStack align="stretch" gap="5">
        <ProfileInformationCard
          data={data}
          formValues={formValues}
          onFieldChange={onFieldChange}
          onSave={onSave}
          isSaving={isSaving}
          onProfilePhotoUpload={onProfilePhotoUpload}
          isUploadingPhoto={isUploadingPhoto}
        />
        <AccountOverviewCard data={data} />
      </VStack>
    </Grid>
  );
}

export default function ParticipantSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("Profile");
  const [participantId] = useState(() => getStoredParticipantId());
  const userRole = getStoredUserRole();
  const [data, setData] = useState<ParticipantProfileSettingsResponse | null>(
    null
  );
  const [formValues, setFormValues] = useState<ProfileFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(participantId));
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (!participantId) {
      return;
    }

    getParticipantProfileSettings(participantId)
      .then((response) => {
        if (isMounted) {
          window.localStorage.setItem(
            PARTICIPANT_VERIFICATION_STATUS_KEY,
            response.accountOverview.verificationStatus
          );
          setData(response);
          setFormValues(createProfileFormValues(response.profile));
          setError("");
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Failed to load settings"
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [participantId]);

  const missingParticipantIdError = participantId
    ? ""
    : "Participant id was not found. Please log in again.";
  const showVerificationTab = userRole !== "CREATOR";
  const resolvedActiveTab =
    !showVerificationTab && activeTab === "Verification" ? "Profile" : activeTab;

  if (isLoading) {
    return (
      <Flex minH="100vh" bg="white" color="brand.dark">
        <ParticipantSidebar activeItem="Settings" />
        <Flex flex="1" align="center" justify="center" gap="3">
          <Spinner color="brand.primary" />
          <Text color="brand.mutedText">Loading settings...</Text>
        </Flex>
      </Flex>
    );
  }

  if (missingParticipantIdError || error || !data || !formValues) {
    return (
      <Flex minH="100vh" bg="white" color="brand.dark">
        <ParticipantSidebar activeItem="Settings" />
        <Flex flex="1" align="center" justify="center" p="6">
          <DashboardCard p="6" maxW="560px">
            <Text fontWeight="bold" color="brand.dark">
              We could not load settings.
            </Text>
            <Text color="brand.mutedText" mt="2">
              {missingParticipantIdError || error || "Please try again later."}
            </Text>
          </DashboardCard>
        </Flex>
      </Flex>
    );
  }

  const handleFieldChange = <K extends keyof ProfileFormValues>(
    field: K,
    value: ProfileFormValues[K]
  ) => {
    setFormValues((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleSaveProfile = async () => {
    if (!participantId) {
      return;
    }

    const payload = buildUpdatePayload(participantId, formValues, data.profile);

    if (Object.keys(payload).length === 1) {
      toaster.create({
        type: "info",
        title: "No changes to save",
      });
      return;
    }

    try {
      setIsSaving(true);
      const response = await updateParticipantProfileSettings(payload);
      const nextData: ParticipantProfileSettingsResponse = {
        ...data,
        profile: response.profile,
      };

      setData(nextData);
      setFormValues(createProfileFormValues(response.profile));

      toaster.create({
        type: "success",
        title: "Profile updated",
        description: response.message,
      });
    } catch (saveError) {
      toaster.create({
        type: "error",
        title: "Update failed",
        description:
          saveError instanceof Error
            ? saveError.message
            : "Could not update profile settings",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePhotoUpload = async (file: File) => {
    if (!participantId) {
      return;
    }

    const allowedMimeTypes = new Set([
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ]);

    if (!allowedMimeTypes.has(file.type)) {
      toaster.create({
        type: "error",
        title: "Invalid file type",
        description: "Please upload a JPG, JPEG, PNG, or WEBP image.",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toaster.create({
        type: "error",
        title: "File too large",
        description: "Profile photo must be 5MB or smaller.",
      });
      return;
    }

    try {
      setIsUploadingPhoto(true);
      const response = await updateParticipantProfilePhoto(participantId, file);

      setData((current) =>
        current
          ? {
              ...current,
              profile: {
                ...current.profile,
                ...response.profile,
              },
            }
          : current
      );

      toaster.create({
        type: "success",
        title: "Profile photo updated",
        description: response.message,
      });
    } catch (uploadError) {
      toaster.create({
        type: "error",
        title: "Upload failed",
        description:
          uploadError instanceof Error
            ? uploadError.message
            : "Could not update profile photo",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

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
              Manage your account, profile, and verification details.
            </Text>
          </Box>

          <SettingsTabs
            activeTab={resolvedActiveTab}
            onChange={setActiveTab}
            showVerificationTab={showVerificationTab}
          />

          {resolvedActiveTab === "Profile" && (
            <ProfileTabContent
              data={data}
              formValues={formValues}
              onFieldChange={handleFieldChange}
              onSave={handleSaveProfile}
              isSaving={isSaving}
              onProfilePhotoUpload={handleProfilePhotoUpload}
              isUploadingPhoto={isUploadingPhoto}
            />
          )}

          {showVerificationTab && resolvedActiveTab === "Verification" && (
            <AccountVerificationCard data={data} />
          )}

          {resolvedActiveTab === "Security" && (
            <PlaceholderSettingsCard
              icon={<FiShield />}
              title="Security"
              description="Update password, manage login sessions, and configure account security options."
            />
          )}
        </Box>
      </Box>
    </Flex>
  );
}
