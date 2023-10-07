import React, { useState, useEffect } from "react";
import { createContext } from "react";

import {
  useForegroundPermissions as usePermissions,
  LocationPermissionResponse as PermissionResponse,
  PermissionStatus,
  getLastKnownPositionAsync,
  Accuracy,
  LocationLastKnownOptions,
} from "expo-location";

type LocationContextProps = {
  getGPSLocation: () => Promise<
    | {
        latitude: number;
        longitude: number;
      }
    | null
    | undefined
  >;
  permission: PermissionResponse | null;
};

export const LocationContext = createContext<LocationContextProps>({
  getGPSLocation: () => Promise.resolve(null),
  permission: null,
});

type LocationProviderProps = {
  children: React.ReactNode;
};

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [permission, requestPermission] = usePermissions();

  useEffect(() => {
    if (permission?.status !== PermissionStatus.GRANTED) {
      requestPermission();
    }
  }, [permission]);

  const getGPSLocation = async () => {
    try {
      const { status } = await requestPermission();
      if (status === PermissionStatus.GRANTED) {
        const location = await getLastKnownPositionAsync({
          accuracy: Accuracy.Highest,
        } as LocationLastKnownOptions);
        return location?.coords
          ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }
          : null;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        getGPSLocation: getGPSLocation,
        permission,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
