var midiqueue = [];

function initializePoller() {
	setInterval(poll, 500);
}

function poll() {
	$.ajax({
      url: "http://localhost:8889",
      data: "",
      success: pollsuccess,
      dataType: "text",
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
		console.log("midi data received: " + r, 2);
		for (var i = 0; i < e.length; i += 3) {
			if (e.charCodeAt(i) == 1) {
				/*if (e.charCodeAt(i + 1) == 1) {
					$("#dialvalue").val(e.charCodeAt(i + 2));
				}*/
				midiqueue.push(e.charCodeAt(i + 1));
			}
		}
	}
}

function midiNext() {
	return midiqueue.shift();
}
