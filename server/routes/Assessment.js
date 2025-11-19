let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Assessment = require('../models/Assessment');

// GET route for the Assessment List page - READ
router.get('/', async (req, res, next) => {
    try {
        const assessments = await Assessment.find({});
        console.log(assessments);
        res.render('Assessments/list', { title: 'Assessments', assessments: assessments });
    } catch (err) {
        console.error(err);
        res.render('Assessments/list', {
            title: 'Assessments',
            error: 'Error on server'
        });
    }
});
// GET and POST routes for adding a new Assessment - CREATE
router.get('/add',async(req, res, next) => {
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
// POST route for adding a new Assessment - CREATE
router.post('/add', async (req, res, next) => {
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
// GET and POST routes for editing an Assessment - UPDATE
router.get('/edit/:id', async (req, res, next) => {
    try {
        const assessment = await Assessment.findById(req.params.id);
        res.render('Assessments/edit', { title: 'Edit Assessment', assessment: assessment });
    } catch (err) {
        console.error(err);
        res.redirect('/assessments');
    }
});
// POST route for editing an Assessment - UPDATE
router.post('/edit/:id', async (req, res, next) => {
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
})
// GET route for deleting an Assessment - DELETE
router.get('/delete/:id', async (req, res, next) => {
    try {
        await Assessment.findByIdAndDelete(req.params.id);
        res.redirect('/assessments');
    } catch (err) {
        console.error(err);
        res.redirect('/assessments');
    }
});
module.exports = router;