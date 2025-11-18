let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Assessment = require('../models/Assessment');
const SchoolAssessment = require('../models/Assessment');


// FINISH THE RESTT

router.get('/', (async (req, res, next) => {
    try {
        const assesments = await Assessment.find({});
        console.log(assesments);
        res.render('Assessments/list', {title: 'Assessments', assesments: assesments});
    } catch (err) {
        console.error(err);
        res.render('JobApplication/list', {
            error:'Error on server'
        })
    }
}));
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
module.exports = router;