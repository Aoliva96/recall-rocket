const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+@.+\..+/, "Please enter a valid email address."],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    match: [
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&-]{8,}$/,
      "Password must be at least 8 characters long, with at least one letter and one number.",
    ],
  },
  admin: {
    type: Boolean,
    default: false,
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Favorite",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
