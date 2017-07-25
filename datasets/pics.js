var mongoose= require('mongoose');

module.exports=mongoose.model('Pic', {
	name:"String",
	description:"String",
	url:"String",
	date:{type: Date, default:Date.now}
})