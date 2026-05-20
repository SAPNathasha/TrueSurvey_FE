"use client";

import IconBox from "@/components/common/IconBox";
import { IoPeople } from "react-icons/io5";
import { MdOutlineSecurity } from "react-icons/md";
import { CiGift } from "react-icons/ci";

import { Flex, Heading, Text, Grid } from "@chakra-ui/react";
import SignupImage from "./SignupImage";

interface SignUpLeft {
  headindLineOne: string;
  headingLineTwo: string;
  colouredText?: string;
  textLineOne: string;
  textLineTwo?: string;
  textLineThree?: string;
}
export default function SignUpLeft({
  headindLineOne,
  headingLineTwo,
  colouredText,
  textLineOne,
  textLineTwo,
  textLineThree,
}: SignUpLeft) {
  return (
    <Flex flex="1" gap="4" direction="column" alignItems="flex-start">
      <Heading textStyle="h1" color="black">
        {headindLineOne}
        <br />
        <Text as="span">{headingLineTwo}</Text>
        <Text color="brand.primary">{colouredText}</Text>
      </Heading>

      <Text textStyle="bodyText" fontSize="17px">
        {textLineOne}
        <br /> {textLineTwo} <br /> {textLineThree}
      </Text>

      <SignupImage />

      <Grid templateColumns="repeat(3, 1fr)" gap="5">
        <IconBox
          title="For Everyone"
          description="Whether you want to build surveys, we've got you."
          iconBg="#DDE8FE"
          icon={IoPeople}
          iconColor="brand.primary"
        />

        <IconBox
          title="Secure & Private"
          description="Your data is encrypted and always protected."
          iconBg="#D7F7F0"
          icon={MdOutlineSecurity}
          iconColor="#0AB188"
        />

        <IconBox
          title="Earn Rewards"
          description="Earn rewards and grow your insights on TrueSurvey."
          iconBg="#EEE7FA"
          icon={CiGift}
          iconColor="#6537ED"
        />
      </Grid>
    </Flex>
  );
}
