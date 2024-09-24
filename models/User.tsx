const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  family_ids: [String],
  current_family_id: String,
  role: {
    type: Map,
    of: String,
  },
  profile_picture: String,
});

mongoose.model("User", userSchema);
