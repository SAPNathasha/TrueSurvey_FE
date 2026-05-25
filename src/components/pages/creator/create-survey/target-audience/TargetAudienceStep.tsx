"use client";

import {
  Box,
  Button,
  Grid,
  HStack,
  Input,
  NativeSelect,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiFileText,
  FiInfo,
  FiMapPin,
  FiShield,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { LuGraduationCap } from "react-icons/lu";

import DashboardCard from "@/components/pages/creator/dashboard/DashboardCard";

type TargetAudienceStepProps = {
  onBack: () => void;
  onNext: () => void;
};

type AudienceTagProps = {
  icon: React.ReactNode;
  label: string;
  bg: string;
  color: string;
  borderColor: string;
};

function AudienceTag({
  icon,
  label,
  bg,
  color,
  borderColor,
}: AudienceTagProps) {
  return (
    <HStack
      gap="2"
      px="4"
      py="2"
      borderRadius="8px"
      borderWidth="1px"
      borderColor={borderColor}
      bg={bg}
      color={color}
      fontSize="sm"
      fontWeight="medium"
    >
      {icon}
      <Text>{label}</Text>
    </HStack>
  );
}

export default function TargetAudienceStep({
  onBack,
  onNext,
}: TargetAudienceStepProps) {
  const [minimumAge, setMinimumAge] = useState("18");
  const [maximumAge, setMaximumAge] = useState("45");
  const [gender, setGender] = useState("All");
  const [city, setCity] = useState("Colombo");
  const [educationLevel, setEducationLevel] = useState(
    "Undergraduate / Bachelor's Degree"
  );
  const [district, setDistrict] = useState("Colombo District");
  const [occupation, setOccupation] = useState("Executive / Student / Any");
  const [sampleBase, setSampleBase] = useState("Verified users");

  const estimatedReach = useMemo(() => {
    let reach = 2400;

    if (sampleBase === "Verified users") reach -= 700;
    if (gender !== "All") reach -= 250;
    if (city !== "Any city") reach -= 300;
    if (educationLevel !== "Any education level") reach -= 180;

    return Math.max(reach, 500).toLocaleString();
  }, [sampleBase, gender, city, educationLevel]);

  return (
    <Box>
      <Box
        bg="brand.lightBlue"
        borderWidth="1px"
        borderColor="#D7E3FF"
        borderRadius="12px"
        px="5"
        py="4"
        mb="5"
      >
        <HStack gap="3" align="start">
          <Box color="brand.primary" pt="1">
            <FiInfo />
          </Box>

          <Text fontSize="sm" color="brand.mutedText">
            Define who should receive this survey by selecting your audience
            filters. You can refine age, location, education, occupation, and
            user verification preferences before continuing.
          </Text>
        </HStack>
      </Box>

      <DashboardCard p="0">
        <Box p={{ base: "5", lg: "7" }}>
          <Text fontSize="xl" fontWeight="bold" color="brand.dark" mb="5">
            Audience Filters
          </Text>

          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap="5">
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                Minimum Age
              </Text>

              <Input
                type="number"
                value={minimumAge}
                onChange={(event) => setMinimumAge(event.target.value)}
                h="46px"
                borderColor="brand.border"
                px="4"
                _focus={{
                  borderColor: "brand.primary",
                  boxShadow: "0 0 0 1px #0015D6",
                }}
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                Maximum Age
              </Text>

              <Input
                type="number"
                value={maximumAge}
                onChange={(event) => setMaximumAge(event.target.value)}
                h="46px"
                borderColor="brand.border"
                px="4"
                _focus={{
                  borderColor: "brand.primary",
                  boxShadow: "0 0 0 1px #0015D6",
                }}
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                Gender
              </Text>

              <NativeSelect.Root>
                <NativeSelect.Field
                  value={gender}
                  onChange={(event) => setGender(event.target.value)}
                  h="46px"
                  borderColor="brand.border"
                >
                  <option value="All">All</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                City
              </Text>

              <Input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="e.g., Colombo"
                h="46px"
                borderColor="brand.border"
                px="4"
                _focus={{
                  borderColor: "brand.primary",
                  boxShadow: "0 0 0 1px #0015D6",
                }}
              />
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2">
                Education Level
              </Text>

              <NativeSelect.Root>
                <NativeSelect.Field
                  value={educationLevel}
                  onChange={(event) => setEducationLevel(event.target.value)}
                  h="46px"
                  borderColor="brand.border"
                  px={5}
                >
                  <option value="Any education level">
                    Any education level
                  </option>
                  <option value="School Student">School Student</option>
                  <option value="Undergraduate / Bachelor's Degree">
                    Undergraduate / Bachelor&apos;s Degree
                  </option>
                  <option value="Diploma / Certificate">
                    Diploma / Certificate
                  </option>
                  <option value="Master's Degree">Master&apos;s Degree</option>
                  <option value="PhD / Doctorate">PhD / Doctorate</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2" >
                District
              </Text>

              <NativeSelect.Root>
                <NativeSelect.Field
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                  h="46px"
                  borderColor="brand.border"
                  px={5}
                >
                  <option value="Any district">Any district</option>
                  <option value="Colombo District">Colombo District</option>
                  <option value="Gampaha District">Gampaha District</option>
                  <option value="Kandy District">Kandy District</option>
                  <option value="Galle District">Galle District</option>
                  <option value="Kurunegala District">
                    Kurunegala District
                  </option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2" >
                Occupation
              </Text>

              <NativeSelect.Root>
                <NativeSelect.Field
                  value={occupation}
                  onChange={(event) => setOccupation(event.target.value)}
                  h="46px"
                  borderColor="brand.border"
                  px={5}
                >
                  <option value="Any">Any</option>
                  <option value="Student">Student</option>
                  <option value="Executive / Student / Any">
                    Executive / Student / Any
                  </option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Government Employee">
                    Government Employee
                  </option>
                  <option value="Private Sector Employee">
                    Private Sector Employee
                  </option>
                  <option value="Freelancer">Freelancer</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb="2" >
                Sample Base
              </Text>

              <NativeSelect.Root>
                <NativeSelect.Field
                  value={sampleBase}
                  onChange={(event) => setSampleBase(event.target.value)}
                  h="46px"
                  borderColor="brand.border"
                  px={5}
                >
                  <option value="All participants">All participants</option>
                  <option value="Verified users">Verified users</option>
                  <option value="NIC verified users">
                    NIC verified users
                  </option>
                  <option value="Selfie verified users">
                    Selfie verified users
                  </option>
                  <option value="NIC and selfie verified users">
                    NIC and selfie verified users
                  </option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>
          </Grid>
        </Box>
      </DashboardCard>

      <DashboardCard mt="5" p="0">
        <Box p={{ base: "5", lg: "6" }}>
          <Text fontSize="xl" fontWeight="bold" color="brand.dark" mb="4">
            Audience Summary
          </Text>

          <HStack gap="4" flexWrap="wrap">
            <AudienceTag
              icon={<FiUsers />}
              label={`Age ${minimumAge}–${maximumAge}`}
              bg="#EEF2FF"
              color="brand.primary"
              borderColor="#C7D2FE"
            />

            <AudienceTag
              icon={<FiMapPin />}
              label={city || "Any city"}
              bg="#ECFDF3"
              color="#087A35"
              borderColor="#BBF7D0"
            />

            <AudienceTag
              icon={<FiShield />}
              label={sampleBase}
              bg="#F5F3FF"
              color="#6D28D9"
              borderColor="#DDD6FE"
            />

            <AudienceTag
              icon={<LuGraduationCap />}
              label={educationLevel.includes("Undergraduate") ? "Undergraduate" : educationLevel}
              bg="#FFF7ED"
              color="#C2410C"
              borderColor="#FED7AA"
            />

            <AudienceTag
              icon={<FiUsers />}
              label={gender === "All" ? "All genders" : gender}
              bg="#F0F9FF"
              color="#0369A1"
              borderColor="#BAE6FD"
            />
          </HStack>
        </Box>
      </DashboardCard>

      <DashboardCard mt="5" p="0">
        <Box p={{ base: "5", lg: "6" }}>
          <HStack justify="space-between" flexWrap="wrap" gap="5">
            <HStack gap="4">
              <Box
                w="64px"
                h="64px"
                borderRadius="full"
                bg="brand.lightBlue"
                color="brand.primary"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontSize="30px"
              >
                <FiUsers />
              </Box>

              <Box>
                <Text fontWeight="bold" color="brand.dark">
                  Estimated Reach
                </Text>

                <Text fontSize="sm" color="brand.mutedText">
                  Approximate matched users
                </Text>

                <Text
                  fontSize={{ base: "3xl", lg: "4xl" }}
                  fontWeight="extrabold"
                  color="brand.primary"
                  lineHeight="1.1"
                  mt="1"
                >
                  {estimatedReach}
                </Text>
              </Box>
            </HStack>

            <HStack gap="3" color="brand.mutedText">
              <Box color="green.500">
                <FiTrendingUp />
              </Box>

              <Text fontSize="sm" maxW="230px">
                Based on your current audience filters
              </Text>
            </HStack>
          </HStack>
        </Box>
      </DashboardCard>

      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr 1fr" }} gap="4" mt="5">
        <Button h="46px" variant="outline" onClick={onBack}>
          <FiArrowLeft />
          Back to Create Questions
        </Button>

        <Button h="46px" variant="outline">
          <FiFileText />
          Save as Draft
        </Button>

        <Button h="46px" color="white" onClick={onNext} px={5}>
          Continue
          <FiArrowRight />
        </Button>
      </Grid>
    </Box>
  );
}