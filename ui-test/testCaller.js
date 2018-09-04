
require('./testFramework.js');
require('../ui/main.js');
require('../ui/caller/caller.js');
require('../ui/caller/callerLng.js');
$.modulIni();
var test = new Test();
test.start('caller test').
testItem('addRecord').
	formSet('#fName','addRecord').
	formSet('#param','{"id":0,"recType":"test","title":"1"}').
	modelResult({"status":"OK"}).
	run($("#btnSend").clickFun).
	assertEqual('#result',{"status":"OK"}).
testItem('getRecord').
	formSet('#fName','getRecord').
	formSet('#param','{"id":1,"recType":"test"}').
	modelResult({"status":"OK", "record":{"id":1, "recType":"test", "title":"11"}}).
	run($("#btnSend").clickFun).
	assertEqual('#result',{"status":"OK", "record":{"id":1, "recType":"test", "title":"11"}}).
testItem('login OK').
	formSet('#psw','123456').
	modelResult({"status":"OK"}).
	run($("#btnLogin").clickFun).
	assertHide('#loginForm').
testItem('logout').
	run($("#logoutMenuItem a").clickFun).
	assertShow('#loginForm').
testItem('login incorreect password').
	formSet('#psw','sdsdsdsd').
	modelResult({"status":"ACCESS_VIOLATION"}).
	run($("#btnLogin").clickFun).
	assertShow('#loginForm').
stop();

