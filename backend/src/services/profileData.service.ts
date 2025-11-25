import { ProfessionalProfile } from "../types/professionalProfile";
import { createHttpError } from "../utils";

const API_CONFIG = {
  apiKey: process.env.RAPIDAPI_API_KEY,
  apiHost: "real-time-people-company-data.p.rapidapi.com",
  get baseUrl() {
    return `https://${this.apiHost}`;
  },
};

const extractUsernameFromUrl = (url: string): string => {
  const match = url.match(/\/in\/([^\/]+)/);
  if (!match || !match[1]) {
    throw createHttpError("Invalid profile URL format", 400);
  }
  return match[1];
};

const transformToGenericProfile = (
  apiResponse: any,
  originalUrl: string
): ProfessionalProfile => {
  const data = apiResponse.data || apiResponse;

  const firstPosition = data.position?.[0];
  let currentPosition:
    | {
        title: string;
        company: string;
        industry?: string;
      }
    | undefined = undefined;

  if (firstPosition) {
    currentPosition = {
      title: firstPosition.title || "",
      company: firstPosition.companyName || "",
    };
    if (firstPosition.companyIndustry) {
      currentPosition.industry = firstPosition.companyIndustry;
    }
  }

  const skills =
    data.skills?.slice(0, 12).map((skill: any) => skill.name || skill) || [];

  const certifications =
    data.certifications?.slice(0, 5).map((cert: any) => {
      const c: any = {
        name: cert.name || "",
        authority: cert.authority || "",
      };
      if (cert.start?.year) c.issueYear = cert.start.year;
      if (cert.start?.month) c.issueMonth = cert.start.month;
      return c;
    }) || [];

  const posts =
    apiResponse.posts?.slice(0, 3).map((post: any) => ({
      text: post.text || "",
      postUrl: post.postUrl || "",
      postedDate: post.postedDate || "",
      likeCount: post.likeCount || 0,
    })) || [];

  const profile: ProfessionalProfile = {
    fullName:
      `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Unknown",
    profileUrl: originalUrl,
  };

  if (data.firstName) profile.firstName = data.firstName;
  if (data.lastName) profile.lastName = data.lastName;
  if (data.headline) profile.headline = data.headline;
  if (data.summary) profile.summary = data.summary;
  if (data.geo?.full || data.geo?.city) {
    profile.location = data.geo.full || data.geo.city;
  }
  if (currentPosition) profile.currentPosition = currentPosition;
  if (skills.length > 0) profile.skills = skills;
  if (certifications.length > 0) profile.certifications = certifications;
  if (posts.length > 0) profile.posts = posts;

  return profile;
};

const getProfileData = async (
  profileUrl: string
): Promise<ProfessionalProfile> => {
  if (!API_CONFIG.apiKey) {
    throw createHttpError(
      "RAPIDAPI_API_KEY environment variable is not set",
      500
    );
  }

  try {
    const username = extractUsernameFromUrl(profileUrl);

    const url = new URL(
      `${API_CONFIG.baseUrl}/profile-data-connection-count-posts`
    );
    url.searchParams.append("username", username);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "x-rapidapi-key": API_CONFIG.apiKey,
        "x-rapidapi-host": API_CONFIG.apiHost,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw createHttpError(
        `API request failed with status ${response.status}: ${errorText}`,
        500
      );
    }

    const apiResponse = await response.json();

    return transformToGenericProfile(apiResponse, profileUrl);
  } catch (error) {
    throw createHttpError("Failed to fetch profile data", 500);
  }
};

export const getMultipleProfiles = async (
  profileUrls: string[]
): Promise<ProfessionalProfile[]> => {
  const promises = profileUrls.map((url) => getProfileData(url));
  return Promise.all(promises);
};

export default {
  getMultipleProfiles,
};
