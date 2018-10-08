const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const userSchema = require('../schemas/userSchema');
const User = mongoose.model('User', userSchema);
const noteRouter = require('./noteRouter');

router.use('/notes', noteRouter);

router.get('/', (req, res) => {
    User
    .findById(req.session.userId)
    .then(user => {
        res.status(200).send(user);
    })
    .catch(error => {
        res.status(400).send(error);
    });
});

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password ) {
        res.status(400).json({ error: 'Username and password are required fields' });
    } else {
        User
        .findOne({ username })
        .then(response => {
            if (!response){
                const user = new User({ username, password });
                user
                .save()
                .then(newUser => {
                    req.session.userId = newUser._id;
                    req.session.username = newUser.username;
                    req.session.password = newUser.password;
                    res.status(201).json({ username: newUser.username, _id: newUser._id });
                })
            } else {
                res.status(422).json({ error: 'Username not available' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'User could not be created'});
        });
    }
});

router.post('/login', (req, res) => {
    if (req.session.userId) {
        User
        .findById(req.session.userId)
        .select('-password')
        .then(user => {
            res.status(200).json(user);
        })
        .catch(error => {
            res.status(500).json({ error: 'Could not retrieve user' });
        });
    } else {
        const { username, password } = req.body;

        User
        .findOne({ username })
        .then(user => {
            if (user.isPasswordValid(password)) {
                req.session.userId = user._id;
                req.session.username = user.username;
                req.session.password = user.password;
                res.status(200).json({ msg: 'User successfully logged in', user });
            } else {
                res.status(400).json({ error: 'Username or passord incorrect' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: 'Could not login user' });
        });
    }
});

router.put('/update', (req, res) => {
    const { username, password, } = req.body;
    const { userId } = req.session;
    const updatedData = {};
    if (username)
        updatedData.username = username;
    else
        updatedData.username = req.session.username;

    if (password)
        updatedData.password = password;
    else
        updatedData.password = req.session.password;
    
    User
    .findByIdAndUpdate(userId, updatedData)
    .then(response => {
        req.session.username = updatedData.username;
        req.session.password = updatedData.password;
        res.status(200).json({ msg: 'User successfully updated' });
    })
    .catch(error => {
        res.status(500).json({ error: 'User could not be updated' });
    });
});

router.delete('/delete', (req, res) => {
    const { userId } = req.session;
    User
    .findByIdAndRemove(userId)
    .then(response => {
        res.status(200).json({ msg: 'User Successfully deleted' });
    })
    .catch(error => {
        res.status(500).json({ error: 'User could not be deleted' });
    });
});

module.exports = router;