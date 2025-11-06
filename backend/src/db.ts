import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// Define your data structure
export interface Post {
  id: string;
  description: string;
  date: string;
  categories?: string[];
}

export interface Category {
  id: string;
  name: string;
  favorite: boolean;
}

interface Database {
  posts: Post[];
  categories: Category[];
}

// Configure lowdb to write to db.json
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, '..', 'db.json');
const adapter = new JSONFile<Database>(file);
const defaultData: Database = { posts: [], categories: [] };
const db = new Low<Database>(adapter, defaultData);

// Read data from JSON file, this will set db.data
await db.read();

// Initialize if data doesn't exist
if (!db.data) {
  db.data = defaultData;
  await db.write();
}

export const getCollection = async <T extends keyof Database>(name: T): Promise<Database[T]> => {
  await db.read();
  return db.data?.[name] || [];
};

export const setCollection = async <T extends keyof Database>(name: T, data: Database[T]): Promise<void> => {
  if (!db.data) await db.read();
  if (db.data) {
    db.data[name] = data;
    await db.write();
  }
};
