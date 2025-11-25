import { ProfessionalProfile } from "./professionalProfile";

export interface IcebreakerRequest {
  senderProfile: ProfessionalProfile;
  recipientProfile: ProfessionalProfile;
  problemDescription: string;
  solutionDescription: string;
}
