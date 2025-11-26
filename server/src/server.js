const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");
const adminRoutes = require("./routes/admin.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/openapi.json");

const User = require("./models/User.js");

app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);

// Swagger UI - API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

async function main(){
    await mongoose.connect(process.env.MONGODB_URI);
}
main().then(async () => {
    console.log("Database connected");
    const admin = await User.findOne({ role: "super-admin" });
    if (admin) {
      console.log(
        "Super-Admin is already there with email 'admin@gmail.com' and password as 'admin'. super-admin has privileges to create admins"
      );
      return;
    }
    await User.create({
      username: "admin",
      email: "admin@gmail.com",
      password: "admin",
      role: "super-admin",
    });
    console.log(
      "admin created with email 'admin@gmail.com' and password as 'admin'"
    );
  })
  .catch((err) => console.error("Error connecting to databsse:", err));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
