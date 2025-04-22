import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";

export interface DayAvailability {
    enabled: boolean;
    slots: number;
    timeSlots: TimeSlot[];
}

export interface TimeSlot {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}

export type WeeklyAvailability = {
    [key in "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"]: DayAvailability;
};

interface AvailabilityPickerProps {
    value: WeeklyAvailability;
    onChange: (newValue: WeeklyAvailability) => void;
}

export default function AvailabilityPicker({ value, onChange }: AvailabilityPickerProps) {
    const [availability, setAvailability] = useState<WeeklyAvailability>(value);

    useEffect(() => {
        setAvailability(value);
    }, [value]);

    const updateAvailability = (newAvailability: WeeklyAvailability) => {
        setAvailability(newAvailability);
        onChange(newAvailability);
    };

    const updateDayAvailability = (
        day: keyof WeeklyAvailability,
        field: keyof DayAvailability,
        newValue: boolean | number | TimeSlot[]
    ) => {
        const updatedDay = { ...availability[day], [field]: newValue };

        // If day is disabled, mark all time slots as unavailable
        if (field === 'enabled' && !newValue) {
            updatedDay.timeSlots = updatedDay.timeSlots.map(slot => ({
                ...slot,
                isAvailable: false
            }));
        }

        // If day is enabled, update the slots count and ensure we have the right number of time slots
        if (field === 'slots' && typeof newValue === 'number') {
            const currentSlots = updatedDay.timeSlots.length;

            if (newValue > currentSlots) {
                // Add more time slots
                const lastSlot = updatedDay.timeSlots[currentSlots - 1] || {
                    startTime: "09:00",
                    endTime: "10:00",
                    isAvailable: true
                };

                for (let i = currentSlots; i < newValue; i++) {
                    const startHour = parseInt(lastSlot.endTime.split(':')[0]);
                    const startTime = `${startHour.toString().padStart(2, '0')}:00`;
                    const endTime = `${(startHour + 1).toString().padStart(2, '0')}:00`;

                    updatedDay.timeSlots.push({
                        startTime,
                        endTime,
                        isAvailable: true
                    });
                }
            } else if (newValue < currentSlots) {
                // Remove excess time slots
                updatedDay.timeSlots = updatedDay.timeSlots.slice(0, newValue);
            }
        }

        const newAvailability = {
            ...availability,
            [day]: updatedDay,
        };
        updateAvailability(newAvailability);
    };


    const updateTimeSlot = (
        day: keyof WeeklyAvailability,
        index: number,
        field: keyof TimeSlot,
        value: string | boolean
    ) => {
        const updatedTimeSlots = [...availability[day].timeSlots];
        updatedTimeSlots[index] = {
            ...updatedTimeSlots[index],
            [field]: value
        };

        updateDayAvailability(day, 'timeSlots', updatedTimeSlots);
    };

    const addTimeSlot = (day: keyof WeeklyAvailability) => {
        const timeSlots = [...availability[day].timeSlots];
        const lastSlot = timeSlots[timeSlots.length - 1];

        let startTime = "09:00";
        let endTime = "10:00";

        if (lastSlot) {
            const lastEndHour = parseInt(lastSlot.endTime.split(':')[0]);
            startTime = lastSlot.endTime;
            endTime = `${(lastEndHour + 1).toString().padStart(2, '0')}:00`;
        }

        timeSlots.push({
            startTime,
            endTime,
            isAvailable: true
        });

        updateDayAvailability(day, 'timeSlots', timeSlots);
        updateDayAvailability(day, 'slots', timeSlots.length);
    };

    const removeTimeSlot = (day: keyof WeeklyAvailability, index: number) => {
        const timeSlots = [...availability[day].timeSlots];
        timeSlots.splice(index, 1);

        updateDayAvailability(day, 'timeSlots', timeSlots);
        updateDayAvailability(day, 'slots', timeSlots.length);
    };

    return (
        <div className="space-y-6">
          {Object.entries(availability).map(([day, dayData]) => (
            <Card key={day} className="overflow-hidden">
              <div className="p-4 bg-muted/20 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Switch
                    checked={dayData.enabled}
                    onCheckedChange={(checked) =>
                      updateDayAvailability(day as keyof WeeklyAvailability, "enabled", checked)
                    }
                    className="data-[state=checked]:bg-primary"
                  />
                  <Label className="text-lg font-medium">{day}</Label>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => addTimeSlot(day as keyof WeeklyAvailability)}
                  disabled={!dayData.enabled}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Time Slot
                </Button>
              </div>
              
              <CardContent className="p-4">
                {dayData.timeSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-2">No time slots configured</p>
                ) : (
                  <div className="space-y-3">
                    {dayData.timeSlots.map((slot, index) => (
                      <div key={index} className="flex items-center space-x-4 p-2 rounded-md bg-muted/10">
                        <Switch
                          checked={slot.isAvailable}
                          onCheckedChange={(checked) =>
                            updateTimeSlot(
                              day as keyof WeeklyAvailability,
                              index,
                              "isAvailable",
                              checked
                            )
                          }
                          disabled={!dayData.enabled}
                          className="data-[state=checked]:bg-green-500"
                        />
                        
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">Start Time</Label>
                            <Input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) =>
                                updateTimeSlot(
                                  day as keyof WeeklyAvailability,
                                  index,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              disabled={!dayData.enabled || !slot.isAvailable}
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs text-muted-foreground">End Time</Label>
                            <Input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) =>
                                updateTimeSlot(
                                  day as keyof WeeklyAvailability,
                                  index,
                                  "endTime",
                                  e.target.value
                                )
                              }
                              disabled={!dayData.enabled || !slot.isAvailable}
                              className="mt-1"
                            />
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTimeSlot(day as keyof WeeklyAvailability, index)}
                          disabled={!dayData.enabled}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      );
}