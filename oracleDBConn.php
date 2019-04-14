
<?php
// Global variables
// When project is migrated these will probably change
$tableOwner = "mjk29";
$inventoryTableName = "inventory";
$transactionTableName = "TRANSACTION";
// Will need to change image directory in additem image processing area
$imageDirectory = "../cap/images/";
$datasheetDirectory = "../cap/datasheets/";


// $conn doesnt work as global
$conn = oracle_connect();
// Test for printing post data
// print_r($_POST);

$postype = $_POST["POSTTYPE"];

switch ($postype) {
	// creates tsv file for download
	case "downloadTSV":
		downloadTSV($conn);
		break;

	// Switches the transaction to completed
	case "updateTransaction":
		updateTransaction($conn);
		break;

	// Not yet implemented
	case "updateItem":
		updateItem($conn);
		break;

	// Add Transaction
	case "addTransaction":
		addTransaction($conn);
		break;

	// Query for pending Tx
	case "queryPending":
		queryPending($conn);
		break;

	// Get item price for cart
    case "cartdata":
		getCartData($conn);
        break;

    // Insert new item to table
    case "item":
        insertItem($conn);
        break;

    // Upload spreadsheet
    case "tsvItem":
        uploadTSVFile($conn);
        break;

	// Get all iteme from inventroy
	case "getAll":
        getAllItems($conn);
        break;

    // Search for items in inventory
    case "search":
        searchForItems($conn);
        break;
}


function downloadTSV($conn){
	// echo "DownloadTSV";
	// echo "https://web.njit.edu/~mjk29/cap/images/breadboardPowerSupply.jpg";
	// Get all inventory data
	// Seperate all cols with \t
	// First line is col names
	// Every line after that is row data
	$tsvFile = fopen("inventoryTSV.tsv", "w");


	$string = "SELECT * FROM ".$GLOBALS['tableOwner'].".".$GLOBALS['inventoryTableName'].
		" ORDER BY DATEADDED DESC";

	$statement = oci_parse($conn, $string);
	$r = oci_execute($statement);
	// Error reporting
	if (!$r) {
		$e = oci_error($statement);
		trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
	}
	// Collect the query data into an array
	$ncols = oci_num_fields($statement)-1;

	for ($i = 1; $i <= $ncols; $i++) {
	    $column_name  = oci_field_name($statement, $i);
	    if ($i < $ncols) {
	    	$column_name.="\t";
	    }
		fwrite($tsvFile, $column_name);
	}
	while (($row = oci_fetch_row($statement)) != false) {
		fwrite($tsvFile, "\n");
	    for ($i=0; $i <= $ncols-1; $i++) { 
	    	// echo $ncols."\n";
	    	fwrite($tsvFile, $row[$i]);
	    	if ($i < $ncols-1) {
				fwrite($tsvFile,"\t");
	    	}
	    }
	}
	fclose($tsvFile);
	echo "inventoryTSV.tsv";
}

function updateTransaction($conn){
	// This gets itemdata col from txid, then updates the items in inventory table
	// Use TX ID to get transaction data from DB
	$txItemData = "SELECT  ITEMDATA FROM ".$GLOBALS['tableOwner']."."
	.$GLOBALS['transactionTableName'].
	" WHERE TRANSACTIONID='".$_POST["transactionID"]."'";
	$statement = oci_parse($conn, $txItemData);
	$r = oci_execute($statement);

	// Store item data in var then decode
	$itemDataFromDB = oci_fetch_array($statement, OCI_ASSOC+OCI_RETURN_NULLS);
	$decodedItemData = json_decode($itemDataFromDB["ITEMDATA"]);
	
	// Start string for multi query 
	$string = "BEGIN ";
	foreach ($decodedItemData as $cartItem) {
		$string.= "UPDATE ".$GLOBALS['tableOwner'].".".$GLOBALS['inventoryTableName'].
		" SET  AVAILABILITY=AVAILABILITY+".$cartItem->{"CHECKEDOUT"}.
		" WHERE SKU='".$cartItem->{"SKU"}."';";
	}
	// This closes the transaction
	// Setup string for transaction table
	$string .= " UPDATE ". $GLOBALS['tableOwner'].".".$GLOBALS['transactionTableName'].
	" SET  PROCESSED='1' WHERE TRANSACTIONID='".$_POST["transactionID"]."'; END;";

	echo $string;
	$statement = oci_parse($conn, $string);
	// Execute tx table statement,
	$r2 = oci_execute($statement);
	// Error reporting
	if (!$r2) {
		$e = oci_error($statement);
		trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
	}

	else{
		$result = array('result' => 'success');
		echo json_encode($result);
		return;
	}

}




function updateItem($conn){
	echo "update Item";
}


// Adding transactions to transaction table
function addTransaction($conn){
	// Get item data and decode
	$itemDataArray = $_POST["ITEMDATA"];
	$decodedItemData = json_decode($itemDataArray);	
	// start sql statement
	$sendString = 
		"BEGIN INSERT INTO ". $GLOBALS['tableOwner'].".".$GLOBALS['transactionTableName']."
		(TRANSACTIONID, UCID, SUBTOTAL, ITEMDATA, TIMESTAMP)
		VALUES(
		TX_ID.NEXTVAL,
		:UCID,
		:SUBTOTAL,
		:ITEMDATA,
		SYSDATE
		);";

	// add item update to statement
	foreach ($decodedItemData as $cartItem) {
		$sendString.= "UPDATE ".$GLOBALS['tableOwner'].".".$GLOBALS['inventoryTableName'].
		" SET  AVAILABILITY=AVAILABILITY-".$cartItem->{"CHECKEDOUT"}.
		" WHERE SKU='".$cartItem->{"SKU"}."';";
	}
	$sendString.=" END;";
	// Parse and bind user inputs
	$statement = oci_parse($conn, $sendString);
	oci_bind_by_name($statement, ':UCID', $_POST["STUDENTID"]);
	oci_bind_by_name($statement, ':SUBTOTAL', $_POST["SUBTOTAL"]);
	oci_bind_by_name($statement, ':ITEMDATA', $itemDataArray);

	$r = oci_execute($statement);
	// Error reporting
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
	if (!$r) {
		$e = oci_error($statement);
		trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
	}
	else{
		// If successful, send email
		$emailMessage = "Your order has been successfully created\n".
		"Student ID : ".$_POST["STUDENTID"]." \nSUBTOTAL : ".$_POST["SUBTOTAL"]."\n";
		foreach ($decodedItemData as $cartItem) {
			$emailMessage.= 
			"----------------------------------------\n".
			"Item Name  : ".$cartItem->{"ITEMNAME"}."\n".
			"Item Price : ".$cartItem->{"PRICE"}."\n".
			"Quantity   : ".$cartItem->{"CHECKEDOUT"}."\n";
		}
		$emailMessage.="-----------------------------------------\n".
		"\n\nThis is an automated message, do not reply to this address";

		$emailTo      = $_POST["EMAIL"];
		$subject = 'NIT CoAD Electroncis Lab Receipt';
		$message = $emailMessage;
		$headers = 'From: CoAD_ElectronicsLab' . "\r\n" .
		   'Reply-To:doNotReplyToThisEmail' . "\r\n" .
		   'X-Mailer: PHP/' . phpversion();
		mail($emailTo, $subject, $message, $headers);
	}
}





function queryPending($conn){
	// echo "get Pending";

	$string = "SELECT * FROM ".$GLOBALS['tableOwner'].".".$GLOBALS['transactionTableName'].
		" WHERE PROCESSED= ".$_POST["PENDING"]." ORDER BY TRANSACTIONID DESC";
	
	//$string = "SELECT * FROM mjk29.TRANSACTION WHERE PROCESSED = 1 ORDER BY TRANSACTIONID DESC";

	// echo $string;

	$statement = oci_parse($conn, $string);

	$r = oci_execute($statement);
	// Error reporting
	if (!$r) {
		$e = oci_error($statement);
		trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
	}
	// Collect the query data into an array
	$sendArray = [];
	while ($row = oci_fetch_array($statement, OCI_ASSOC+OCI_RETURN_NULLS)) {
		array_push($sendArray, $row);
	}
	// JSON encode and send the query data
	$jsonData = json_encode($sendArray);
	echo $jsonData;



}



function searchForItems($conn){
	$queryString = $_POST["searchText"];
	
	if ($_POST["USER"] == "admin") {
		if ($_POST["searchCol"] == "price") {
				$string = "SELECT * FROM ".$GLOBALS['tableOwner'].".".$GLOBALS['inventoryTableName'] .
				" WHERE ". $_POST["searchCol"] ." ".$queryString." ";
			}
			else if ($_POST["searchCol"] == "SKU") {
				$string = "SELECT * FROM ".$GLOBALS['tableOwner'].".".$GLOBALS['inventoryTableName'] .
				" WHERE ". $_POST["searchCol"] ." = '".$queryString."'";
			}
			else{	
				$string = "SELECT * FROM ".$GLOBALS['tableOwner'].".".$GLOBALS['inventoryTableName']." WHERE  lower (". $_POST["searchCol"] .") LIKE '%' || :qString || '%'";
		}


	}else{
		if ($_POST["searchCol"] == "price") {
				$string = "SELECT * FROM ".$GLOBALS['tableOwner'].".".$GLOBALS['inventoryTableName'] .
				" WHERE AVAILABILITY >= 0 AND ". $_POST["searchCol"] ." ".$queryString." ";
			}
			else if ($_POST["searchCol"] == "SKU") {
				$string = "SELECT * FROM ".$GLOBALS['tableOwner'].".".$GLOBALS['inventoryTableName'] .
				" WHERE ". $_POST["searchCol"] ." = '".$queryString."' AND AVAILABILITY >= 0";
			}
			else{	
				$string = "SELECT * FROM ".$GLOBALS['tableOwner'].".".$GLOBALS['inventoryTableName']." WHERE AVAILABILITY >= 0 AND lower (". $_POST["searchCol"] .") LIKE '%' || :qString || '%'";
		}

	}

	
	// echo $string;
	$statement = oci_parse($conn, $string);
	oci_bind_by_name($statement, ":qString", $queryString);

	$r = oci_execute($statement);
	// Error reporting
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);
	if (!$r) {
		$e = oci_error($statement);
		trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
	}
	// Collect the query data into an array
	$sendArray = [];
	while ($row = oci_fetch_array($statement, OCI_ASSOC+OCI_RETURN_NULLS)) {
		array_push($sendArray, $row);
	}
	// JSON encode and send the query data
	$jsonData = json_encode($sendArray);
	echo $jsonData;




}




function getAllItems($conn){



	

	if ($_POST["USER"] == "admin") {
		$string = "SELECT * FROM ".$GLOBALS['tableOwner'].".".$GLOBALS['inventoryTableName'].
		" ORDER BY DATEADDED DESC";
	}
	else{
		$string = "SELECT * FROM ".$GLOBALS['tableOwner'].".".$GLOBALS['inventoryTableName'].
		" WHERE AVAILABILITY >= 0 ORDER BY DATEADDED DESC";
	}
	
	$statement = oci_parse($conn, $string);

	$r = oci_execute($statement);
	// Error reporting
	if (!$r) {
		$e = oci_error($statement);
		trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
	}
	// Collect the query data into an array
	$sendArray = [];
	while ($row = oci_fetch_array($statement, OCI_ASSOC+OCI_RETURN_NULLS)) {
		array_push($sendArray, $row);
	}
	// JSON encode and send the query data
	$jsonData = json_encode($sendArray);
	echo $jsonData;



}





function uploadTSVFile($conn){

	$dataString = $_POST['csvData'];

	$keyArray = (array_keys($dataString));
	// This replace is needed for the key array
	// For some reason the last keyword has a \r at the end
	// This prevents oracle from accepting the insert data
	// Probalby not needed anymore, included in the JS 
	// $keyArray = str_replace("\r", "", $keyArray);



	// print_r($keyArray);
	// Init query statement with db identifiers
	$statement = 
		"INSERT INTO ". $GLOBALS['tableOwner'].".".$GLOBALS['inventoryTableName'].
		"(";
	// FIrst element does not get quotes around it
	$statement .= $keyArray[0]."";
	for ($i=1; $i < sizeof($keyArray); $i++) { 
			// $statement .= ",\"".$keyArray[$i]."\"";
			$statement .= ",".$keyArray[$i];
		}
	$statement .= ", DATEADDED )"."VALUES (";

	// Start looping through the incomming data
	for ($i=0; $i < sizeof($dataString); $i++) { 
		// Adds a , between strings, excpet for the first
		if ($i > 0) { $statement.=" , ";}
		// Oracle has issues with accepting apostrophe characters
		// It can be handled by adding extra apostrophes around the single one
		// Results in a double apostrophe being stored
		$statement .= "'".str_replace("'", "''''", $dataString[$keyArray[$i]])."'";
	}
	// End the string
	$statement.=", SYSDATE )";
	// echo $statement;
	// Prepare and execute the query
	$sendStatement = oci_parse($conn, $statement );
	$r = oci_execute($sendStatement);
	// Error handling
	if (!$r) {
		$e = oci_error($sendStatement); 
		$result = array('statement'=> $_POST['csvData']['NAME'],'result' => $e['message']);
		echo json_encode($result);
		return;
	}
	else{
		$result = array('result' => 'success');
		echo json_encode($result);
		return;
	}
}





// This function is for gathering price information for the cart view
function getCartData($conn){
	// print_r($_POST);
	$jsonData = $_POST["cart"];
	// Checking if cart is empty
	// PHP crashes if it is
	$size = sizeof($jsonData);
	if ($size == 0) {
		$result = array('result' => 'empty cart');
		echo json_encode($result);
		return;
	}
	// Starting to form the sql statment
	// No user input, dont need binded statements
	$statement = "SELECT SKU, Price, Name, Availability FROM ".
			$GLOBALS['tableOwner'].".".$GLOBALS['inventoryTableName'].
			" WHERE SKU in ( ";

	// FirstFlag is for adding commas ',' between items
	// First item does not get one
	$firstFlag = 0;
	// Add each incoming SKU to the sql string
	foreach ($jsonData as $key => $value) {
		if ($firstFlag == 1) { $statement.=",";	}
		$firstFlag = 1;
		$statement.="'".$key."'";
	}
	$statement.=")";
	// echo $statement;
	// Send the sql statemnt to the connection
	$sendStatement = oci_parse($conn, $statement);
	$r = oci_execute($sendStatement);
	// Error reporting
	if (!$r) {
		$e = oci_error($sendStatement);
		trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
	}
	// Collect the query data into an array
	$sendArray = [];
	while ($row = oci_fetch_array($sendStatement, OCI_ASSOC+OCI_RETURN_NULLS)) {
		array_push($sendArray, $row);
	}
	// JSON encode and send the query data
	$jsonData = json_encode($sendArray);
	echo $jsonData;
}

function insertItem($conn){
	// Set filename with directory
	$imageName = $GLOBALS['imageDirectory'].$_POST["Image"];
	if (strlen($_POST["Datasheet"]) > 1) {	
		$datasheetName = $GLOBALS['datasheetDirectory'].$_POST["Datasheet"];
	}else{
		$datasheetName = null;
	}
	$queryString = 
		"INSERT INTO ". $GLOBALS['tableOwner'].".".$GLOBALS['inventoryTableName']."
				(SKU, \"KEYWORDS\", \"DESCRIPTION\", \"CONSUMABLE\", 
				\"AVAILABILITY\", \"PRICE\", \"LINK\", \"NAME\",
				\"IMAGE\", \"LOCATION\", \"DATASHEET\", DATEADDED)
		        VALUES (
		        :SKU, 
		        :Keywords,
		        :Description,
		        :Consumable,
				:Availability,
				:Price,
				:Link,
				:Name,
				:ImageName,
				:Location,
				:DatasheetName,
				SYSDATE
		)";
	$statement = oci_parse($conn,$queryString);
	// Use binds for security
	oci_bind_by_name($statement, ':SKU', $_POST["SKU"]);
	oci_bind_by_name($statement, ':Keywords', $_POST["Keywords"]);
	oci_bind_by_name($statement, ':Description', $_POST["Description"]);
	oci_bind_by_name($statement, ':Consumable', $_POST["Consumable"]);
	oci_bind_by_name($statement, ':Availability', $_POST["Availability"]);
	oci_bind_by_name($statement, ':Price', $_POST["Price"]);
	oci_bind_by_name($statement, ':Link', $_POST["Link"]);
	oci_bind_by_name($statement, ':Name', $_POST["Name"]);
	oci_bind_by_name($statement, ':ImageName', $imageName);
	oci_bind_by_name($statement, ':Location', $_POST["Location"]);
	oci_bind_by_name($statement, ':DatasheetName', $datasheetName);

	// Send query
	// $r = oci_execute($statement);
	// // Error handling
	// if (!$r) {
	// 	$e = oci_error($statement); 
	// 	$result = array('result' => $e['message']);
	// 	echo json_encode($result);
	// 	return;
	// }
	// else{
	// 	$result = array('result' => 'success');
	// 	echo json_encode($result);
	// }

	// Image Processing

	$imgDatab64 = explode( ',', $_POST["ImageData"]);
	$writeImgData = base64_decode($imgDatab64[1]);
	$imageDir = "images/".$_POST["Image"];
	if (!file_put_contents($imageDir, $writeImgData)) {
		$result = array('result' => 'Image Upload Failure');
		echo json_encode($result);
		return;
	}
	// else{
	// 	$result = array('result' => 'success');
	// 	echo json_encode($result);
	// }

	// Upload Datasheet
// ========================
	if (strlen($_POST["Datasheet"]) > 1) {	
		$dataSheet64 = explode( ',', $_POST["DatasheetData"]);
		$writeDatasheetData = base64_decode($dataSheet64[1]);
		$datasheetDir = "datasheets/".$_POST["Datasheet"];
		if (!file_put_contents($datasheetDir, $writeDatasheetData)) {
			$result = array('result' => 'Datasheet Upload Failure');
			echo json_encode($result);
			return;
		}
		// else{
		// 	$result = array('result' => 'success');
		// 	echo json_encode($result);
		// }
	}
		// else{
	// 	$result = array('result' => 'success');
	// 	echo json_encode($result);
	// }

	// Send insert to oracle
	$r = oci_execute($statement);
	// Error handling
	if (!$r) {
		$e = oci_error($statement); 
		$result = array('result' => $e['message']);
		echo json_encode($result);
		return;
	}else{
			$result = array('result' => 'success');
			echo json_encode($result);
		}

}


function oracle_connect(){
	
	PutEnv("ORACLE_SID=course");
	PutEnv("ORACLE_HOME=/afs/cad/linux/oraclient.12c");
	PutEnv("LD_LIBRARY_PATH=/afs/cad/linux/oraclient.12c/lib");

	// Die on connection error
	if (!$conn = oci_connect("mjk29", "QkMxUxqbJ", "course")) {
		echo"ERROR";
		die();
	}
	return $conn;
	}

?>

