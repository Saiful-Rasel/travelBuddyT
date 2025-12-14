// types/User.ts
export type UserRole = "ADMIN" | "USER" | null;

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  profileImage?: string | null;
  bio?: string | null;
  travelInterests?: string[];
  visitedCountries?: string[];
  currentLocation?: string | null;
  premium?: boolean;
}


