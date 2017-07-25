module.exports.setConfigs=function()
{
	var cloudinary=require('cloudinary');
	cloudinary.config({ 
  		cloud_name: 'asadarshadar', 
 		api_key: '688959346316788', 
  		api_secret: 'P1bZSpbkjL2adQ5ZNQd_0sayCUc',
  		
  		 
	});
	//process.env.CLOUDINARY_URL="cloudinary://688959346316788:P1bZSpbkjL2adQ5ZNQd_0sayCUc@asadarshadar"
	process.env.MONGO_URL="mongodb://localhost/traveldb"
}