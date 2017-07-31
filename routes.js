'user strict';

var express = require("express");
var router = express.Router();
var Postcode = require("./models").Postcode;

router.param("pID", function(req, rest, next, id){
	Postcode.findById(id, function(err, doc){
		if(err) return next(err);
		if(!doc){
			err = new Error("Not Found");
			err.status = 404;
			return next(err);
		}
		req.postcode = doc;
		return next();
	});
});

router.param("zID", function(req, rest, next, id){
	req.zipcode = req.postcode.zipcodes.id(id);
		if(!req.zipcode){
			err = new Error("Not Found");
			err.status = 404;
			return next(err);
		}
		next();
});

// GET /postcodes
// Return all the postcodes
router.get("/", function(req, res, next){
	Postcode.find({})
				.sort({createdAt: -1})
				.exec(function(err, postcodes){
					if(err) return next(err);
					res.json(postcodes);
				});
});

// POST /postcodes
// Route for creating postcodes
router.post("/", function(req, res, next){
	var postcode = new Postcode(req.body);
	postcode.save(function(err, postcode){
		if(err) return next(err);
		res.status(201);
		res.json(postcode);
	});
});

// GET /postcodes/:id
// Route for specific postcodes
router.get("/:pID", function(req, res, next){
		res.json(req.postcode);
});

// POST /postcodes/:id/postcodes
// Route for creating a postcode
router.post("/:pID/postcodes", function(req, res, next){
	req.postcode.zipcodes.push(req.body);
	req.postcode.save(function(err, postcode){
		if(err) return next(err);
		res.status(201);
		res.json(postcode);
	});
});

// PUT /postcodes/:pID/postcodes/:zID
// Edit a specific postcode
router.put("/:pID/postcodes/:zID", function(req, res){
	req.zipcode.update(req.body, function(){
		if(err) return next(err);
		res.json(result);
	});
});

// DELETE /postcodes/:qID/postcodes/:zID
// Delete a specific postcode
router.delete("/:pID/postcodes/:zID", function(req, res){
	req.zipcode.remove(function(err){
		req.postcode.save(function(err, postcode){
			if(err) return next(err);
			res.json(postcode);
		});
	});
});

module.exports = router;