var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
   title: String,
   image: String,
   desc: String,
   price: String,
   created: {type: Date, default: Date.now},
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
});
var Product = mongoose.model("Product", productSchema);



module.exports = mongoose.model("Product", productSchema);