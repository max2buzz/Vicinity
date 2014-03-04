
exports.list = function(req, res){
  res.send("respond with a resource");
};


exports.showSignUpPage = function(req, res) {
	res.render("userSignup");
};

exports.showUserDashboard = function(req, res){
  
};


exports.showUserProfile = function(req, res){
  
};

exports.getPost = function(req, res){
  
};


exports.checkEmail = function(req, res){
  res.json({isAvail:false, isValid:true});
};

exports.checkUserName = function(req, res){
  res.json({isAvail:false, isValid:true});
};