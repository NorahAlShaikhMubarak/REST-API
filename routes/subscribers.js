const express = require('express')
const subscriber = require('../models/subscriber')
const router = express.Router()
const Subscriber = require('../models/subscriber')

//Getting all subscribers
router.get('/', async (req, res) => {
    try {
        const subscribers = await Subscriber.find()
        res.json(subscribers)

    }
    //500 status code means there is error in your server
    catch (err) {
        res.status(500).json({ message: err.message })
    }

})
//Getting one sub
router.get('/:id', getSubscriber, (req, res) => {
    res.json(res.subscriber)
    
})

//Creating one sub
router.post('/', async (req, res) => {
    const subscriber = new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })
    try{
        const newSubscriber = await subscriber.save()
        //status 201 means successfully created an object
        res.status(201).json(newSubscriber)

    }
    catch(err){
        //status 400 means user gave us bad data, something wrong with user input not server
        res.status(400).json({ message: err.message })

    }
})

//Updating one sub
router.patch('/:id', getSubscriber, async (req, res) => {
    //check if the request already exist in order to update
    if (req.body.name != null) {
        res.subscriber.name = req.body.name
    }
    if (req.body.subscribedToChannel != null){
        res.subscriber.subscribedToChannel = req.body.subscribedToChannel
    }
    try{
        const updatedSubscriber = await res.subscriber.save()
        res.json(updatedSubscriber)

    }
    catch (err){
        //if user passed wrong subscriber name
        res.status(400).json({message: err.message})


    }

    
})


//Deleting one sub
router.delete('/:id', getSubscriber, async (req, res) => {
    try{
        //removing subscriber fro DB
        await res.subscriber.remove()
        //if it's successfully deleted send this message
        res.json({message: 'Deleted Subscriber'})

    }
    catch (err){
        res.status(500).json({message: err.message})

    }
    
})

//middleware

async function getSubscriber(req, res, next){
    let subscriber
 try{
     subscriber = await Subscriber.findById(req.params.id)
     if(subscriber == null){
         //status 404 means we cannot find something
         return res.status(404).json({message: 'cannot find subscriber'})
     }

 }
 catch (err) {
//status 500 means something is wrong with server
    return res.status(500).json({message: err.message})

 }
 res.subscriber = subscriber
 next()

}

module.exports = router