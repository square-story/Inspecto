export interface TimeSlot {
    start: string;
    end: string;
}

export interface DayAvailability {
    enabled: boolean;
    timeSlots: TimeSlot[];
}

export type WeeklyAvailability = {
    [key in "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"]: DayAvailability;
};