import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connection from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from './routes/categoryRoutes.js'
import productRoute from  './routes/productRoute.js'
import cors from 'cors'
import bodyParser from 'body-parser';
import path from 'path';
import {fileURLToPath} from 'url';

////confnigure Env//..//
dotenv.config();

/// initialization express //..//
const app = express();

// esmodule fix ///
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

//// database connection function//..//
connection();

const PORT = process.env.PORT || 8000;

///middleware//..///
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname , './client/build')))
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
app.use(morgan("dev"));


///routes..///
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category" , categoryRoutes)
app.use('/api/v1/product', productRoute)

///rest Api//
app.use('*' , function(request, response){
  response.sendFile(path.join(__dirname , './client/build/index.html'))
})

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
