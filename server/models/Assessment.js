let mongoose = require("mongoose");

let AssessmentSchema = new mongoose.Schema(
    {
        assessmentName: String,
        course: String,
        type: String,
        dueDate: Date,
        status: String,
        notes: String,
        
    },
    {
        collection: "AssessmentData",
    }

    );
module.exports = mongoose.model('Assessment', AssessmentSchema);