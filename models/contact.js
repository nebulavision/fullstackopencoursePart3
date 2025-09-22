import mongoose from 'mongoose';
import { MONGODB_URI } from '../config.js';

mongoose.set('strictQuery', false);

mongoose.connect(MONGODB_URI);

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
});

contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export const Contact = mongoose.model('Contact', contactSchema);