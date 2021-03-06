const express = require("express");
const connectDB = require("./db/database");
const morgan = require("morgan");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const app = express();
const path = require("path");
const passport = require("passport");

// Routes
const userRoutes = require("./apis/users/users.routes");
const productRoutes = require("./apis/products/routes");
const shopRoutes = require("./apis/shop/shops.routes");

// Passport
const { localStrategy } = require("./middleware/passport");

app.use(cors());

connectDB();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(logger);
app.use((req, res, next) => {
  if (req.body.name === "Broccoli Soup")
    res.status(400).json({ message: "I HATE BROCCOLI!! KEEFY! " });
  else next();
});

// Passport
app.use(passport.initialize());
passport.use(localStrategy);

// Routes
app.use("/media", express.static(path.join(__dirname, "media")));
app.use("/api/products", productRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api", userRoutes);

console.log(path.join(__dirname, "media"));

app.use((req, res, next) => {
  res.status(404).json({ message: "Path not found" });
});

app.use(errorHandler);

const PORT = 8001;
app.listen(PORT, () => console.log(`Application running on localhost:${PORT}`));
