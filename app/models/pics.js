var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var newSchema = new Schema({
    description:
    {
        type:String,
        required:true
    }
});

newSchema.pre('save', function (next) {
    var user = this;
    
});

module.exports = mongoose.model('pics', newSchema);