import api from "@/lib/axios";
import axios from "axios";

export type LocationOption = {
  id: string;
  name: string;
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

function normalizeLocationOption(
  item: unknown,
  nameKeys: string[],
  idKeys: string[],
): LocationOption | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Record<string, unknown>;
  const id = idKeys.find((key) => typeof record[key] === "string");
  const name = nameKeys.find((key) => typeof record[key] === "string");

  if (!id || !name) {
    return null;
  }

  return {
    id: record[id] as string,
    name: record[name] as string,
  };
}

function normalizeLocationList(
  payload: unknown,
  nameKeys: string[],
  idKeys: string[],
  listKeys: string[],
) {
  const list = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object"
      ? (() => {
          const record = payload as Record<string, unknown>;

          for (const key of listKeys) {
            if (Array.isArray(record[key])) {
              return record[key] as unknown[];
            }
          }

          if (Array.isArray(record.data)) {
            return record.data as unknown[];
          }

          if (Array.isArray(record.items)) {
            return record.items as unknown[];
          }

          return [];
        })()
      : [];

  return list
    .map((item) => normalizeLocationOption(item, nameKeys, idKeys))
    .filter((item): item is LocationOption => Boolean(item));
}

export async function getProvinces() {
  try {
    const response = await api.get("/locations/provinces");

    return normalizeLocationList(
      response.data,
      ["name", "province", "provinceName"],
      ["id", "provinceId"],
      ["provinces"],
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getDistricts(provinceId: string) {
  try {
    const response = await api.get("/locations/districts", {
      params: {
        provinceId,
      },
    });

    return normalizeLocationList(
      response.data,
      ["name", "district", "districtName"],
      ["id", "districtId"],
      ["districts"],
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getCities(districtId: string) {
  try {
    const response = await api.get("/locations/cities", {
      params: {
        districtId,
      },
    });

    return normalizeLocationList(
      response.data,
      ["name", "city", "cityName"],
      ["id", "cityId"],
      ["cities"],
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}
