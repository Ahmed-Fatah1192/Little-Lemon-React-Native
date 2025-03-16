// utils/database.js
import * as SQLite from 'expo-sqlite';

// Open or create the database async
const openDB = async () => {
  try {
    return await SQLite.openDatabaseAsync('little_lemon.db');
  } catch (error) {
    console.error('Error opening database:', error);
    return null;
  }
};

export const initDatabase = async () => {
  try {
    const db = await openDB();
    if (!db) return false;
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        name TEXT, 
        price REAL, 
        description TEXT, 
        image TEXT, 
        category TEXT DEFAULT 'mains'
      )
    `);
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

export const saveMenuItems = async (menuItems) => {
  try {
    const db = await openDB();
    if (!db) return false;
    
    // Clear existing menu items
    await db.execAsync('DELETE FROM menu');
    
    // Insert new menu items
    for (const item of menuItems) {
      // Add a default category if none exists
      const category = item.category || 'mains';
      
      await db.execAsync(
        'INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)',
        [item.name, item.price, item.description, item.image, category]
      );
    }
    return true;
  } catch (error) {
    console.error('Error saving menu items:', error);
    return false;
  }
};

export const getMenuItems = async () => {
  try {
    const db = await openDB();
    if (!db) return [];
    
    const result = await db.getAllAsync('SELECT * FROM menu');
    return result || [];
  } catch (error) {
    console.error('Error getting menu items:', error);
    return [];
  }
};