// utils/database.js
import * as SQLite from 'expo-sqlite';

// Open or create the database
const db = SQLite.openDatabase('little_lemon.db');

export const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, description TEXT, image TEXT, category TEXT)',
        [],
        () => { resolve(); },
        (_, error) => { reject(error); }
      );
    });
  });
};

export const saveMenuItems = (menuItems) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Clear existing menu items
      tx.executeSql('DELETE FROM menu', [], () => {
        // Insert new menu items
        menuItems.forEach(item => {
          tx.executeSql(
            'INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)',
            [item.name, item.price, item.description, item.image, item.category],
            () => {},
            (_, error) => { reject(error); }
          );
        });
        resolve();
      });
    });
  });
};

export const getMenuItems = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM menu',
        [],
        (_, { rows }) => {
          resolve(rows._array);
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};