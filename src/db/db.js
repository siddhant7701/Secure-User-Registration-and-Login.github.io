const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/form", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Connection to MongoDB successful`);
}).catch((error) => {
    console.error(`Error connecting to MongoDB: ${error}`);
});