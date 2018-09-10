/**
* dataModel calling
* if $.modelTest not emty then test process: return $.modelTest[0] and delete it.
* @param string modulName
* @param string function Name
* @param string userKey
* @param string json oobject para for model function
* @param function(modelResultObj) success function
*/
$.modelTest = []; // array of test modelResultObj
$.modelTestI = 0;
$.model = function(modul, fName, userKey, param, successFun) {
	if ($.modelTestI < $.modelTest.length) {
		$.modelTestI++;
		successFun($.modelTest[$.modelTestI - 1]);
	} else {
		var modelParam = {"fName": fName, "userKey":userKey, "param": param};
	   $.post('/fn/'+modul+'/model',
		  		JSON.stringify(modelParam),
		  		function(modelResultStr) {
		  			var p = JSON.parse(modelResultStr);
		  			// sometimes json parse is not good
		  			if (typeof p !== "object") {
						if (p.includes('"status":')) {		  			
				  			successFun(JSON.parse(p));
				  		} else {
				  			successFun({"status":p});
				  		}	
		  			} else {
		  				successFun(p);
		  			}
		  		});
	}  		
}

/**
 * language translator object
 * can is  $.Lng.<TOKEN> = '....'; codes in moduls
 */ 
$.Lng = {
		"TOKEN":"token",
		"_": function(token) {
			/**
			 * translate one token
			 * @param string token
			 * @return string translated token
			 */ 
			var result = token;
			if (this[token] != undefined) {
				result = this[token];
			}
			return result;
		},
		"translator": function(container) {
			/**
			 * translate all span and option in one container
			 * @param string container selector
			 * @return void
			 */ 
			var i = 0;
			var txts = $(container+' span');
			if (txts.length > 0) {
				txts.each(function(i,txt) {
					$(this).html($.Lng._($(this).html()));
				});
			}
			var txts = $(container+' option');
			if (txts.length > 0) {
				txts.each(function(i,txt) {
					$(this).html($.Lng._($(this).html()));
				});
			}
			var txts = $(container+' a');
			if (txts.length > 0) {
				txts.each(function(i,txt) {
					$(this).html($.Lng._($(this).html()));
				});	
			}
			var txts = $(container+' button');
			if (txts.length > 0) {
				txts.each(function(i,txt) {
					$(this).attr('title',$.Lng._($(this).attr('title')));
				});
			}			
		}
};

/**
 * dynamic htm load
 * @param string container selector
 * @param string url
 * @param function
 * @return void	
 */ 
$.htmlLoad = function(container,url, fun) {
		$.get(url, function(data) {
			$(container).html(data);
			$.Lng.translator(container);
			if (fun != undefined) {
				fun();
			}	
		});
};

/**
 * cokie processing
 * source: https://www.quirksmode.org/js/cookies.html
 */
$.Cookie = { 
	createCookie: function(name, value, mins) {
		/**
		 * create one cookie
		 * @param string name of cookie
		 * @param string|number |bool value of cookie
		 * @param number expyre mins
		 * @return void
		 */ 
		var expires;
		if (mins) {
			var date = new Date();
			date.setTime(date.getTime() + (mins * 60 * 1000));
			expires = "; expires=" + date.toGMTString();
		} else {
			expires = "";
		}
		document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
	},

	readCookie: function(name) {
		/**
		 * read one cookie value
		 * @param string name of cookie
		 * @return string|number|bool value of cookie or null
		 */ 
		var nameEQ = encodeURIComponent(name) + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ')
				c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0)
				return decodeURIComponent(c.substring(nameEQ.length, c.length));
		}
		return null;
	},

	eraseCookie: function(name) {
		/**
		 * delete one cookie
		 * @param string name of cookie
		 * @return void
		 */ 
		this.createCookie(name, "", -1);
	}
}

/**
* popup modal dialogs alert msg and yesno
*/
$.Popup = {
	"yesfun":function() {},
	"msg": function(txt,className) {
		$('#popupModal .modal-body').html(txt);
		if (className != undefined) {
			$('#popupModal .modal-body').addClass(className);
		} else {
			$('#popupModal .modal-body').removeClass();
		}
		$('#popupModal .btnClose').show();
		$('#popupModal .btnYes').hide();
		$('#popupModal .btnNo').hide();
		$('#btnModalToggle').click();
	},
	"yesno":function(txt, yesfun) {
		this.yesfun = yesfun;
		$('#popupModal .modal-body').html(txt);
		$('#popupModal .modal-body').removeClass();
		$('#popupModal .btnClose').hide();
		$('#popupModal .btnYes').show();
		$('#popupModal .btnYes').click(function() {
			$.Popup.yesfun();
			$('#btnModalToggle').click();
		});
		$('#popupModal .btnNo').show();
		$('#btnModalToggle').click();
	}
}

/**
 * this function run in all modul when header load onready
 * - check user logged in?
 * - if logged in show content
 * - if not logged show login form
 */ 
$.loginProcess = function() {
  $("#btnLogin").click(function(event) {
	  //event.preventDefault();
	  var psw = $('#psw').val();
	  var par = {"action":"get", "psw":psw, "config":{}};
	  // check password
	  $.model('setup','admin',psw, par, function(modelResult) {
	  			if (modelResult.status == 'OK') {
					// psw correct
					$.userKey = psw; 
					$.Cookie.createCookie('userKey',$.userKey,20);
					$('#loginForm').hide();
					$('#content').show();
					$('#logoutMenuItem').show();
				} else {
					// psw incorrect
					$.Popup.msg($.Lng._(modelResult.status),'alert-danger');
					$('#loginForm').show();
					$('#content').hide();
					$('#logoutMenuItem').hide();
				}	  		
	  });
  });
    
  $('#logoutMenuItem a').click(function(event) {
		$.Cookie.eraseCookie('userKey');
		$('#loginForm').show();
		$('#logoutMenuItem').hide();
		$('#content').hide();
	 	return true;	
  });
  
  $.userKey = $.Cookie.readCookie('userKey');
  if ($.userKey == null) {
		$('#loginForm').show();
		$('#logoutMenuItem').hide();
		$('#content').hide();
  } else {
		$.Cookie.eraseCookie('userKey');	
		$.Cookie.createCookie('userKey',$.userKey,20);
		$('#loginForm').hide();
		$('#logoutMenuItem').show();
		$('#content').show();
		$.modulIni();
  }
};
 	
// initfunction  http://.....#pname/value/pname/value....  process
// into $.params
var href = window.location.href;
var i = href.indexOf('#');
$.params = {};
if (i > 0) {
			  var segments = href.split('#');
			  var segments2 = segments[1].split('/');
			  if (segments2.length > 1) {
				for (i = 0; i < segments2.length; i = i + 2) {
					$.params[segments2[i]] = encodeURI(segments2[i+1]);
			    }
			  }
}	
	
 


