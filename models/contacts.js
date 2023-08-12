import { Schema, model } from "mongoose";

import { validateAtUpdate, hamdleSaveError } from "./hooks.js";

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

contactSchema.pre("findOneAndUpdate", validateAtUpdate);

contactSchema.post("save", hamdleSaveError);
contactSchema.post("findOneAndUpdate", hamdleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
