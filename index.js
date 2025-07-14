import express, { json } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 8000;
const app = express();
app.use(express.json());

// Read tours data
const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, "dev-data/data/tours-simple.json"))
);

app.get("/api/v1/tours", (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours: tours,
    },
  });
});

app.get("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);
  // if (id > tours.length)
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "incalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

app.post("/api/v1/tours", (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    path.join(__dirname, "dev-data/data/tours-simple.json"),
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
});

app.patch("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1;


  if (id > tours.length) {
   return res.status(404).json({
      status: "fail",
      message: "invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: "<updated tour here>",
    },
  });
});


app.delete("/api/v1/tours/:id", (req, res) => {
  const id = req.params.id * 1;


  if (id > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "invalid ID",
    });
  }

  res.status(204).json({
    status: "success",
    data: null
  });
});

app.listen(port, () => {
  console.log(`server is running on the port ${port}`);
});
