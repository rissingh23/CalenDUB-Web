export const EVENT_TYPES = {
  'Club Meeting': '#d39d9d',
  'Workshop': '#d3b49d',
  'Social Event': '#d2d39d',
  'Sports Match': '#9db4d3',
  'UW Event': '#ad9dd3',
  'Personal Event': '#9d9dd3'
} as const;

export type EventType = keyof typeof EVENT_TYPES;

export const getEventTypeColor = (eventType: string): string => {
  return EVENT_TYPES[eventType as EventType] || EVENT_TYPES['UW Event'];
};

export const getEventTypesList = (): string[] => {
  return Object.keys(EVENT_TYPES);
}; 