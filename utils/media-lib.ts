import {
  Album,
  SortBy,
  createAssetAsync,
  getAssetsAsync,
  SortByValue,
} from "expo-media-library";

export const getAssetListFromAlbum = async (album: Album) => {
  return await getAssetsAsync({
    album: album,
    sortBy: [["creationTime", true]],
  });
};

export const covertUriToAsset = async (imageUriList: string[]) => {
  // TODO: Check if we can use this instead `getAssetListFromAlbum`
  return await Promise.all(imageUriList.map((uri) => createAssetAsync(uri)));
};
