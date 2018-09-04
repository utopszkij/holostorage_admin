
require('./testFramework.js');
require('../ui/main.js');
require('../ui/datamanager/datamanager.js');
require('../ui/datamanager/datamanagerLng.js');

$.userKey = '123456';
$.modulIni();

var test = new Test();
test.start('datamanager test').
testItem('recType click').
	modelResult({"status":"OK","total":2, "records":[[1],[2]]}).
	modelResult({"status":"OK","record":{"id":1,"recType":"test","title":"T1"}}).
	modelResult({"status":"OK","record":{"id":1,"recType":"test","title":"T1"}}).
	modelResult({"status":"OK","record":{"id":2,"recType":"test","title":"T2"}}).
	formSet('#recType','test').
	formSet('#filterStr','').
	formSet('#filtervalue','').
	run($("#btnRecType").clickFun).
	assertEqual('#total',2).
	assertEqual("thead tr",'<th class="colIcons"></th><th class="th ordered" id="oid"><i class="fa fa-angle-down"></i>id</th><th class="th" id="orecType">recType</th><th class="th" id="otitle">title</th>').
testItem('btnEdit click').
	modelResult({"status":"OK","record":{"id":1,"recType":"test","title":"T111"}}).
	formSet('#recType','test').
	formSet('#filterStr','').
	formSet('#filtervalue','').
	run($(".btnEdit").clickFun).
	assertShow('#dataForm').
testItem('btnAdd click').
	formSet('#recType','test').
	formSet('#filterStr','').
	formSet('#filtervalue','').
	run($("#btnAddClick").clickFun).
	assertShow('#dataForm').
testItem('btnDelete click').
	modelResult({"status":"OK","total":0, "records":[]}).
	formSet('#recType','test').
	formSet('#filterStr','').
	formSet('#filtervalue','').
	run($(".btnDelete").clickFun).
	assertHide('#dataForm').
testItem('btnPagination click').
	modelResult({"status":"OK","total":0, "records":[]}).
	formSet('#recType','test').
	formSet('#filterStr','').
	formSet('#filtervalue','').
	run($(".btnPagination").clickFun).
	assertHide('#dataForm').
testItem('th click').
	modelResult({"status":"OK","total":0, "records":[]}).
	formSet('#recType','test').
	formSet('#filterStr','').
	formSet('#filtervalue','').
	run($("th.th").clickFun).
	assertHide('#dataForm').
testItem('btnDataOK click').
	modelResult({"status":"OK", "newId":5}).
	modelResult({"status":"OK","total":0, "records":[]}).
	formSet('#record','{"id":0, "recType":"test", "title":"5"}').
	formSet('#recType','test').
	formSet('#filterStr','').
	formSet('#filtervalue','').
	run($("#btnDataOK").clickFun).
	assertHide('#dataForm').
testItem('btnDataCancel click').
	modelResult({"status":"OK","total":0, "records":[]}).
	formSet('#recType','test').
	formSet('#filterStr','').
	formSet('#filtervalue','').
	run($("#btnDataCancel").clickFun).
	assertHide('#dataForm').
stop();

