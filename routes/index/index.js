module.exports = function(server){
	var router = server.Router();
	router.get("/",function(req,res){
		res.render("index",{title:"Node Example"});
	});
	server.use('/',router);
};