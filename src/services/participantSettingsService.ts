import api from "@/lib/axios";
import axios from "axios";

export type ParticipantProfileSettingsResponse = {
  profile: {
    id: string;
    username: string;
    fullName: string | null;
    email: string;
    phoneCountryCode: string | null;
    phoneNumber: string | null;
    dateOfBirth: string | null;
    profileImagePath: string | null;
    participantAge: number | null;
    participantGender: string | null;
    participantCity: string | null;
    participantDistrict: string | null;
    participantEducationLevel: string | null;
    participantOccupation: string | null;
    participantAddress: string | null;
  };
  accountOverview: {
    memberSince: string;
    accountStatus: string;
    emailVerified: boolean;
    verificationStatus: "VERIFIED" | "NOT_VERIFIED";
    idVerificationStatus: "NOT_TRIED" | "PENDING" | "ACCEPTED" | "REJECTED";
    totalSurveysCompleted: number;
  };
};

export type UpdateParticipantProfilePayload = {
  fullName?: string;
  username?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  participantGender?: string;
  participantCity?: string;
  participantDistrict?: string;
  participantEducationLevel?: string;
  participantOccupation?: string;
  participantAddress?: string;
  participantAge?: number;
};

export type UpdateParticipantProfileResponse = {
  message: string;
  profile: ParticipantProfileSettingsResponse["profile"] & {
    updatedAt: string;
  };
};

export type UpdateParticipantProfilePhotoResponse = {
  message: string;
  profile: Pick<
    ParticipantProfileSettingsResponse["profile"],
    "id" | "username" | "fullName" | "email" | "profileImagePath"
  > & {
    updatedAt: string;
  };
};

export type VerifyParticipantNicResponse = {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    nicImagePath: string | null;
    selfiePath: string | null;
    isIdentityVerified: boolean;
    updatedAt: string;
  };
  verification: {
    nicNumberProvided: boolean;
    identityFrontImageUploaded: boolean;
    selfieImageUploaded: boolean;
    queueJobId: string | number;
    queueStatus: string;
  };
};

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message[0];
    }

    return message || "Request failed";
  }

  return "Request failed";
}

export async function getParticipantProfileSettings() {
  try {
    const response = await api.get<ParticipantProfileSettingsResponse>(
      "/participant/profile-settings"
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateParticipantProfileSettings(
  payload: UpdateParticipantProfilePayload
) {
  try {
    const response = await api.patch<UpdateParticipantProfileResponse>(
      "/participant/profile-settings",
      payload
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateParticipantProfilePhoto(profilePhoto: File) {
  try {
    const formData = new FormData();
    formData.append("profilePhoto", profilePhoto);

    const response = await api.patch<UpdateParticipantProfilePhotoResponse>(
      "/participant/settings/profile-photo",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function verifyParticipantNic(
  nicNumber: string,
  identityFrontImage: File,
  selfieImage: File
) {
  try {
    const formData = new FormData();
    formData.append("nicNumber", nicNumber);
    formData.append("identityFrontImage", identityFrontImage);
    formData.append("selfieImage", selfieImage);

    const response = await api.post<VerifyParticipantNicResponse>(
      "/participant/verify-nic",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
