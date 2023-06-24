import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { openDatabase } from "../utils/database-lib";
import { Annotation } from "../components/types";

const NO_OP = () => new Promise<any>((resolve) => resolve({}));

type DatabaseContextProps = {
  updateAnnotations: (
    imageId: string,
    scaledWidth: number,
    scaledHeight: number,
    annotation: Annotation[]
  ) => Promise<void>;
  getAnnotations: (imageId: string) => Promise<Annotation[]>;
  getScaledDimensions: (
    imageId: string
  ) => Promise<{ width: number; height: number }>;
  getImageIdsWithValidAnnotations: () => Promise<string[]>;
  addAnnotationUpdateListener: (cb: () => void) => void;
  removeAnnotationUpdateListener: (cb: () => void) => void;
  cleanupStaleAnnotations: (idList: string[]) => Promise<void>;
};

export const databaseContext = createContext<DatabaseContextProps>({
  updateAnnotations: NO_OP,
  getAnnotations: NO_OP,
  getScaledDimensions: NO_OP,
  getImageIdsWithValidAnnotations: NO_OP,
  cleanupStaleAnnotations: NO_OP,
  addAnnotationUpdateListener: NO_OP,
  removeAnnotationUpdateListener: NO_OP,
});

type DatabaseProviderProps = {
  children: React.ReactNode;
};

export const DatabaseProvider = ({ children }: DatabaseProviderProps) => {
  const db = openDatabase();
  let [onAnnotationUpdateCbList, setOnAnnotationUpdateCbList] = useState<
    (() => void)[]
  >([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists annotations (id integer primary key not null, scaledHeight real, scaledWidth real, value text);"
      );
    });
  }, []);

  const addAnnotationUpdateListener = (cb: () => void) => {
    setOnAnnotationUpdateCbList([...onAnnotationUpdateCbList, cb]);
  };

  const removeAnnotationUpdateListener = (cb: () => void) => {
    setOnAnnotationUpdateCbList(
      onAnnotationUpdateCbList.filter((x) => x !== cb)
    );
  };

  const updateAnnotations = (
    imageId: string,
    scaledWidth: number,
    scaledHeight: number,
    annotation: Annotation[]
  ) => {
    return new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `insert or replace into annotations (id, scaledWidth, scaledHeight, value) values (?, ?, ?, ?);`,
          [imageId, scaledWidth, scaledHeight, JSON.stringify(annotation)],
          (_, { rows }) => {
            onAnnotationUpdateCbList.forEach((cb) => cb());
            resolve();
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  const getAnnotations = (imageId: string) => {
    return new Promise<Annotation[]>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from annotations where id = ?;`,
          [imageId],
          (_, { rows }) => {
            if (rows.length > 0) {    
              resolve(JSON.parse(rows._array[0].value));
            } else {
              resolve([]);
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  const getScaledDimensions = (imageId: string) => {
    return new Promise<{
      width: number;
      height: number;
    }>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from annotations where id = ?;`,
          [imageId],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve({
                width: rows._array[0].scaledWidth,
                height: rows._array[0].scaledHeight,
              });
            } else {
              resolve({
                width: 0,
                height: 0,
              });
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  const getImageIdsWithValidAnnotations = () => {
    return new Promise<string[]>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from annotations where value is not null;`,
          [],
          (_, { rows }) => {
            resolve(
              rows._array
                .filter((x) => x.value !== null && x.value !== "[]")
                .map((x) => x.id) as string[]
            );
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  const cleanupStaleAnnotations = (idList: string[]) => {
    return new Promise<void>((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          `delete from annotations where id in (${idList
            .map(() => "?")
            .join(",")});`,
          idList,
          (_, { rows }) => {
            onAnnotationUpdateCbList.forEach((cb) => cb());
            resolve();
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  };

  return (
    <databaseContext.Provider
      value={{
        updateAnnotations,
        getAnnotations,
        getScaledDimensions,
        getImageIdsWithValidAnnotations,
        addAnnotationUpdateListener,
        removeAnnotationUpdateListener,
        cleanupStaleAnnotations,
      }}
    >
      {children}
    </databaseContext.Provider>
  );
};
