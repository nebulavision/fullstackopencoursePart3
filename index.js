import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const PORT = process.env.PORT || 3002;
let contacts = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token('body', req => JSON.stringify(req.body));

const app = express();
app.use(express.json());
app.use(express.statis('dist'));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));
app.use(cors());

app.get("/api/persons", (req, res) => {
  res.json(contacts);
});

app.get("/api/persons/:id", (req, res) => {
  const contact = contacts.find((contact) => contact.id === Number(req.params.id));

  if (isNaN(req.params.id))
    return res.status(400).json({ error: "The id must be a number." });
  if (!contact) return res.status(404).json({ error: "Resource not found." });

  res.json(contact);
});

app.post('/api/persons', (req, res) => {
  if(!req.body) return res.status(422).json({error: "The body is missing."});

  const contact = req.body;

  if(!('name' in contact)) return res.status(422).json({error: "The name is missing."});
  const isNameDuplicate = contacts.find(n => n.name === contact.name);
  if(isNameDuplicate) return res.status(409).json({error: "A resoruce with the same name already exists."});

  if('id' in contact){
    if(isNaN(contact.id)) return res.status(400).json({error: "The id must be a number."}); 

    const isIdDuplicate = contacts.find(n => n.id === contact.id);

    if(isIdDuplicate) return res.status(409).json({error: "A resoruce with the same id already exists."});
  }else{
    contact.id = Math.floor(Math.random() * 5000);
  }

  contacts = contacts.concat(contact);

  res.json(contact);
});

app.delete('/api/persons/:id', (req, res) => {
    const personIndex = contacts.findIndex(contact => contact.id === Number(req.params.id));

    if(isNaN(req.params.id)) return res.status(400).json({error: "The id must be a number."});
    if(personIndex === -1) return res.status(404).json({error: 'Resource not found.'});

    contacts.splice(personIndex, 1);

    res.status(204).end();
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(`
        <p>Phonebook has info for ${contacts.length} people</p>
        <p>${date}</p>
    `);
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
