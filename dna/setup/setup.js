/*******************************************************************************
 * Utility functions
 ******************************************************************************/

function genesis () {
  return true;
}

/**
 * bridge init function
 */ 
function bridgeGenesis(side,dna,appData) {
  return true;
}

function validateCommit (entryType, entry, header, pkg, sources) {
  return true;
}

function validatePut (entryType, entry, header, pkg, sources) {
  return true;
}

function validateDel (entryType, hash, pkg, sources) {
  return true;
}

function validatePutPkg (entryType) {
  return null;
}

function validateModPkg (entryType) {
  return null;
}

function validateDelPkg (entryType) {
  return null;
}

/**
* check user access right
* @param string function Name
* @param object param for function
* @param string userKey
* @reeturn bool
*/
function accessRight(fName, param, userKey) {
	// This function now check only userKey. 
	// Usually the "fName" and "param" are also considered. 
	var bridges = getBridges();
	var res = bridge(bridges[0].CalleeApp, 'storage', 'admin',
		 {"action":"get","psw":userKey, "config":{}});
	// sometimes res not object
	if (typeof res !== "object") {
		res = JSON.parse(res);	
	}
	return (res.status == 'OK');	 	
}

/**
 * data model
 * @param string '{"fName":"...", "userKey:"...", param":{....}}'
 * @return string '{function_result}'
 */ 
function model(param) {
	var bridges = getBridges();
	var p = JSON.parse(param);
	if (accessRight(p.Fname, p.param,p.userKey)) {
		var result = bridge(bridges[0].CalleeApp, 'storage', p.fName, p.param);
		if (typeof result == 'object') {	
			return JSON.stringify(result);
		} else {
			return result;		
		}	
	} else {
		return '{"status":"ACCESS_VIOLATION"}';
	}	
}

