var BACKEND_URL='http://127.0.0.1:8888'; // our sim server
var networkname = "meta"; // what to call the REST entry point
var logdivid = "";

var nodes = new Array(16);

function init() {
	for (var i = 0; i < 16; i++) {
		nodes[i] = "";
	}
}

function initializeServer(logdivid_){
		if (logdivid_ != "") {
			logdivid = logdivid_;
		}
		$.ajax({
			type: "POST",
			url: BACKEND_URL + "/",
			data: JSON.stringify({Id: networkname}),
			dataType: "json",
			success: function() {
				initializeVisualisationWithClass(networkname);
			},
		});
			
		

};

function initializeUpdater() {
	
	var idx = midiNext();
	console.log("idx: " + idx);
	if (idx != undefined) {
			var idxn = [parseInt(idx[0]) - 1, parseInt(idx[1]) - 1];
			console.log("got midiitem " + idxn[0] + " + " + idxn[1]);
			console.log("is nodes " + nodes[idxn[0]] + " + " + nodes[idxn[1]]);
			if (nodes[idxn[0]] == "") {
				console.log("sending creat");
				$.ajax({
					type: "POST",
					url: BACKEND_URL + "/" + networkname +  "/node/",
					dataType: "json",
					success: function(e) {
						nodes[idxn[0]] = e.Id;
					},
				}).then(function() {
					initializeUpdater();
				});
			} else if (nodes[idxn[1]] == "" || nodes[idxn[1]] == undefined) {
				console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! setting up " + nodes[idxn[0]]);
				$.ajax({
					type: "PUT",
					crossDomain: true,
					url: BACKEND_URL + "/" + networkname +  "/node/",
					data: JSON.stringify({One: nodes[idxn[0]]}),
					dataType: "json",
				}).then(function() {
					initializeUpdater();
				});
			} else if (idxn[1] > -1) {
				console.log("sending conn " + nodes[idxn[0]] + " " + nodes[idxn[1]]);
				$.ajax({
					type: "PUT",
					crossDomain: true,
					url: BACKEND_URL + "/" + networkname +  "/node/",
					data: JSON.stringify({One: nodes[idxn[0]], Other: nodes[idxn[1]]}),
					dataType: "json",
				}).then(function() {
					initializeUpdater();
				});
			} else {
				setTimeout(initializeUpdater, 100);		
			}
	} else {
		setTimeout(initializeUpdater, 100);	
	}
	
}



function initializeVisualisationWithClass(networkname_){

            console.log("Initializing visualization");
            var self = this;

            this.visualisation 
                = window.visualisation 
                = new P2Pd3(d3.select("svg"));

            $.get(BACKEND_URL + '/' + networkname_ + "/").done(
              function(graph){
                console.log("Received graph data from backend");
                self.graphNodes = $(graph.add)
                    .filter(function(i,e){return e.group === 'nodes'})
                    .map(function(i,e){ 
					})
                    .toArray();

                self.graphLinks = $(graph.add)
                    .filter(function(i,e){return e.group === 'edges'})
                    .map(function(i,e){})
                    .toArray();
				    
                self.visualisation.initializeVisualisation(self.graphNodes,self.graphLinks);
				//logMessage("froom", "tooo", "12345", "bzzz");
                updateVisualisationWithClass(networkname_, 6000);
              },
              
              function(e){ console.log(e); }
            )
};


function updateVisualisationWithClass(networkname_, delay){

            var self = this;
            $.get(BACKEND_URL + '/' + networkname_ + "/").then(
                function(graph){
                    
                    var newNodes = $(graph.add)
                    .filter(function(i,e){return e.group === 'nodes'})
                    .map(function(i,e){ return {id: e.data.id, group: 1}; })
                    .toArray();

                    var newLinks = $(graph.add)
                    .filter(function(i,e){return e.group === 'edges'})
                    .map(function(i,e){ 
                        return {
                            source: e.data.source, 
                            target: e.data.target, 
                            group: 1,
                            value: i
                        };
                    })
                    .toArray();

                    var removeNodes = $(graph.remove)
                    .filter(function(i,e){return e.group === 'nodes'})
                    .map(function(i,e){ return {id: e.data.id, group: 1}; })
                    .toArray();

                    var removeLinks = $(graph.remove)
                    .filter(function(i,e){return e.group === 'edges'})
                    .map(function(i,e){ 
                        return {
                            source: e.data.source, 
                            target: e.data.target, 
                            group: 1,
                            value: i
                        };
                    })
                    .toArray();
					
					var triggerMsgs = $(graph.add)
                    .filter(function(i,e){return e.group === 'msgs'})
                    .map(function(i,e){ 
						summarysplit = /^type: ([0-9]+),(.+)/.exec(e.data.extra.Summary);
						subcode = parseInt(summarysplit[1], 10);
						logMessage(e.data.source, e.data.target, subcode, summarysplit[2]);
                        return {
                            source: e.data.source, 
                            target: e.data.target, 
                            group: 1,
                            value: i,
							code: e.data.extra.Code,
							subcode: subcode,
							summary: summarysplit[2],
                        };
                    })
                    .toArray();
                    
                    console.log("newnodes " + newNodes);
                    
                    for (var i = 0; i < newNodes.length; i++) {
						logMessage("Newnode: " + newNodes[i].id);
					}
					for (var i = 0; i < newLinks.length; i++) {
						logMessage("Newlink: " + newLinks[i].source  + " => " + newLinks[i].target);
					}
                   
                    
					self.visualisation.updateVisualisation(newNodes,newLinks,removeNodes,removeLinks,triggerMsgs);
					setTimeout(function() {updateVisualisationWithClass(networkname_, delay)}, delay);
                    
                },
                function(e){ console.log(e); }
            )

};

function logMessage(source, target, subcode, summary) {
	$("#" + logdivid).append("<div id='msg-target-source-" + new Date() + "'>Msg: " + source + " => " + target + ": (" + subcode + ") " + summary + "</div>");
}
