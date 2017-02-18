// startcolor and endcolor in 3 element array 8bit
// step is float 0-1.0
function colorStep(startcolor, endcolor, step) { 
	var val = 0;
	
	val += (endcolor[0] + parseInt((startcolor[0] - endcolor[0]) * step)) << 16;
	val += (endcolor[1] + parseInt((startcolor[1] - endcolor[1]) * step)) << 8;
	val += (endcolor[2] + parseInt((startcolor[2] - endcolor[2]) * step));
	
	return val.toString(16)
			
}

function fadeColor(lineobj, fromcolor, tocolor, level, step, delay, graphindex) {
	
	var colorhex = colorStep(fromcolor, tocolor, level);
	for (var i = 0; i < 6 - colorhex.length; i++) {
		colorhex = "0" + colorhex;
	}
	
	lineobj.attr("stroke", "#" + colorhex);
	if (level > 0.0) {
		setTimeout(function() {fadeColor(lineobj, fromcolor, tocolor, level, step, delay, graphindex)}, delay);
	} else {
		// maybe delete msg from graphindex?
	}
	level -= step;
} 
