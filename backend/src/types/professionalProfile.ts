export interface ProfessionalProfile {
  fullName: string;
  firstName?: string;
  lastName?: string;
  headline?: string;
  summary?: string;
  location?: string;
  profileUrl: string;

  currentPosition?: {
    title: string;
    company: string;
    industry?: string;
  };

  skills?: string[];

  certifications?: Array<{
    name: string;
    authority: string;
    issueYear?: number;
    issueMonth?: number;
  }>;

  posts?: Array<{
    text: string;
    postUrl: string;
    postedDate: string;
    likeCount: number;
  }>;
}
