import AddressAutocomplete from "@/app/UserDashboard/InspectionManagement/components/AddressAutocomplete";
import ContentSection from "@/components/content-section";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { setInspector } from "@/features/inspector/inspectorSlice";
import { useInspectorDetails } from "@/hooks/useInspectorDetails";
import { inspectorService } from "@/services/inspector.service";
import { AppDispatch } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  location: z.string().min(3, "Address Must Be atleast 3 Characters"),
  longitude: z.string().min(1, "Longitude is required"),
  latitude: z.string().min(1, "Latitude is required"),
});

const AddressManagment = () => {
  const { inspector, loading } = useInspectorDetails();
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: inspector?.address || '',
      longitude: inspector?.location?.coordinates?.[0]?.toString() || '',
      latitude: inspector?.location?.coordinates?.[1]?.toString() || '',
    },
  });
  const locationValue = form.watch("location");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = {
        address: values.location,
        location: {
          type: "Point",
          coordinates: [
            parseFloat(values.longitude as string),
            parseFloat(values.latitude as string)
          ]
        }
      }
      const updatedInspector = await inspectorService.updateInspector(data);
      dispatch(setInspector(updatedInspector.data.inspector));
      toast.success('Location updated successfully!');
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };
  if (loading) return (<LoadingSpinner />)
  return (
    <ContentSection
      title="Address Managment"
      desc="Update Your Address in here"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <FormField
              control={form.control}
              name="location"
              render={({ fieldState: { error } }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Dialog
                      open={isLocationDialogOpen}
                      onOpenChange={setIsLocationDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {locationValue || "Select a location"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogTitle>Change Location</DialogTitle>
                        <DialogDescription>
                          Enter your address for the vehicle inspection
                        </DialogDescription>
                        <AddressAutocomplete
                          setValue={
                            form.setValue as (
                              name: string,
                              value: unknown
                            ) => void
                          }
                          closeDialog={() => setIsLocationDialogOpen(false)}
                        />
                      </DialogContent>
                    </Dialog>
                  </FormControl>
                  {error && <FormMessage>{error.message}</FormMessage>}
                </FormItem>
              )}
            />
            <input type="hidden" {...form.control.register("latitude")} />
            <input type="hidden" {...form.control.register("longitude")} />
          </div>
          <Button type="submit">Update Location</Button>
        </form>
      </Form>
    </ContentSection>
  );
};

export default AddressManagment;
