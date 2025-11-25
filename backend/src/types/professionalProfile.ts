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

  experience?: Array<{
    title: string;
    company: string;
    industry?: string;
    description?: string;
  }>;

  education?: Array<{
    institution: string;
    degree?: string;
    field?: string;
  }>;

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
  }>;

  languages?: string[];
}
