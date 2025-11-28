let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Assessment = require('../models/Assessment');
let { requireAuth } = require('../config/auth');

// GET route for the Assessment List page - READ (Public - No Auth Required)
router.get('/', async (req, res, next) => {
    try {
        const assessments = await Assessment.find({});
        console.log(assessments);
        res.render('Assessments/list', { 
            title: 'Assessments', 
            assessments: assessments 
        });
    } catch (err) {
        console.error(err);
        res.render('Assessments/list', {
            title: 'Assessments',
            error: 'Error on server'
        });
    }
});

// GET route for adding a new Assessment - CREATE (Requires Authentication)
router.get('/add', requireAuth, async(req, res, next) => {
    try {
        res.render('Assessments/add', {title: 'Add Assessments'});
    }
    catch (err) {
        console.error(err);
        res.render('Assessments/add', {
            error:'Error on server'
        })
    }
});

// POST route for adding a new Assessment - CREATE (Requires Authentication)
router.post('/add', requireAuth, async (req, res, next) => {
    try {
        let newAssessment = new Assessment({
            assessmentName: req.body.assessmentName,
            course: req.body.course,
            type: req.body.type,
            dueDate: req.body.dueDate,
            status: req.body.status,
            notes: req.body.notes,
        });
        await newAssessment.save();
        res.redirect('/assessments');
    } catch (err) {
        console.error(err);
        res.render('Assessments/add', {
            title: 'Add Assessment',
            error: 'Error adding assessment'
        });
    }
});

// GET route for editing an Assessment - UPDATE (Requires Authentication)
router.get('/edit/:id', requireAuth, async (req, res, next) => {
    try {
        const assessment = await Assessment.findById(req.params.id);
        res.render('Assessments/edit', { 
            title: 'Edit Assessment', 
            assessment: assessment 
        });
    } catch (err) {
        console.error(err);
        res.redirect('/assessments');
    }
});

// POST route for editing an Assessment - UPDATE (Requires Authentication)
router.post('/edit/:id', requireAuth, async (req, res, next) => {
    try {
        await Assessment.findByIdAndUpdate(req.params.id, {
            assessmentName: req.body.assessmentName,
            course: req.body.course,
            type: req.body.type,
            dueDate: req.body.dueDate,
            status: req.body.status,
            notes: req.body.notes,
        });
        res.redirect('/assessments');
    } catch (err) {
        console.error(err);
        res.render('Assessments/edit', {
            title: 'Edit Assessment',
            error: 'Error updating assessment'
        });
    }
});

// GET route for deleting an Assessment - DELETE (Requires Authentication)
router.get('/delete/:id', requireAuth, async (req, res, next) => {
    try {
        await Assessment.findByIdAndDelete(req.params.id);
        res.redirect('/assessments');
    } catch (err) {
        console.error(err);
        res.redirect('/assessments');
    }
});

module.exports = router;