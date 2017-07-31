'use strict';

var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var sortZipcodes = function(a, b) {
	//- negative if a appears before b
	//0 no chnage
	//+ postive a after b
	if(a.updatedAt === b.updatedAt){
		return b.createdAt - a.createdAt;
	}
	return b.updatedAt - a.updatedAt;
}

var ZipcodeSchema = new Schema({
	locality: String,
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now}
});

ZipcodeSchema.method("update", function(updates, callback) {
	Object.assign(this, updates, {updatedAt: new Date()});
	this.parent().save(callback);
});

var PostcodeSchema = new Schema ({
	locality: String,
	zipcode: Number,
	states: String,
	country: String,
	longitude: Number,
	latitude: Number,
	createdAt: {type: Date, default: Date.now},
	updatedAt: {type: Date, default: Date.now},
	timezone: String
});

PostcodeSchema.pre("save", function(next){
	this.zipcodes.sort(sortZipcodes);
	next();
});

var Postcode = mongoose.model("Postcode", PostcodeSchema);

module.exports.Postcode = Postcode;