import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 8000;
const app = express();

// Read tours data
const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'dev-data/data/tours.json'))
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours
    }
  });
});

app.listen(port, () => {
  console.log(`server is running on the port ${port}`);
});