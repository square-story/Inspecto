import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

// Define the specialization options
export const SPECIALIZATIONS = [
    { value: "mechanical", label: "Mechanical Systems" },
    { value: "electrical", label: "Electrical Systems" },
    { value: "bodywork", label: "Body & Frame Inspection" },
    { value: "emissions", label: "Emissions Testing" },
    { value: "brakes", label: "Brake Systems" },
    { value: "suspension", label: "Suspension & Steering" },
    { value: "safety", label: "Safety & Compliance" },
    { value: "diagnostics", label: "Computer Diagnostics" },
    { value: "transmission", label: "Transmission Systems" },
    { value: "engine", label: "Engine Performance" },
    { value: "hvac", label: "HVAC Systems" },
    { value: "maintenance", label: "Preventive Maintenance" }
] as const;

type Specialization = typeof SPECIALIZATIONS[number] | { value: string; label: string };

interface MultiSelectProps {
    value: string[];
    onChange: (value: string[]) => void;
}

export function SpecializationSelect({ value, onChange }: MultiSelectProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");

    // Convert string[] to Specialization[]
    const selected = value.map(v =>
        SPECIALIZATIONS.find(s => s.value === v) || { value: v, label: v }
    );

    const handleUnselect = React.useCallback((specialization: Specialization) => {
        onChange(value.filter((v) => v !== specialization.value));
    }, [onChange, value]);

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;
            if (input) {
                if ((e.key === "Delete" || e.key === "Backspace") && inputValue === "") {
                    e.preventDefault();
                    onChange(value.slice(0, -1));
                }
                if (e.key === "Escape") {
                    input.blur();
                }
            }
        },
        [inputValue, onChange, value],
    );

    const selectables = SPECIALIZATIONS.filter(
        (specialization) => !value.includes(specialization.value),
    );

    return (
        <Command
            onKeyDown={handleKeyDown}
            className="overflow-visible bg-transparent"
        >
            <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                <div className="flex flex-wrap gap-1">
                    {selected.map((specialization) => (
                        <Badge key={specialization.value} variant="secondary">
                            {specialization.label}
                            <button
                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleUnselect(specialization);
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={() => handleUnselect(specialization)}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        </Badge>
                    ))}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder="Select specializations..."
                        className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                <CommandList>
                    {open && selectables.length > 0 ? (
                        <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                            <CommandGroup className="h-full overflow-auto">
                                {selectables.map((specialization) => (
                                    <CommandItem
                                        key={specialization.value}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        onSelect={() => {
                                            setInputValue("");
                                            onChange([...value, specialization.value]);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        {specialization.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </div>
                    ) : null}
                </CommandList>
            </div>
        </Command>
    );
}