
$.modulIni = function() {
}

$(document).ready(function() {
	$.Lng.translator('body');	
	$.htmlLoad('#header','../header.html', function() {
		$("#callerMenuItem").addClass('active');
		$.loginProcess();
	});
	//$.htmlLoad('#rightbar','./rightbar.html');
	$.htmlLoad('#footer','../footer.html');
	
	// event  triggers
   $("#btnSend").click(function() {
        //event.preventDefault();
        // clear exists result display
		$('#result').html('waiting...');
		var fName = $('#fName').val();
		var sParam = $('#param').val();
		var param = JSON.parse(sParam);
		$.model('caller',fName, $.userKey, param, function(modelResultObj) {
			$('#result').val(JSON.stringify(modelResultObj));
		});
	  });
});
