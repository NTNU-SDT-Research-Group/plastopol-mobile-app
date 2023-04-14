import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";

type useAlbumProps = {
  imageStorageLocation: string;
  onAlbumUpdate?: (album: MediaLibrary.Album) => void;
};

export const useAlbum = (options: useAlbumProps) => {
  const [permission, requestPermission] = MediaLibrary.usePermissions();
  const [album, setAlbum] = useState<MediaLibrary.Album | null | undefined>(
    undefined
  );

  useEffect(() => {
    const updateAlbumInfo = async () => {
      const foundAlbum = await MediaLibrary.getAlbumAsync(
        options.imageStorageLocation
      );
      if (foundAlbum) {
        setAlbum(foundAlbum);
      } else {
        setAlbum(null);
      }
    };

    if (permission?.status !== MediaLibrary.PermissionStatus.GRANTED) {
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

  const createAlbum = async (images: MediaLibrary.Asset[]) => {
    try {
      const [first, ...rest] = images;

      const createdAlbum = await MediaLibrary.createAlbumAsync(
        options.imageStorageLocation,
        first,
        false
      );

      if (rest.length !== 0) {
        await MediaLibrary.addAssetsToAlbumAsync(rest, createdAlbum!.id, false);
      }

      setAlbum(createdAlbum);

      return createdAlbum;
    } catch (error) {
      console.error(error);
    }

    throw Error("Could not create album.");
  };

  const addImagesToAlbum = async (imageAssets: MediaLibrary.Asset[]) => {
    if (!album) {
      const createdAlbum = await createAlbum(imageAssets);
      options.onAlbumUpdate && options.onAlbumUpdate(createdAlbum);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync(imageAssets, album.id, false);
      options.onAlbumUpdate && options.onAlbumUpdate(album);
    }
  };

  const deleteImagesFromAlbum = async (imageIDs: string[]) => {
    if (album) {
      await MediaLibrary.removeAssetsFromAlbumAsync(imageIDs, album.id);
      options.onAlbumUpdate && options.onAlbumUpdate(album);
    }
  };

  return {
    album,
    setAlbum,
    addImagesToAlbum,
    permission,
    deleteImagesFromAlbum
  };
};

export const getAssetListFromAlbum = async (album: MediaLibrary.Album) => {
  return await MediaLibrary.getAssetsAsync({
    album: album,
  });
};

export const covertUriToAsset = async (imageUriList: string[]) => {
  // TODO: Check if we can use this instead `getAssetListFromAlbum`
  return await Promise.all(
    imageUriList.map((uri) => MediaLibrary.createAssetAsync(uri))
  );
};
