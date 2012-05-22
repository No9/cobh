exports.attach = function(options){
	this.hello = function(world) {
		console.log("Hello"+ world + options.delimiter || ".");
	}
};

exports.init = function (done){
	console.log("Leave the brown ones alone!");
	return done();
};