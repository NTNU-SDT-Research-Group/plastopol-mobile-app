import React, { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { openDatabase } from "../utils/database-lib";
import { Annotation } from "../components/types";

const NO_OP = () => {};

type DatabaseContextProps = {
  updateAnnotations: (imageId: string, annotation: Annotation[]) => void;
  getAnnotations: (
    imageId: string,
    cb: (annotation: Annotation[]) => void,
    errorCb?: () => void
  ) => void;
  getImageIdsWithValidAnnotations: (cb: (imageIds: string[]) => void) => void;
  addAnnotationUpdateListener: (cb: () => void) => void;
  removeAnnotationUpdateListener: (cb: () => void) => void;
  cleanupStaleAnnotations: (idList: string[]) => void;
};

export const databaseContext = createContext<DatabaseContextProps>({
  updateAnnotations: NO_OP,
  getAnnotations: NO_OP,
  getImageIdsWithValidAnnotations: NO_OP,
  addAnnotationUpdateListener: NO_OP,
  removeAnnotationUpdateListener: NO_OP,
  cleanupStaleAnnotations: NO_OP,
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
        "create table if not exists annotations (id integer primary key not null, value text);"
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

  const updateAnnotations = (imageId: string, annotation: Annotation[]) => {
    db.transaction((tx) => {
      tx.executeSql(
        `insert or replace into annotations (id, value) values (?, ?);`,
        [imageId, JSON.stringify(annotation)],
        (_, { rows }) => {
          onAnnotationUpdateCbList.forEach((cb) => cb());
        }
      );
    });
    return;
  };

  const getAnnotations = (
    imageId: string,
    cb: (annotation: Annotation[]) => void,
    errorCb?: () => void
  ) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from annotations where id = ?;`,
        [imageId],
        (_, { rows }) => {
          if (rows.length > 0) {
            cb(JSON.parse(rows._array[0].value));
          }
          else {
            errorCb && errorCb();
          }
        }
      );
    });
  };

  const getImageIdsWithValidAnnotations = (
    cb: (imageIds: string[]) => void
  ) => {
    db.transaction((tx) => {
      tx.executeSql(
        `select * from annotations where value is not null;`,
        [],
        (_, { rows }) => {
          cb(
            rows._array
              .filter((x) => x.value !== null && x.value !== "[]")
              .map((x) => x.id) as string[]
          );
        }
      );
    });
  };

  const cleanupStaleAnnotations = (idList: string[]) => {
    db.transaction((tx) => {
      tx.executeSql(
        `delete from annotations where id in (${idList
          .map(() => "?")
          .join(",")});`,
        idList,
        (_, { rows }) => {
          onAnnotationUpdateCbList.forEach((cb) => cb());
        }
      );
    });
  };

  return (
    <databaseContext.Provider
      value={{
        updateAnnotations,
        getAnnotations,
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
