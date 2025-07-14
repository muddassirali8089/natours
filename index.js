import express, { json } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const port = 8000;
const app = express();
app.use(express.json());

// Read tours data
const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname,'dev-data/data/tours-simple.json'))
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


app.post("/api/v1/tours" , (req , res) => {

    const newId = tours[tours.length-1].id + 1;
    const newTour = Object.assign({id:newId} , req.body);

    tours.push(newTour);

    fs.writeFile(path.join(__dirname,'dev-data/data/tours-simple.json') , JSON.stringify(tours) , (err) => {

        res.status(201).json({
            status : "success",
            data : {
                tour: newTour
            }
        })
    })


  

})

app.listen(port, () => {
  console.log(`server is running on the port ${port}`);
});