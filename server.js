const express = require("express");
const path = require("path");
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

//Server static assests in production
if (process.env.NODE_ENV === "production") {
  //Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

app.listen(PORT, () => {
  console.log("Server started on " + PORT);
});
