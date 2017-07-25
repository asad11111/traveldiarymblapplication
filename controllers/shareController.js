var cloudinary= require('cloudinary');
var Pic = require('../datasets/pics.js');
var fs= require('fs');
module.exports.submitMobilePhoto= function(req,res)
{
	var imageBuff= new Buffer(req.body.imageData, 'base64');
	fs.writeFile('./tmp/picture.jpg',imageBuff,function(err){
		if(err)
		{
			console.log('Error Found',err);
		}
		else
		{

			var fileName= process.env.GLOBAL_PATH+'/tmp/picture.jpg';
			cloudinary.uploader.upload(fileName, function(response)
			{
				var picture=new Pic();
				picture.name= req.body.name;
				picture.description=req.body.description;
				picture.url=res.secure_url;
				console.log('Image secure_url is' + res.secure_url);
				picture.save();
				res.status(200).end();
				console.log('This the response '+ res);
			});
		}
});
}