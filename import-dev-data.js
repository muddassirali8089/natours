import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Tour from './models/tour.model.js';
import connectDB from './connection/connectDB.js';

dotenv.config(); // ✅ Load .env before DB connect

await connectDB(); // ✅ Connect to DB

// Fix __dirname and __filename in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Dynamic path to your data file
const toursFilePath = path.join(__dirname, './dev-data/data/tours-simple.json');

// ✅ Read JSON file
const tours = JSON.parse(fs.readFileSync(toursFilePath, 'utf-8'));

// ✅ Import tours
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('✅ Data imported successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error importing data:', err.message);
    process.exit(1);
  }
};

// ✅ Delete all tours
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('🗑 All tours deleted');
    process.exit();
  } catch (err) {
    console.error('❌ Error deleting data:', err.message);
    process.exit(1);
  }
};

// ✅ Run via CLI

console.log(process.argv);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
