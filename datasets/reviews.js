var mongoose= require('mongoose');

module.exports=mongoose.model('Reviews', {
	description:"String",
	rate:"String"
})