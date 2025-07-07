export type Event = {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
  location: string;
  description: string;
  // Additional properties from backend
  organizer?: string;
  startDate?: string;
  endDate?: string;
  allDay?: boolean;
  isInPerson?: boolean;
  isVirtual?: boolean;
  isHybrid?: boolean;
  isRSVPRequired?: boolean;
  files?: string[];
};
