/********************************************************************************
 * BTI425 – Assignment 1
 * 
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 * 
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 * 
 * Name: ______Srushti Patel_______ Student ID: _____121654222______ Date: _____2024-01-19_______
 *
 * Published URL: ________________
 *
 * ********************************************************************************/

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express(); 

const ListingsDB = require("./modules/listingsDB");
const db = new ListingsDB();

// const mongoose = require('mongoose');

const HTTP_PORT = process.env.PORT||8080;

// cors as a middleware function
app.use(cors());

// express.json() middleware to parse JSON in the request body
app.use(express.json());

// All Routes 

// GET Route "/"
app.get('/', (req,res)=>{
    res.send({message: "API Listening"});
})

// POST/api/listings
app.post('/api/listings', async (req,res)=>{
    try{
        // If a new list is added successfully
        await db.addNewListing(req.body);
        res.status(201).send({message: "List created"});
    }
    catch(err){
        // if a new list is not added
        res.status(404).send({message: err});
       }
    
})

// GET/api/listings
app.get('/api/listings', async (req,res) =>{
    try{
        let page = parseInt(req.query.page) || 1;
        let perPage = parseInt(req.query.perPage) || 10;
        let nameFilter = req.query.nameFilter || '';

        let listings = await db.getAllListings(page, perPage, nameFilter);
        res.status(200).json(listings);
    }
    catch(err){
        res.status(404).json({ message: 'Failed to retrieve listings'});
    }

})

// GET/api/listings/(_id value)
app.get("/api/listings/:id", async (req,res)=>{
    try{
     let listing = await db.getListingById(req.params.id);
     res.send(listing);
    }
    catch(err){
     res.status(404).send({message: err});
    }
});

// PUT/api/listings/(_id value)
app.put('/api/listings/:id', async (req,res) =>
{
    try{
        await db.updateListingById(req.body,req.params.id)
        res.status(200).send({message: "Listing Updated"});
    }
    catch{
        res.status(404).send({message:err});
    }
})

// DELETE/api/listings(_id value)
app.delete('/api/listings/:id', async (req,res) =>
{
    try{
        await db.deleteListingById(req.params.id)
        res.status(201).send({message: "Listing Deleted"});
    }
    catch{
        res.status(404).send({message:err});
    }
})


// Listen on HTTP_PORT
//console.log(process.env.MONGO_DB_CONN_STRING)
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{console.log(err);
});

