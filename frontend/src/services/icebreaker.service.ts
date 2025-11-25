import { api } from "./api";
import type { GenerateIcebreakersRequest } from "../types/generateIcebreakersRequest";
import type { GenerateIcebreakersResponse } from "../types/generateIcebreakersResponse";

export const generateIcebreakers = async (
  data: GenerateIcebreakersRequest
): Promise<GenerateIcebreakersResponse> => {
  const response = await api.post<GenerateIcebreakersResponse>(
    "/icebreakers/generate",
    data
  );
  return response.data;
};

export default {
  generateIcebreakers,
};
