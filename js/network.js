var BACKEND_URL='http://127.0.0.1:8888'; // our sim server
var networkname = "meta"; // what to call the REST entry point
var logdivid = "";
	
	
function initializeServer(logdivid_){
		if (logdivid_ != "") {
			logdivid = logdivid_;
		}
		initializeVisualisationWithClass(networkname);

};

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
				logMessage("froom", "tooo", "12345", "bzzz");
                updateVisualisationWithClass(networkname_, 500);
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
                    
                    
					self.visualisation.updateVisualisation(newNodes,newLinks,removeNodes,removeLinks,triggerMsgs);
					setTimeout(function() {updateVisualisationWithClass(networkname_, delay)}, delay);
                    
                },
                function(e){ console.log(e); }
            )

};

function logMessage(source, target, subcode, summary) {
	$("#" + logdivid).append("<div id='msg-target-source-" + new Date() + "'>Msg: " + source + " => " + target + ": (" + subcode + ") " + summary + "</div>");
}
