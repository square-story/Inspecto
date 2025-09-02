import { Input } from "@/components/ui/input";
import { Field, FIELD_TYPES, InspectionFieldsManagerProps } from "../types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export const InspectionFieldsManager = ({ fields, onChange }: InspectionFieldsManagerProps) => {
    const safeFields = fields ?? []

    const handleFieldChange = (index: number, field: keyof Field, value: unknown) => {
        const newFields = [...safeFields]
        newFields[index] = { ...newFields[index], [field]: value }
        onChange(newFields)
    }

    const addField = () => {
        onChange([
            ...safeFields,
            { label: "", type: "text", required: false, name: "", options: [] },
        ])
    }

    const removeField = (index: number) => {
        const updated = safeFields.filter((_, i) => i !== index)
        onChange(updated)
    }

    return (
        <div className="space-y-4">
            {safeFields.map((field, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-center border p-2 rounded-md">
                    <label className="font-medium">{field.label}</label>
                    <Input
                        placeholder="Label"
                        value={field.label}
                        onChange={(e) => handleFieldChange(index, "label", e.target.value)}
                    />
                    <Select
                        value={field.type}
                        onValueChange={(val) => handleFieldChange(index, "type", val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {FIELD_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        placeholder="Name"
                        value={field.name}
                        onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                    />
                    <Switch
                        checked={field.required}
                        onCheckedChange={(checked) => handleFieldChange(index, "required", checked)}
                    />
                    <Input
                        placeholder="Options (comma separated)"
                        value={field.options?.join(", ")}
                        onChange={(e) =>
                            handleFieldChange(
                                index,
                                "options",
                                e.target.value.split(",").map((opt) => opt.trim())
                            )
                        }
                    />
                    <Button variant="destructive" size="icon" onClick={() => removeField(index)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button variant="outline" onClick={addField}>
                Add Field
            </Button>
        </div>
    )
}



