import * as SQLite from "expo-sqlite";

let db: SQLite.WebSQLDatabase;

export function openDatabase() {
  if (!db) db = SQLite.openDatabase("database.db");
  return db;
}
