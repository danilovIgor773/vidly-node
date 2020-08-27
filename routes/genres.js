const express = require('express');
const router = express.Router();

const Joi = require('joi');

const genres = [
    {
        id: 1,
        name: 'Horror'
    },
    {
        id: 2,
        name: 'Comedy'
    },
    {
        id: 3,
        name: 'Thriller'
    },
    {
        id: 4,
        name: 'Detective'
    },
]


//Getting all genres
router.get('/', (req, res) => {
    res.send(genres);
});

//Getting genre by id
router.get('/:id', (req, res) => {
    const genre = genres.find(gnr => gnr.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The genre with given id is not found');

    res.send(genre);
});

//Posting new genre data
router.post('/', (req, res) => {
    const { error } = ValidateInput(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const newGenre = {
        id: genres.length + 1,
        name: req.body.name
    }

    genres.push(newGenre);

    res.send(newGenre);
});

//updating particular genre

router.put('/:id', (req, res) => {
    const genre = genres.find(gnr => gnr.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The genre with given id is not found');

    const { error } = ValidateInput(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    genre.name = req.body.name;

    res.send(genre);
});

//delete particular genre
router.delete('/:id', (req, res) => {
    const genre = genres.find(gnr => gnr.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send('The genre with given id is not found');

    const index = genres.indexOf(genre);

    genres.splice(index, 1);

    res.send(genre);
})


const ValidateInput = (genre) => {
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(genre, schema); 
}

module.exports = router;