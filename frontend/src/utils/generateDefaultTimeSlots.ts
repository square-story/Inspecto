export const generateDefaultTimeSlots = (count: number, startHour = 9) => {
    return Array.from({ length: count }, (_, index) => {
        const start = startHour + index;
        return {
            startTime: `${start.toString().padStart(2, '0')}:00`,
            endTime: `${(start + 1).toString().padStart(2, '0')}:00`,
            isAvailable: true
        };
    });
}