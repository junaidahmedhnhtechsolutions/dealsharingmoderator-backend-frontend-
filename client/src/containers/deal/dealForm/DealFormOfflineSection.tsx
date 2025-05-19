import { ErrorMessage } from "formik";
import Label from "../../../components/form/Label";
import LocationInput from "../../googleMap/LocationInput";
import { LocationType } from "../../../helper/types";
import { toast } from "react-toastify";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { GoTrash } from "react-icons/go";

type PropsType = {
  locations?: LocationType[];
  setFieldValue: (field: string, value: any) => void;
};

const DealFormOfflineSection = ({
  locations = [],
  setFieldValue,
}: PropsType) => {
  // Handle location selection: Adds new location if it doesn't already exist
  const handleSelectLocation = (location: LocationType) => {
    const isDuplicate = locations.some(
      (item) => item.address === location.address
    );

    if (isDuplicate) {
      toast.info("Location already added");
    } else {
      // const newLocations = [...locations, location];
      // console.log(locations.push(location), "New location added --->");
      setFieldValue("locations", [...locations, location]);
    }
  };

  // Handle location removal: Removes a location based on index
  const handleRemoveLocation = (index: number) => {
    const newLocations = [...locations];
    newLocations.splice(index, 1);
    setFieldValue("locations", newLocations);
  };

  return (
    <div>
      <div>
        <Label>Locations</Label>
        <LocationInput onSelect={handleSelectLocation} />
        <ErrorMessage
          name="locations"
          component="div"
          className="text-red-500 text-xs mt-1"
        />
      </div>

      <div className="space-y-2 mt-4">
        {locations.map((location, index) => (
          <div key={index} className="relative w-full">
            <Input readOnly value={location?.address ?? "-"} />
            <div className="absolute top-0 right-1 h-full w-fit flex items-center justify-center">
              <Button
                size="sm"
                variant="outline"
                className="!rounded-full w-8 h-8 flex items-center justify-center !p-1"
                onClick={() => handleRemoveLocation(index)}
              >
                <GoTrash />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealFormOfflineSection;
