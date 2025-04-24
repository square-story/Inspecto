"use client"

import { useState, useEffect } from "react"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export interface DayAvailability {
  enabled: boolean
  slots: number
  timeSlots: TimeSlot[]
}

export interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
}

export type WeeklyAvailability = {
  [key in "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" ]: DayAvailability
}

interface AvailabilityPickerProps {
  value: WeeklyAvailability
  onChange: (newValue: WeeklyAvailability) => void
}

export default function MinimalAvailabilityPicker({ value, onChange }: AvailabilityPickerProps) {
  const [availability, setAvailability] = useState<WeeklyAvailability>(value)

  useEffect(() => {
    setAvailability(value)
  }, [value])

  const updateAvailability = (newAvailability: WeeklyAvailability) => {
    setAvailability(newAvailability)
    onChange(newAvailability)
  }

  const updateDayAvailability = (
    day: keyof WeeklyAvailability,
    field: keyof DayAvailability,
    newValue: boolean | number | TimeSlot[],
  ) => {
    const updatedDay = { ...availability[day], [field]: newValue }

    if (field === "enabled" && !newValue) {
      updatedDay.timeSlots = updatedDay.timeSlots.map((slot) => ({
        ...slot,
        isAvailable: false,
      }))
    }

    if (field === "slots" && typeof newValue === "number") {
      const currentSlots = updatedDay.timeSlots.length

      if (newValue > currentSlots) {
        const lastSlot = updatedDay.timeSlots[currentSlots - 1] || {
          startTime: "09:00",
          endTime: "10:00",
          isAvailable: true,
        }

        for (let i = currentSlots; i < newValue; i++) {
          const startHour = Number.parseInt(lastSlot.endTime.split(":")[0])
          const startTime = `${startHour.toString().padStart(2, "0")}:00`
          const endTime = `${(startHour + 1).toString().padStart(2, "0")}:00`

          updatedDay.timeSlots.push({
            startTime,
            endTime,
            isAvailable: true,
          })
        }
      } else if (newValue < currentSlots) {
        updatedDay.timeSlots = updatedDay.timeSlots.slice(0, newValue)
      }
    }

    const newAvailability = {
      ...availability,
      [day]: updatedDay,
    }
    updateAvailability(newAvailability)
  }

  const updateTimeSlot = (
    day: keyof WeeklyAvailability,
    index: number,
    field: keyof TimeSlot,
    value: string | boolean,
  ) => {
    const updatedTimeSlots = [...availability[day].timeSlots]
    updatedTimeSlots[index] = {
      ...updatedTimeSlots[index],
      [field]: value,
    }

    updateDayAvailability(day, "timeSlots", updatedTimeSlots)
  }

  const addTimeSlot = (day: keyof WeeklyAvailability) => {
    const timeSlots = [...availability[day].timeSlots]
    const lastSlot = timeSlots[timeSlots.length - 1]

    let startTime = "09:00"
    let endTime = "10:00"

    if (lastSlot) {
      const lastEndHour = Number.parseInt(lastSlot.endTime.split(":")[0])
      startTime = lastSlot.endTime
      endTime = `${(lastEndHour + 1).toString().padStart(2, "0")}:00`
    }

    timeSlots.push({
      startTime,
      endTime,
      isAvailable: true,
    })

    updateDayAvailability(day, "timeSlots", timeSlots)
    updateDayAvailability(day, "slots", timeSlots.length)
  }

  const removeTimeSlot = (day: keyof WeeklyAvailability, index: number) => {
    const timeSlots = [...availability[day].timeSlots]
    timeSlots.splice(index, 1)

    updateDayAvailability(day, "timeSlots", timeSlots)
    updateDayAvailability(day, "slots", timeSlots.length)
  }

  // Helper to get active time slots count
  const getActiveSlotCount = (day: keyof WeeklyAvailability) => {
    if (!availability[day].enabled) return 0
    return availability[day].timeSlots.filter((slot) => slot.isAvailable).length
  }

  return (
    <Accordion type="multiple" className="w-full space-y-2">
      {Object.entries(availability).map(([day, dayData]) => (
        <AccordionItem key={day} value={day} className="border rounded-lg overflow-hidden">
          <div className="flex items-center px-4 py-3">
            <Switch
              checked={dayData.enabled}
              onCheckedChange={(checked) => updateDayAvailability(day as keyof WeeklyAvailability, "enabled", checked)}
              className="data-[state=checked]:bg-primary mr-3"
            />
            <AccordionTrigger className="flex-1 hover:no-underline py-0">
              <div className="flex justify-between items-center w-full">
                <span className="font-medium">{day}</span>
                <div className="flex items-center gap-2">
                  {dayData.enabled && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {getActiveSlotCount(day as keyof WeeklyAvailability)} time slot
                      {getActiveSlotCount(day as keyof WeeklyAvailability) !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
          </div>

          <AccordionContent className="px-4 pb-3 pt-1">
            {dayData.timeSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No time slots configured</p>
            ) : (
              <div className="space-y-2 mt-2">
                {dayData.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/10">
                    <Switch
                      checked={slot.isAvailable}
                      onCheckedChange={(checked) =>
                        updateTimeSlot(day as keyof WeeklyAvailability, index, "isAvailable", checked)
                      }
                      disabled={!dayData.enabled}
                      className="data-[state=checked]:bg-green-500"
                    />

                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateTimeSlot(day as keyof WeeklyAvailability, index, "startTime", e.target.value)
                        }
                        disabled={!dayData.enabled || !slot.isAvailable}
                        className="h-8"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={slot.endTime}
                        onChange={(e) =>
                          updateTimeSlot(day as keyof WeeklyAvailability, index, "endTime", e.target.value)
                        }
                        disabled={!dayData.enabled || !slot.isAvailable}
                        className="h-8"
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTimeSlot(day as keyof WeeklyAvailability, index)}
                      disabled={!dayData.enabled}
                      className="h-8 w-8 text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => addTimeSlot(day as keyof WeeklyAvailability)}
              disabled={!dayData.enabled}
              className="mt-3 w-full"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Time Slot
            </Button>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
