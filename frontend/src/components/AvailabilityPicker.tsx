import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface DayAvailability {
    enabled: boolean;
    slots: number;
}

export type WeeklyAvailability = {
    [key in "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"]: DayAvailability;
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
        newValue: boolean | number
    ) => {
        const updatedDay = { ...availability[day], [field]: newValue };

        // If day is disabled, set slots to 0
        if (field === 'enabled' && !newValue) {
            updatedDay.slots = 0;
        }

        const newAvailability = {
            ...availability,
            [day]: updatedDay,
        };
        updateAvailability(newAvailability);
    };

    return (
        <div className="space-y-4">
            {Object.entries(availability).map(([day, { enabled, slots }]) => (
                <div key={day} className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200">
                    <Switch
                        checked={enabled}
                        onCheckedChange={(checked) =>
                            updateDayAvailability(day as keyof WeeklyAvailability, "enabled", checked)
                        }
                        className="data-[state=checked]:bg-primary"
                    />

                    <div className="flex-1 flex items-center justify-between">
                        <Label className="text-sm font-medium">{day}</Label>

                        <div className="flex items-center space-x-2">
                            <Label htmlFor={`${day}-slots`} className="text-sm text-gray-500">
                                Available Slots:
                            </Label>
                            <Input
                                id={`${day}-slots`}
                                type="number"
                                min="0"
                                max="10"
                                value={slots}
                                onChange={(e) =>
                                    updateDayAvailability(
                                        day as keyof WeeklyAvailability,
                                        "slots",
                                        Number(e.target.value) || 0
                                    )
                                }
                                disabled={!enabled}
                                className="w-20"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}