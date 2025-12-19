export interface Reviewer {
  id: number;
  fullName: string;
  profileImage?: string | null;
}
interface MatchRequest {
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
  isActive:boolean;
   matchRequests?: MatchRequest[];
}
