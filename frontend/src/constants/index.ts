export const SITE_OPTIONS = [
  { label: "LinkedIn", value: "linkedin" },
  { label: "Indeed", value: "indeed" },
] as const;

export const CITY_OPTIONS_BY_COUNTRY: Record<string, string[]> = {
  India: ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad"],
  USA: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia"],
  Japan: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya", "Sapporo"],
};

export const COUNTRIES = Object.keys(CITY_OPTIONS_BY_COUNTRY);

export const JOB_TYPES = [
  { label: "Internship", value: "internship" },
  { label: "Full-Time", value: "fulltime" },
  { label: "Part-Time", value: "parttime" },
  { label: "Contract", value: "contract" },
] as const;
