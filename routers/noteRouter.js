const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const noteSchema = require('../schemas/noteSchema');
const Note = mongoose.model('Note', noteSchema);

const userSchema = require('../schemas/userSchema');
const User = mongoose.model('User', userSchema);

router.post('/', (req, res) => {
    if (!req.body.title) {
        res.status(400).json({ error: 'Title required for new note' });
    } else {
        const newNote = new Note(req.body);
        User
        .findById(req.session.userId)
        .then(user => {
            user.notes.push(newNote);
            user.save()
            .then(updatedUser => {
                res.status(200).json({ msg: 'New note added to user', notes: updatedUser.notes });
            })
            .catch(error => {
                res.status(500).json({ error: 'Could not save note' });
            });
        })
        .catch(error => {
            res.status(500).json({ error: 'Could not find user' });
        });    
    }
});

router.get('/', (req, res) => {
    User
    .findById(req.session.userId)
    .then(user => {
        res.status(200).json(user.notes);
    })
    .catch(error => {
        res.status(500).json({ error: 'Could not retrieve notes at this time' });
    });
});

router.delete('/:noteId', (req, res) => {
    User
    .findById(req.session.userId)
    .then(user => {
        user.notes = user.notes.filter(note => note._id.toString() !== req.params.noteId);
        user
        .save()
        .then(response => {
            res.status(200).json({ msg: 'Note has been successfully deleted', response });
        })
        .catch(error => {
            res.status(500).json({ error: 'Note could not be deleted at this time' });
        });
    });
});

router.put('/:noteId', (req, res) => {
    User
    .findById(req.session.userId)
    .then(user => {
        const noteToUpdate = user.notes.find((note) => note._id.toString() === req.params.noteId);
        if (req.body.title)
            noteToUpdate.title = req.body.title;
        if (req.body.text)
            noteToUpdate.text = req.body.text;
        if (req.body.flagColor)
            noteToUpdate.flagColor = req.body.flagColor;
        user.save()
        .then(user => {
            res.status(200).json({ msg: 'Note successfully updated', user })
        })
        .catch(error => {
            res.status(500).json({ errror: 'Could not update the user at this time' })
        });
    })
    .catch(error => {
        res.status(500).json({ error: 'Could not update note at this time' })
    });
});

module.exports =  router;