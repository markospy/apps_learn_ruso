// src/db.js

import initSqlJs from "sql.js";

let db = null;
const SQLITE_FILE_NAME = "russian_verbs.sqlite";

// Inicializa la base de datos (carga sql.js y crea la tabla si no existe)
export async function initializeDatabase() {
  if (db) return;

  // Cargar sql.js
  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`, // Ruta a los archivos .wasm
  });

  // Cargar base de datos guardada en localStorage o crear una nueva
  const data = localStorage.getItem(SQLITE_FILE_NAME);
  if (data) {
    const buffer = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
    db = new SQL.Database(buffer);
    console.log("Base de datos SQLite cargada desde el almacenamiento local.");
  } else {
    db = new SQL.Database();
    console.log("Nueva base de datos SQLite inicializada.");
  }

  // Crear la tabla si no existe
  const createTableStmt = `
        CREATE TABLE IF NOT EXISTS verbs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            infinitive TEXT NOT NULL UNIQUE,
            conjugationType INTEGER NOT NULL,
            root TEXT NOT NULL,
            createdAt TEXT
        );
    `;
  db.exec(createTableStmt);

  saveDatabase(); // Guardar la estructura inicial
}

// Guarda la base de datos en el almacenamiento local
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = new Uint8Array(data);
    localStorage.setItem(
      SQLITE_FILE_NAME,
      btoa(String.fromCharCode.apply(null, buffer))
    );
  }
}

// CRUD - Funciones de la Base de Datos

export async function addVerb(verb) {
  if (!db) await initializeDatabase();
  const now = new Date().toISOString();
  const stmt = db.prepare(
    "INSERT INTO verbs (infinitive, conjugationType, root, createdAt) VALUES (?, ?, ?, ?)"
  );
  stmt.run([verb.infinitive, verb.conjugationType, verb.root, now]);
  stmt.free();
  saveDatabase();
}

export async function getVerbs() {
  if (!db) await initializeDatabase();
  const result = db.exec("SELECT * FROM verbs ORDER BY infinitive ASC");
  if (result.length === 0) return [];

  // Mapear el resultado de sql.js a un array de objetos
  const rows = result[0].values;
  const columns = result[0].columns;
  return rows.map((row) => {
    const obj = {};
    columns.forEach((col, index) => {
      obj[col] = row[index];
    });
    return obj;
  });
}

export async function deleteVerb(id) {
  if (!db) await initializeDatabase();
  const stmt = db.prepare("DELETE FROM verbs WHERE id = ?");
  stmt.run([id]);
  stmt.free();
  saveDatabase();
}
