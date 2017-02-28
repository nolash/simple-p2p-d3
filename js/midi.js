var midiqueue = new Array();

function initializePoller() {
	setInterval(poll, 250);
}

function poll() {
	$.ajax({
      url: "http://localhost:8889",
      data: "",
      dataType: "text",
      success: pollsuccess,
    });
}

function pollsuccess(e) {
	var r = "";
	if (e != "") {
		for (var i = 0; i < e.length; i++) {
			if (i > 0)
				r = r + ",";
			r = r + e.charCodeAt(i);
		}
		//console.log("midi data received: " + r, 2);
		for (var i = 0; i < e.length; i += 3) {
			if (e.charCodeAt(i) == 1) {
				/*if (e.charCodeAt(i + 1) == 1) {
					$("#dialvalue").val(e.charCodeAt(i + 2));
				}*/
				var item = [e.charCodeAt(i + 1), e.charCodeAt(i + 2)];
				midiqueue.push(item);
			}
		}
	}
}

function midiNext() {
	return midiqueue.shift();
}
