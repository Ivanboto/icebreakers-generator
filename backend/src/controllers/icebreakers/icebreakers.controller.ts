import { Request, Response } from "express";
import profileDataService from "../../services/profileData.service";
import { asyncHandler, createHttpError } from "../../utils";

export const generateIcebreakers = asyncHandler(
  async (req: Request, res: Response) => {
    const { senderUrl, problemDescription, solutionDescription, recipientUrl } =
      req.body;

    if (
      !senderUrl ||
      !problemDescription ||
      !solutionDescription ||
      !recipientUrl
    ) {
      throw createHttpError(
        "Missing required fields: senderUrl, problemDescription, solutionDescription, recipientUrl",
        400
      );
    }

    const [senderProfile, recipientProfile] =
      await profileDataService.getMultipleProfiles([senderUrl, recipientUrl]);

    if (!senderProfile || !recipientProfile) {
      throw createHttpError(
        `Failed to fetch profile data. Sender: ${!!senderProfile}, Recipient: ${!!recipientProfile}`,
        500
      );
    }

    // Response temporal
    const response = {
      icebreakers: [
        "Icebreaker 1 - En desarrollo...",
        "Icebreaker 2 - En desarrollo...",
        "Icebreaker 3 - En desarrollo...",
      ],
      metadata: {
        senderUrl,
        recipientUrl,
        timestamp: new Date().toISOString(),
      },
    };

    return res.status(200).json(response);
  }
);

export default { generateIcebreakers };
