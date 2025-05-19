import { useRef, useState, useCallback } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import Input from "../../components/form/input/InputField";
import { LocationType } from "../../helper/types";

type PropsType = {
  onSelect?: (obj: LocationType) => void;
};

const LocationInput = (props: PropsType) => {
  const { onSelect } = props;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDOvpM2gM3ZoFXJ4H1nKELhnS781ZGk1BU",
    libraries: ["places"],
  });

  const [address, setAddress] = useState("");
  const [place, setPlace] = useState<any>(null);

  const autoCompleteRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  const onLoadAutocomplete = useCallback(
    (input: HTMLInputElement | null) => {
      if (input && isLoaded) {
        autoCompleteRef.current = new window.google.maps.places.Autocomplete(
          input,
          {
            componentRestrictions: { country: "AE" },
          }
        );
        geocoderRef.current = new window.google.maps.Geocoder();
        inputRef.current = input;

        autoCompleteRef.current.addListener("place_changed", () => {
          const selectedPlace = autoCompleteRef.current.getPlace();
          if (selectedPlace?.geometry?.location) {
            console.log({ selectedPlace });

            const lat = selectedPlace.geometry.location.lat();
            const lng = selectedPlace.geometry.location.lng();

            setAddress(selectedPlace.formatted_address || "");
            setPlace(selectedPlace);

            onSelect?.({
              lat,
              lng,
              address: selectedPlace.formatted_address || "",
            });
          }
        });
      }
    },
    [isLoaded]
  );

  if (!isLoaded) return <div>Loading Map...</div>;

  console.log({ address });

  return (
    <>
      <Input
        type="search"
        ref={onLoadAutocomplete}
        className="form-control ps-4 pe-5 text-white"
        placeholder="Search address or area name"
        defaultValue={place?.formatted_address}
        onChange={(e) => setAddress(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
      />
    </>
  );
};

export default LocationInput;
