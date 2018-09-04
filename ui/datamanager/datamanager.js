/**
* echo table head tr into $('thead tr')
* @param object {total: number, records:[[id,recType], ...}
* @param array of string fieldNames
* @inputGlobals $.orderField, $.orderDir
* @outputGlobals $.select, $.tr, $tri
* @return void,
*/
function echoTableHeader(result) {
		if (result.records.length > 0) {
			var id0 = result.records[0][0];
			var recType = result.records[result.records.length - 1][1];
			// read record by id --> result0 			
			var par = {"recType":recType, "id":id0};
			$.model('datamanager','getRecord', $.userKey, par, function(result0) {
				var thClass = 'th';
				var oderIcon = '';
				$.tr='<th class="colIcons"></th>';
				$.tri = 1;
				$.select = [];
				$.each(result0.record, function(fieldName, fieldValue) {
					$.select.push(fieldName);
					if ($.tri <= 5) {
						if (fieldName == $.orderField) {
							thClass = 'th ordered';
							if ($.orderDir == 'ASC') {
								orderIcon = '<i class="fa fa-angle-down"></i>';
							} else {
								orderIcon = '<i class="fa fa-angle-up"></i>';
							}
						} else {
							thClass = 'th';
							orderIcon = '';
						}
						$.tr += '<th class="'+thClass+'" id="o'+fieldName+'">'+orderIcon+fieldName+'</th>';
					}
					$.tri++;
				});
			});
			$('thead tr').html($.tr);			
		}
}

/**
* echo table body into $('tbody')
* @param object {records:[[id, recType],...]}
* @inputGlobals $.select
* @outputGlobals $.tr
* @return void
*/
function echoTableBody(result) {
		if (result.records.length > 0) {
			for(var i=0; i < result.records.length; i++) {
				var id0 = result.records[i][0];
				var recType = result.records[i][1];
				// read record by id --> result0 			
				var par = {"recType":recType, "id":id0};
				$.model('datamanager','getRecord', $.userKey, par, function(result0) {
					$.tr='';
					var record = result0.record;
					$.tr = '<tr><td class="colIcons">';
					$.tr += '<a href="#" class="btnEdit btn" title="EDIT" id="'+record.id+'"><i class="fa fa-edit"></i>&nbsp;';
					$.tr += '<a href="#"class="btnDelete btn" title="DELETE" id="'+record.id+'"><i class="fa fa-eraser"></i>&nbsp;';
					$.tr += '</td>';
					$.tri = 1;
					for (i=0; (i<$.select.length) && (i <= 5); i++) {
							$.tr += '<td>'+result0.record[$.select[i]]+'</td>';
					}
					$.tr += '</tr>';
					$('tbody').html($('tbody').html()+$.tr);			
				});	
			}
		}
}

/**
* echo table pagination line into $('ul#pagination')
* @param object {total:number,...}
* @globals: $.tableOffset
* @return void
*/
function echoPagination(result) {				
		var page = 1;
		var s = '';
		var offset = 0;
		if ($.tableOffset > 0) {
			$('#pagination').html('');
			s = '<li><a href="#" title="FIRST" class="btnPagination" id="p0"><i class="fa fa-fast-backward"></i></a></li>';
			s += '<li><a href="#" title="PREVIOS" class="btnPagination" id="p'+($.tableOffset - 20)+'"><i class="fa fa-caret-left"></i></a></li>';
		}
		if (($.tableOffset - 80) > 0){
			s += '<li class="disabled"><a href="#">...</a></li>';				
		}
		for (offset = 0; offset < result.total; offset = offset + 20) {
			if ((offset > $.tableOffset - 80) && (offset < $.tableOffset + 80)) {
				if (offset == $.tableOffset) {
				  s += '<li class="disabled"><a href="#">'+page+'</a></li>';
				} else {
				  s += '<li><a href="#" class="btnPagination" id="p'+offset+'">'+page+'</a></li>';
				}
			}
			page++;
		}
		offset = offset - 20; // last page offset
		if (($.tableOffset + 80) < result.total) {
			s += '<li class="disabled"><a href="#">...</a></li>';				
		}
		if ($.tableOffset < offset) {
			s += '<li><a href="#" title="NEXT" class="btnPagination" id="p'+($.tableOffset + 20)+'"><i class="fa fa-caret-right"></i></a></li>';
			s += '<li><a href="#" title="LAST" class="btnPagination" id="p'+offset+'"><i class="fa fa-fast-forward"></i></a></li>';
		
		}
		$('#pagination').html(s);
}				

/**
* load and echo browser table and pagination
* into $('thead') + $('tbody') + + $('total' + $('ul#pagination')
* @inputGlobals $.tableOffset, $.orderField, $.orderDir
* @outputGlobals $.tr, $.tri
* @input from screen rectype, filterStr, filterField
* @return void
*/
function loadBrowserTable() {
// create browser table into #browserTable
	var recType = $('#recType').val();
	if (recType == '') {
		$.Popup.msg($.Lng._('RECTYPE_REQUED'),'alert-danger');
		return;	
	}
	
	
	var filterStr = $('#filterStr').val();
	var filterField = $('#filterField').val();
	var where = "id > 0";
	if ((filterField != "") && (filterStr != "")) {
		where = '(id > 0) AND ('+filterName+' = REGEXP("'+filterStr+'"))';		
	}
	var param = {"select":["id","recType"],
				"from":recType,
				"where":where,
				"oder":[$.orderField,$.orderDir],
				"limit":[$.tableOffset,20]
	};
	$.model('datamanager','query', $.userKey, param, function(result) {
			if (result.status != 'OK') {
					$.Popup.alert(result.status);
				}
				// echo result into display
				$('thead tr').html('');
				$('tbody').html('');
				$('#pagination').html('');  
				$('#total').val(result.total);
				if (result.total == 0) {
					$('#noresult').show();				
				} else {
					$('#noresult').hide();				
				}
				// echo header
				echoTableHeader(result);
				// echo total
				$('#total').html(result.total);
				// echo table
				echoTableBody(result); 
				// echo pagination
				echoPagination(result);
	});
} // loadBrowserTable

$(document).ready(function() {
	$.Lng.translator('body');	
	$.htmlLoad('#header','../header.html', function() {
		$("#dataManagerMenuItem").addClass('active');
		$.loginProcess();
	});
	//$.htmlLoad('#leftbar','./leftbar.html');
	//$.htmlLoad('#rightbar','./rightbar.html');
	$.htmlLoad('#footer','../footer.html');
				
	// event  triggers

    $("#btnRecType").click(function(event){
		var recType = $('#recType').val();
		$.tableOffset = 0;
		loadBrowserTable();
	});
	
    $(".btnEdit").click(function(event){
		// this.attr('id') is record.id
		var recType = $('#recType').val();
		var id = $(this).attr('id');		
		// read record into textarea.#record
		var param = {"recType":recType, "id":id};
		$.model('datamanager','getRecord', $.userKey, param, function(result) {
					if (result.status == 'OK') {
						$('#record').val(JSON.stringify(result.record));
					} else {
						$.Popup.msg(result.status);
					}
		});
		$('#browserForm').hide();
		$('#dataForm').show();
	});
	
    $(".btnDelete").click(function(event){
		// this.attr('id') is record.id
		var recType = $('#recType').val();
		var id = $(this).attr('id');		
		// delete record
		var param = {"recType":recType, "id":id};
		$.model('datamanager','deleteRecord', $.userKey, param, function(result) {
				$.Popup.msg(result.status);
		});
		$.tableOffset = 0;
		loadBrowserTable();
		$('#browserForm').show();
		$('#dataForm').hide();
	});
	
    $("#btnAdd").click(function(event){
		var recType = $('#recType').val();
		$('#record').val('{"recType":"'+recType+'", "id":0}');
		loadBrowserTable();
		$('#browserForm').hide();
		$('#dataForm').show();
	});
	  
    $(".btnPagination").click(function(event){
		// this.attr('id') is 'p'+pageNo (first:p1)
		if ($(this).attr('id') != undefined) {
			var p = Number($(this).attr('id').substring(1,10));
		} else {
			var p = 1;		
		}	
		$.tableOffset = p - 1;
		loadBrowserTable();
	});

   $("th.th").click(function(event){
		// this.attr('i') is 'o'+fieldname
		if ($(this).attr('id') != undefined) {
			var o = Number($(this).attr('id').substring(1,10));
		} else {
			var o = 0;		
		}	
		if (o == $.orderField) {
			$.orderField = o;
			$.orderDir = 'ASC';
			$.tableOffset = 0;
		} else {
			if ($.orderDir == 'ASC') {
				$.orderDir = 'DESC';
			} else {
				$.orderDir = 'ASC';
			}
			$.tableOffset = 0;
		}
		loadBrowserTable();
	});
	

   $("#btnDataOK").click(function(event){
		// save record from textarea.#record
		var record = JSON.parse($('#record').val());
		var recType = record.recType;
		if (record.id == 0) {
			var Fname = 'addRecord';
		} else {
			var fName = 'updateRecord';
		}
		$.model('datamanager',fName, $.userKey, record, function(result) {
					if (result.status == 'OK') {
						loadBrowserTable(recType, $.tableOffset, 20);
						$('#browserForm').show();
						$('#dataForm').hide();
					} else {
						$.Popup.alert(result.status);
						loadBrowserTable();
						$('#browserForm').show();
						$('#dataForm').hide();
					}
		});
	});
	
   $("#btnDataCANCEL").click(function(event){
		loadBrowserTable();
		$('#browserForm').show();
		$('#dataForm').hide();
	});
	
   $("#btnFilter").click(function(event){
   	$.tableOffset = 0;
		loadBrowserTable();
		$('#browserForm').show();
		$('#dataForm').hide();
	});
	
   $("#btnFilterErase").click(function(event){
   	$.tableOffset = 0;
   	$('#filterField').val('');
   	$('#filterStr').val('');
		loadBrowserTable();
		$('#browserForm').show();
		$('#dataForm').hide();
	});
	
}); // document ready

$.modulIni = function() {
	$.tableOffset = 0;
	$.orderField = 'id';
	$.orderDir = 'ASC';
}


