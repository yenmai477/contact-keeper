const express = require("express");

const connectDB = require("./config/db");

const usersRoute = require("./routes/users");
const contactsRoute = require("./routes/contacts");
const authRoute = require("./routes/auth");

const app = express();

//Conect database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 8000;

//Define Routes
app.use("/api/users/", usersRoute);
app.use("/api/auth/", authRoute);
app.use("/api/contacts", contactsRoute);

app.get("/", (req, res) => res.json({ msg: "Hello world!" }));

app.listen(PORT, () => {
  console.log("Server started on " + PORT);
});
