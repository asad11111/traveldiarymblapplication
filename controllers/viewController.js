var Pic = require('../datasets/pics.js');
module.exports.getNewPhoto= function(req,res)
{
	Pic.find({})
	.limit(30)
	.exec(function(err, photos){
		if(err)
		{
			res.send(500).end();
		
		}
		else
		{
			res.json(photos);
		}
	})
}