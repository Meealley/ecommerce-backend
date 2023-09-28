const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const colors = require("colors");

const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const connectDb = require("./Config/dbConnect");
const AuthRoutes = require("./Routes/AuthRoutes");
const ProductRoutes = require("./Routes/ProductRoutes");
const BlogRoutes = require("./Routes/BlogRoutes");
const { notFound, errorHandler } = require("./Middleware/ErrorHandler");

connectDb();

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/auth", AuthRoutes);
app.use("/api/product", ProductRoutes);
app.use("/api/blog", BlogRoutes);

//Error Middleware handlers
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
