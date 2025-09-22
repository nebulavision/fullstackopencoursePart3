import express from "express";
import morgan from "morgan";
import cors from "cors";
import { PORT } from "./config.js";
import { Contact } from "./models/contact.js";
import mongoose from "mongoose";

morgan.token("body", (req) => JSON.stringify(req.body));

const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(cors());

app.get("/api/persons", async (req, res, next) => {
  try {
    const contacts = await Contact.find({});

    res.json(contacts);
  } catch (err) {
    next(err);
  }
});

app.get("/api/persons/:id", async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ error: "Resource not found." });
    }
  } catch (err) {
    next(err);
  }
});

app.post("/api/persons", async (req, res, next) => {
  try {
    if (!req.body)
      return res.status(422).json({ error: "The body is missing." });

    const existingContact = await Contact.findOne({ name: req.body.name });
    if (existingContact)
      return res
        .status(409)
        .json({ error: "A resource with the same name already exists." });

    const newContact = new Contact({
      name: req.body.name,
      number: req.body.number,
    });
    const savedContact = await newContact.save();

    res.status(201).json(savedContact);
  } catch (err) {
    next(err);
  }
});

app.put("/api/persons/:id", async (req, res) => {
  const body = req.body;

  const contact = {
    name: body.name,
    number: body.number
  };

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then(updatedContact => res.json(updatedContact))
    .catch(err => next(err));

});

app.delete("/api/persons/:id", async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    if (deletedContact) {
      res.status(204).end();
    } else {
      return res.status(404).json({ error: "Resource not found." });
    }
  } catch (err) {
    next(err);
  }
});

app.get("/info", async (req, res) => {
  const date = new Date();
  res.send(`
        <p>Phonebook has info for ${await Contact.countDocuments()} people</p>
        <p>${date}</p>
    `);
});

app.get("/healthcheck", (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? "connected" : "not connected"; 

  res.json({ serverStatus: "ok", dbStatus:  dbState });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(422).send({ error: error.message});
  }

  next(error)
}

app.use(errorHandler);
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
