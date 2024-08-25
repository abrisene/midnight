export interface CalendarSchedule {
  id: string;
  type: "calendar";
  name: string;
  startTime: string;
  endTime?: string;
  children: Schedule[];
}

export interface VectorSchedule {
  id: string;
  type: "vector";
  name: string;
  triggerEvent?: string;
  offset?: number;
  duration: number;
  children: Schedule[];
}

export type Schedule = CalendarSchedule | VectorSchedule;
