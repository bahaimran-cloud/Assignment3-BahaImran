let mongoose = require("mongoose");
// create a model class
// Define the schema for Assessment
let AssessmentSchema = new mongoose.Schema(
    {
        assessmentName: String,
        course: String,
        type: String,
        dueDate: Date,
        status: String,
        notes: String,
        
    },
    // Schema Options
    {
        collection: "AssessmentData",
    }

    );
module.exports = mongoose.model('Assessment', AssessmentSchema);