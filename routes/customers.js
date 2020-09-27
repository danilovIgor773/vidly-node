const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');

const customersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Customer = mongoose.model('Customer', customersSchema);

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const customer = await Customer.findById(id);

    if(!customer) return res.status(404).send('The customer with given id is not found');

    res.send(customer);
});

router.post('/', async (req, res) => {
    const { error } = ValidateInput(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const {name, isGold, phone} = req.body;

    //console.log(`name: ${name}; isGold: ${isGold}, phone: ${phone}`);
    
    let customer = new Customer({ name, isGold, phone});
    customer = await customer.save();
    res.send(customer);
})

router.put('/:id', async (req, res) => {
    const { error } = ValidateInput(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    const {id, name, isGold, phone} = req.params;
    const customer = await Customer.findOneAndUpdate(id, {name, isGold, phone}) 
    if(!customer) return res.status(404).send('The customer with given id is not found');

    res.send(customer);
})

router.delete('/:id', async (req, res) => {
    const customer = await Genre.findOneAndRemove(req.params.id);
    if(!customer) return res.status(404).send('The customer with given id is not found');

    res.send(customer);
});


const ValidateInput = (customer) => {
    const schema = {
        name: Joi.string().min(3).max(50).required(),
        phone: Joi.string().min(3).max(50).required(),
        isGold: Joi.boolean()
    }
    return Joi.validate(customer, schema); 
}

module.exports = router;