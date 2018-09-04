/*
* test framework 
* JQuery and $.model mock    
*     
*/

// test jQuery
global.document = {"cookie":""};
global.window = {"location":{"href":""}};
global.JQ = [];
function JQobj() {
	this.content ='';
	this.htmlContent = '';
	this.clickFun = function() {};
	this.showStatus = true;
	this.className = '';
	this.attrs = [];
	
	this.val = function(v) {
		var result = '';
		if (v == undefined) {
			result = this.content;
		} else {
			this.content = v;
		}
		return result;	
	};
	this.attr = function(aName,v) {
		var result = '';
		if (v == undefined) {
			result = this.attrs[aName];
		} else {
			this.attrs[aName] = v;
		}
		return result;	
	};
	this.show = function() {
		this.showStatus = true;
	};
	this.hide = function() {
		this.showStatus = false;
	};
	this.toggle = function() {
		this.showStatus = !this.showStatus;
	};
	this.ready = function(fun) {
		fun();
	};
	this.html = function(s) {
		var result = '';
		if (s == undefined) {
			result = this.htmlContent;
		} else {
			this.htmlContent = s;
		}
		return result;	
	};
	this.click = function(fun) {
		if (fun == undefined) {
			result = this.clickFun();
		} else {
			this.clickFun = fun;
			result = true;
		}
		return result;	
	};
	this.addClass = function(s) {
		this.className = s;
	};
	this.removeClass = function(s) {
		this.className = '';
	}
};
global.$ = {}; 
global.$ = function(selector) {
	if (global.JQ[selector] == undefined) {
			global.JQ[selector] = new JQobj();
	}
	return global.JQ[selector];
}
$.get = function(url,fun) {
	fun();
};
$.each = function(pobj, fun) {
	$.eachFun = fun;
	Object.keys(pobj).forEach(function(key) {
		$.eachFun(key, Object.keys(pobj)[key]);
	});
};

// test processor
global.$.modelTest = [];
global.Test = function() {
	this.testTitle="";
	this.result=true;
	this.itemResult=true;
	this.msg="";
	this.checks=[];
	this.start = function(title) {
		this.testTitle = title;
		console.log('====================================');
		console.log(title + ' start');	
		console.log(' ');
		return this;
	};
	this.checkProcess=function(check) {
		var s = $(check.selector).content;
		if (s=='') {
			s = $(check.selector).htmlContent;
		}
		if (check.rel == 'EQ') {
			if (s != check.value) {
				this.result = false;
				this.msg += "not EQ\nexcepted="+check.value+
					"\nactual="+s+"\n";
				this.itemResult = false;	
			}
		}	
		if (check.rel == 'GT') {
			if (s <= check.value) {
				this.result = false;
				this.msg += "not GT\nexcepted="+check.value+
					"\nactual="+s+"\n";
				this.itemResult = false;	
			}
		}	
		if (check.rel == 'LT') {
			if (s >= check.value) {
				this.result = false;
				this.msg += "not LT\nexcepted="+check.value+
					"\nactual="+s+"\n";
				this.itemResult = false;	
			}
		}	
		if (check.rel == 'INCLUDE') {
			if (s.indexOf(check.value) < 0) {
				this.result = false;
				this.msg += "not Include\nexcepted="+check.value+
					"\nactual="+s+"\n";
				this.itemResult = false;	
			}
		}	
		if (check.rel == 'HIDE') {
			if ($(check.selector).showStatus != false) {
				this.result = false;
				this.msg += "not Hide "+check.selector+"\n";
				this.itemResult = false;	
			}
		}	
		if (check.rel == 'SHOW') {
			if ($(check.selector).showStatus != true) {
				this.result = false;
				this.msg += "not Show "+check.selector+"\n";
				this.itemResult = false;	
			}
		}	
		
		return this;
	};
	this.testItem = function(desc) {
		this.testItemEnd();
		console.log(desc);
		return this;
	};
	this.testItemEnd = function() {
		if (this.checks.length > 0) {
			var i = 0;
			for (i=0; i<this.checks.length; i++) {
				this.checkProcess(this.checks[i]);
			}
			if (this.itemResult) {
				console.log(   "OK\n------------------------------------");
			} else {
				console.log(this.msg);
				console.log("Failer\n------------------------------------");
			}
		}
		this.msg = "";
		this.checks = [];
		this.itemResult = true;
	};
	this.assertEqual=function(selector, pvalue) {
		if (typeof pvalue == "object") {
			var v = JSON.stringify(pvalue);
		} else {
			var v = pvalue;
		}
		this.checks.push({"selector":selector, "rel":"EQ", "value":v});
		return this;
	};
	this.assertGT=function(selector, pvalue) {
		if (typeof pvalue == "object") {
			var v = JSON.stringify(pvalue);
		} else {
			var v = pvalue;
		}
		this.checks.push({"selector":selector, "rel":"GT", "value":v});
		return this;
	};
	this.assertLT=function(selector, pvalue) {
		if (typeof pvalue == "object") {
			var v = JSON.stringify(pvalue);
		} else {
			var v = pvalue;
		}
		this.checks.push({"selector":selector, "rel":"LT", "value":v});
		return this;
	};
	this.assertInclude=function(selector, pvalue) {
		if (typeof pvalue == "object") {
			var v = JSON.stringify(pvalue);
		} else {
			var v = pvalue;
		}
		this.checks.push({"selector":selector, "rel":"INCLUDE", "value":v});
		return this;
	};
	this.assertShow=function(selector) {
		this.checks.push({"selector":selector, "rel":"SHOW", "value":""});
		return this;
	};
	this.assertHide=function(selector) {
		this.checks.push({"selector":selector, "rel":"HIDE", "value":""});
		return this;
	};
	this.formSet= function(selector, value) {
		global.$(selector).val(value);
		return this;	
	};
	this.modelResult= function(value) {
		global.$.modelTest.push(value);
		return this;	
	};
	this.run=function(fun) {
		fun();
		return this;
	};
	this.stop=function() {
		this.testItemEnd();
		var exitCode = 0;
		if (this.result) {
			console.log(' ');
			console.log(this.testTitle+' end: OK');
			console.log('====================================');
		} else {
			console.log(' ');
			console.log(this.testTitle+' end: Failer');
			console.log('====================================');
			exitCode = 1;
		}
		console.log(' ');
		console.log(' ');
		process.exit(exitCode);
		return this;
	}
};


