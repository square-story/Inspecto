import { useState, useEffect } from "react";
import axios from "axios";
import {
  Command,
  CommandGroup,
  CommandList,
  CommandInput,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddressAutocompleteProps {
  setValue: (name: string, value: string) => void;
  closeDialog: () => void;
}

const API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY as string;

const AddressAutocomplete = ({
  setValue,
  closeDialog,
}: AddressAutocompleteProps) => {
  const [search, setSearch] = useState("");
  const [filteredAddresses, setFilteredAddresses] = useState<
    { id: string; text: string; lat: number; lng: number }[]
  >([]);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 500);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFilteredAddresses([]);
      return;
    }

    const fetchAddresses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json`,
          {
            params: {
              q: debouncedSearch,
              key: API_KEY,
              limit: 5,
              language: "en",
            },
          }
        );

        const results = response.data.results.map(
          (
            place: {
              formatted: string;
              geometry: { lat: number; lng: number };
            },
            index: number
          ) => ({
            id: index.toString(),
            text: place.formatted,
            lat: place.geometry.lat.toString(),
            lng: place.geometry.lng.toString(),
          })
        );

        setFilteredAddresses(results);
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setFilteredAddresses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [debouncedSearch]);

  const fetchLocationFromCoordinates = () => {
    if (!navigator.geolocation) {
      toast("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json`,
            {
              params: {
                q: `${latitude},${longitude}`,
                key: API_KEY,
                language: "en",
              },
            }
          );

          if (response.data.results.length > 0) {
            const location = response.data.results[0].formatted;
            setValue("location", location);
            setValue("latitude", latitude.toString());
            setValue("longitude", longitude.toString());
            closeDialog();
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast("Unable to retrieve location.");
      }
    );
  };

  return (
    <>
      <Command shouldFilter={false} className="overflow-visible">
        <CommandInput
          placeholder="Search location..."
          value={search}
          onValueChange={setSearch}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="w-full p-3 rounded-lg outline-none"
        />

        {isOpen && (
          <div className="relative h-auto">
            <CommandList>
              <div className="absolute z-50 w-full bg-background border rounded-md shadow-md">
                <CommandGroup>
                  {isLoading ? (
                    <div className="h-28 flex items-center justify-center">
                      <Loader2 className="size-6 animate-spin" />
                    </div>
                  ) : (
                    filteredAddresses.map((address) => (
                      <Button
                        key={address.id}
                        variant="ghost"
                        className="w-full justify-start text-left px-3 py-2 rounded-md hover:bg-accent"
                        onClick={() => {
                          setValue("location", address.text);
                          setValue("latitude", address.lat.toString());
                          setValue("longitude", address.lng.toString());
                          closeDialog();
                        }}
                      >
                        {address.text}
                      </Button>
                    ))
                  )}
                  {!isLoading && filteredAddresses.length === 0 && (
                    <div className="py-4 flex items-center justify-center">
                      {search === ""
                        ? "Please enter an address"
                        : "No address found"}
                    </div>
                  )}
                </CommandGroup>
              </div>
            </CommandList>
          </div>
        )}
      </Command>

      <Button
        variant="outline"
        onClick={fetchLocationFromCoordinates}
        className="w-full"
      >
        Use Current Location
      </Button>

      <Button variant="outline" onClick={closeDialog} className="w-full">
        Close
      </Button>
    </>
  );
};

export default AddressAutocomplete;
