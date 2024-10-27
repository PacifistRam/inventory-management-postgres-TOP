const express  = require("express");
const app = express();
const inventoryRouter = require("./routes/inventoryRouter");
require('dotenv').config();

app.use(express.static('public'))
app.set("view engine", "ejs" );
app.use(express.urlencoded({extended: true}));
app.use("/", inventoryRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
});

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Express app listning on port: ${PORT}`));

