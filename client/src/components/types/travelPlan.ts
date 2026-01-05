export interface Reviewer {
  id: number;
  fullName: string;
  profileImage?: string | null;
}
export interface MatchRequest {
  id: number;
  message?: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  sender: {
    id: number;
    fullName: string;
    profileImage?: string;
  };
}
export interface Review {
  id: number;
  rating: number;
  comment?: string | null;
  reviewer: Reviewer;
}
export interface ItineraryItem {
  day: number;
  title: string;
  description?: string;
}

interface User {
  id: number;
  fullName: string;
  profileImage: string | null;
}

export interface TravelPlan {
  id: number;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  minBudget?: number;
  maxBudget?: number;
  travelType: string;
  description?: string;
  image?: string | null;
  reviews?: Review[];
  user?: User | null;
  isActive: boolean;
  matchRequests?: MatchRequest[];
  itinerary: ItineraryItem[];
  createdAt: string;
  updatedAt: string;
}
