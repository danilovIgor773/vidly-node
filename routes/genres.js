const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);


//Getting all genres
router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
});

//Getting genre by id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const genre = await Genre.findById(id);

    if(!genre) return res.status(404).send('The genre with given id is not found');

    res.send(genre);
});

//Posting new genre data
router.post('/', async (req, res) => {
    const { error } = ValidateInput(req.body);
    if(error) return res.status(400).send(error.details[0].message);
        
    let genre = new Genre({name: req.body.name});
    genre = await genre.save();
    res.send(genre);
});

//updating particular genre

router.put('/:id', async (req, res) => {
    const { error } = ValidateInput(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const id = req.params.id;
    const name = req.body.name;
    const genre = await Genre.findOneAndUpdate(id, {name: name}) 
    if(!genre) return res.status(404).send('The genre with given id is not found');

    res.send(genre);
});

//delete particular genre
router.delete('/:id', async (req, res) => {
    const genre = await Genre.findOneAndRemove(req.params.id);
    if(!genre) return res.status(404).send('The genre with given id is not found');

    res.send(genre);
})


const ValidateInput = (genre) => {
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(genre, schema); 
}

module.exports = router;