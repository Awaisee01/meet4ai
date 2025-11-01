export interface TimeSlot {
  date: string;
  times: string[];
}

export interface Person {
  name: string;
  email: string;
  zipCode: string;
  availability: TimeSlot[];
}

export interface MeetingRequest {
  people: Person[];
}

export interface MeetingSuggestion {
  date: string;
  time: string;
  zipCode: string;
}

export interface AIResponse {
  suggestions: MeetingSuggestion[];
  summary?: string;
}
