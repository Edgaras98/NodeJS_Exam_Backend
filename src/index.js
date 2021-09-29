const express = require('express');
const cors = require('cors');
require('dotenv').config();

const auth = require('./routes/v1/auth');
const content = require('./routes/v1/content');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/v1/auth', auth);
app.use('/v1/content', content);

app.get('/', (req, res) => {
  res.send({ msg: 'Server is running successfully' });
});

app.all('*', (req, res) => {
  res.status(404).send({ error: 'Page not found' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
