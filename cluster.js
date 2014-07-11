var cluster = require('cluster'),
	os = require('os'),
	npid = require('npid'),
	fs = require('fs'),
	pidFile = "/tmp/node-example.pid";
	numWorkers = process.env.NODE_WORKERS || os.cpus().length+1 ;
cluster.setupMaster({
  exec: 'app.js'
});

try {
    var pid = npid.create(pidFile);
    pid.removeOnExit();
} catch (err) {
    console.log(err);
    fs.unlinkSync(pidFile);
    process.exit(1);
}


// this is the master control process
console.log("Control process running: PID=" + process.pid);

// fork as many times as we have CPUs

for (var i = 0; i < numWorkers; i++) {
    cluster.fork();
}

// handle unwanted worker exits
cluster.on("exit", function(worker, code) {
    if (code != 0) {
        console.log("Worker crashed! Spawning a replacement.");
        cluster.fork();
    }
});

process.on("SIGUSR2", function() {
    console.log("SIGUSR2 received, reloading workers");


    delete require.cache[require.resolve("./app")];

    var i = 0;
    var workers = Object.keys(cluster.workers);
    var f = function() {
        if (i == workers.length) return; 

        console.log("Killing worker");

        cluster.workers[workers[i]].send("stop");
        cluster.workers[workers[i]].disconnect();
        cluster.workers[workers[i]].on("disconnect", function() {
        });
        var newWorker = cluster.fork();
        newWorker.on("listening", function() {
            console.log("Replacement worker online.");
            i++;
            f();
        });
    }
    f();
});

// Shut down a few servers if there are too many
setInterval(function(){
    var workers = Object.keys(cluster.workers);
    if(workers.length > numWorkers){
        var needToClose = workers.length - numWorkers;
        for(var i = 0;i<needToClose;i++){
            cluster.workers[workers[i]].send("stop");
            cluster.workers[workers[i]].disconnect();
            cluster.workers[workers[i]].on("disconnect", function() {
            });            
        }
    }
},100000);
