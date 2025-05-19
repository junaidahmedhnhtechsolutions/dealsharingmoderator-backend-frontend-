import React, { useRef, useState, useCallback } from "react";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import Input from "../../components/form/input/InputField";

const defaultPosition = { lat: 25.276987, lng: 55.296249 };

const Map = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDOvpM2gM3ZoFXJ4H1nKELhnS781ZGk1BU",
    libraries: ["places"],
  });

  const [position, setPosition] = useState(defaultPosition);
  const [address, setAddress] = useState("");
  const [place, setPlace] = useState<any>(null);

  console.log({ address });

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
            const lat = selectedPlace.geometry.location.lat();
            const lng = selectedPlace.geometry.location.lng();
            console.log(selectedPlace, "selectedPlace--");
            setPosition({ lat, lng });
            setPlace(selectedPlace);
            setAddress(selectedPlace.formatted_address || "");
          }
        });
      }
    },
    [isLoaded]
  );

  const onMarkerDragEnd = (
    e:
      | {
          latLng: { lat: () => any; lng: () => any };
        }
      | any
  ) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setPosition({ lat, lng });

    if (geocoderRef.current) {
      geocoderRef.current.geocode(
        { location: { lat, lng } },
        (
          results: { formatted_address: React.SetStateAction<string> }[],
          status: string
        ) => {
          if (status === "OK" && results[0]) {
            setPlace(results[0]);
            setAddress(results[0].formatted_address);
          }
        }
      );
    }
  };

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div>
      <div className="position-relative">
        <Input
          ref={onLoadAutocomplete}
          className="form-control ps-4 pe-5 text-white"
          placeholder="Search address or area name"
          defaultValue={place?.formatted_address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "300px" }}
        center={position}
        zoom={18}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <MarkerF position={position} draggable onDragEnd={onMarkerDragEnd} />
        <div className="absolute top-0 w-full">
          <p className="text-center">Google Map</p>
        </div>
      </GoogleMap>
    </div>
  );
};

export default Map;
