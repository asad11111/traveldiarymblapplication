var Reviews = require('../datasets/reviews.js');
module.exports.addReview= function(req,res)
{
	var review=new Reviews();
	review.description= req.body.description;
	review.rate=req.body.rate;
}