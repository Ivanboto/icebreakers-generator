import { api } from "./api";

export interface GenerateIcebreakersRequest {
  senderUrl: string;
  problemDescription: string;
  solutionDescription: string;
  recipientUrl: string;
}

export interface GenerateIcebreakersResponse {
  icebreakers: string[];
  metadata: {
    senderUrl: string;
    recipientUrl: string;
    timestamp: string;
  };
}

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
