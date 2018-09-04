$(document).ready(function() {
	$.Lng.translator('body');	
	$.htmlLoad('#header','../header.html', function() {
		$("#configMenuItem").addClass('active');
		$.loginProcess();
	});	
	//$.htmlLoad('#leftbar','./leftbar.html');
	//$.htmlLoad('#rightbar','./rightbar.html');
	$.htmlLoad('#footer','./footer.html');

	// event handlers
	
	$('#btnConfig').click(function(event) {
		if ($('#oldpsw').val() == $.userKey) {
			if ($('#newpsw').val() == $('#newpsw2').val()) {			
				var config = {"id":1,"recType":"config"};
				if ($('#newpsw').val() != '') {
					config.psw = $('#newpsw').val();
				} else {
					config.psw = $.userKey;			
				}	
				config.enabled = $('#enabled').val().split("\n");
				var param = {"psw":$.userKey, "action":"set", "config":config};
				$.model('setup','admin',$.userKey, param, function(modelResultObj)  {
				  			$.userKey = config.psw;	
				  			$.Cookie.createCookie('userKey',$.userKey, 20);  		
				  			$.Popup.msg(modelResultObj.status);
				});
			} else {
				$.Popup.msg($.Lng._('PASSWORDS_NOT_EQUAL'),'alert-danger');
			}
		} else {
  			$.Popup.msg($.Lng._('WRONG_PASSWORD'), 'alert-danger');	  		
		}
		return true;	
  });
	
});	

$.modulIni = function() {
	var param = {"psw":$.userKey, "action":"get", "config":{}};
	$.model('setup','admin',$.userKey, param, function(modelResultObj)  {
  			var config = modelResultObj.config;
			var s = '';
			var i = 0;
			if (config.enabled.length == 0) {
				config.enabled.push('dna_hash_0');			
				config.enabled.push('dna_hash_1');			
			}
			for (i=0; i < config.enabled.length; i++) {
				s += config.enabled[i]+"\n";			
			}				  				  		
			$('#enabled').val(s);
	});
}