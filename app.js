const express = require('express');
const app = express();
const genres = require('./routes/genres');

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Home page");
});

app.use('/api/genres', genres);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App is running on port ${port}...`));