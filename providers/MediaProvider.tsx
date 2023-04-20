import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { getAssetListFromAlbum } from "../utils/media-lib";
import { IMAGE_STORAGE_LOCATION } from "../constants/locations";
import {
  Album,
  Asset,
  PermissionStatus,
  addAssetsToAlbumAsync,
  createAlbumAsync,
  getAlbumAsync,
  removeAssetsFromAlbumAsync,
  usePermissions,
} from "expo-media-library";
import { useStore } from "../store";
import { PermissionResponse } from "expo-camera";

type MediaContextProps = {
  album: Album | null | undefined;
  addImagesToAlbum: (imageAssets: Asset[], copy?: boolean) => Promise<Album>;
  deleteImagesFromAlbum: (imageIDs: string[]) => Promise<void>;
  permission: PermissionResponse | null;
};

export const MediaContext = createContext<MediaContextProps>({
  album: null,
  addImagesToAlbum: () => Promise.resolve({} as Album),
  deleteImagesFromAlbum: () => Promise.resolve(),
  permission: null,
});

type MediaProviderProps = {
  children: React.ReactNode;
};

export const MediaProvider = ({ children }: MediaProviderProps) => {
  const options = {
    imageStorageLocation: IMAGE_STORAGE_LOCATION,
    onAlbumUpdate: async (album: Album) => {
      try {
        const imageAssets = await getAssetListFromAlbum(album);

        setImageList(
          imageAssets.assets.map((asset) => ({
            width: asset.width,
            height: asset.height,
            id: asset.id,
            annotations: null,
            path: asset.uri,
            modificationTime: asset.modificationTime,
          }))
        );

        // TODO: Test for IOS
        if (imageAssets.assets.length === 0) {
          const foundAlbum = await getAlbumAsync(options.imageStorageLocation);
          if (!foundAlbum) {
            setAlbum(null);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
  };

  const setImageList = useStore((state) => state.setImageList);

  const [permission, requestPermission] = usePermissions();
  const [album, setAlbum] = useState<Album | null | undefined>(undefined);

  const updateAlbumInfo = async () => {
    const foundAlbum = await getAlbumAsync(options.imageStorageLocation);
    if (foundAlbum) {
      setAlbum(foundAlbum);
    } else {
      setAlbum(null);
    }
  };

  useEffect(() => {
    if (permission?.status !== PermissionStatus.GRANTED) {
      requestPermission();
    } else {
      updateAlbumInfo();
    }
  }, [permission]);

  // * Update image list on initial load and when album changes.
  useEffect(() => {
    if (album && options.onAlbumUpdate) {
      options.onAlbumUpdate(album);
    }
  }, [album]);

  const createAlbum = async (images: Asset[], copy: boolean) => {
    try {
      const [first, ...rest] = images;

      const createdAlbum = await createAlbumAsync(
        options.imageStorageLocation,
        first,
        copy
      );

      if (rest.length !== 0) {
        await addAssetsToAlbumAsync(rest, createdAlbum!.id, copy);
      }

      setAlbum(createdAlbum);

      return createdAlbum;
    } catch (error) {
      console.error(error);
    }

    throw Error("Could not create album.");
  };

  const addImagesToAlbum = async (
    imageAssets: Asset[],
    copy: boolean = true
  ) => {
    if (!album) {
      const createdAlbum = await createAlbum(imageAssets, copy);
      options.onAlbumUpdate && options.onAlbumUpdate(createdAlbum);
      return createdAlbum;
    } else {
      await addAssetsToAlbumAsync(imageAssets, album.id, copy);
      options.onAlbumUpdate && options.onAlbumUpdate(album);
      return album;
    }
  };

  const deleteImagesFromAlbum = async (imageIDs: string[]) => {
    if (album) {
      await removeAssetsFromAlbumAsync(imageIDs, album.id);
      options.onAlbumUpdate && options.onAlbumUpdate(album);
    }
  };

  return (
    <MediaContext.Provider
      value={{
        album,
        addImagesToAlbum,
        deleteImagesFromAlbum,
        permission,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
};
