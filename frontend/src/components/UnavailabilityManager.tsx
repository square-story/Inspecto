import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";

export interface UnavailabilityPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  reason: string;
}

interface UnavailabilityManagerProps {
  periods: UnavailabilityPeriod[];
  onChange: (periods: UnavailabilityPeriod[]) => void;
}

export default function UnavailabilityManager({ periods, onChange }: UnavailabilityManagerProps) {
  const [newPeriod, setNewPeriod] = useState<Omit<UnavailabilityPeriod, 'id'>>({
    startDate: new Date(),
    endDate: new Date(),
    reason: ""
  });

  const handleAddPeriod = () => {
    if (new Date(newPeriod.startDate) > new Date(newPeriod.endDate)) {
      alert("End date must be after start date");
      return;
    }

    const updatedPeriods = [
      ...periods,
      {
        ...newPeriod,
        id: crypto.randomUUID()
      }
    ];
    
    onChange(updatedPeriods);
    
    // Reset form
    setNewPeriod({
      startDate: new Date(),
      endDate: new Date(),
      reason: ""
    });
  };

  const handleRemovePeriod = (id: string) => {
    const updatedPeriods = periods.filter(period => period.id !== id);
    onChange(updatedPeriods);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Unavailability Periods</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={format(new Date(newPeriod.startDate), "yyyy-MM-dd")}
              onChange={(e) => 
                setNewPeriod({
                  ...newPeriod,
                  startDate: new Date(e.target.value)
                })
              }
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={format(new Date(newPeriod.endDate), "yyyy-MM-dd")}
              onChange={(e) => 
                setNewPeriod({
                  ...newPeriod,
                  endDate: new Date(e.target.value)
                })
              }
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={newPeriod.reason}
              onChange={(e) => 
                setNewPeriod({
                  ...newPeriod,
                  reason: e.target.value
                })
              }
              className="mt-1 h-[38px] min-h-[38px]"
              placeholder="Vacation, sick leave, etc."
            />
          </div>
        </div>
        
        <Button onClick={handleAddPeriod} className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Add Unavailability Period
        </Button>
        
        {periods.length > 0 ? (
          <div className="space-y-3 mt-6">
            <h3 className="text-sm font-medium">Current Unavailability Periods</h3>
            
            {periods.map((period) => (
              <div 
                key={period.id} 
                className="flex items-center justify-between p-3 rounded-md bg-muted/20"
              >
                <div>
                  <p className="font-medium">
                    {format(new Date(period.startDate), "MMM dd, yyyy")} - {format(new Date(period.endDate), "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">{period.reason}</p>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemovePeriod(period.id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-2">
            No unavailability periods configured
          </p>
        )}
      </CardContent>
    </Card>
  );
}