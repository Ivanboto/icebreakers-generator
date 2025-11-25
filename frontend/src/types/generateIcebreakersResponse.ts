export interface GenerateIcebreakersResponse {
  icebreakers: string[];
  metadata: {
    senderUrl: string;
    recipientUrl: string;
    timestamp: string;
  };
}
