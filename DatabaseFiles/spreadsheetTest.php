<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script lang="javascript" src="dist/xlsx.full.min.js"></script>
<script type="text/javascript" src="spreadsheetTestJS.js"></script>
  <link href="page.css" rel="stylesheet">

<body onload="getList();">


<!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
</head>
<body>

<!-- Add From CSV File
<button onclick="testFun()">Click me</button>
<br> -->

Add from text fields
<br>
SKU: <input type="number" id="sku" ><br>
Name: <input type="text" id="name"  ><br>
Keywords: <input type="text" id="Keywords"  ><br>
Description: <input type="text" id="Description"  ><br>
Consumable: <input type="checkbox" id="Consumable"  ><br>
Availability: <input type="number" id="Availability"  ><br>
Price: <input type="number" id="price"  ><br>
Link: <input type="text" id="link"  ><br>
Image URL: <input type="text" id="imgUrl"  ><br>
Location: <input type="text" id="location"  ><br>
<br>

<button onclick="fieldAdd()">Add Item</button>
<br><br><br>


Add new user<br>
UCID: <input type="text" id="UCID" ><br>
Name: <input type="text" id="uName" ><br>
Address: <input type="text" id="Address" ><br>
<br>
<button onclick="addUser()">Add User</button>
<br><br><br>

Add new transaction<br>
Transaction ID: <input type="text" id="TID" ><br>
UCID: <input type="text" id="txUCID" ><br>
Name: <input type="text" id="txName" ><br>
Total: <input type="text" id="Total" ><br>
Item: <input type="text" id="Item" ><br>
<br>
<button onclick="addTx()">Add Tx</button>

<br><br><br>
Get Table Data, outputs to console --> <br>

<input type="radio" name="tableName" value="Inventory"> Inventory<br>
<input type="radio" name="tableName" value="transactions"> transactions<br>
<input type="radio" name="tableName" value="user"> user
<br><br>
<button onclick="getTableData()">getData</button>

<br>
<br>
<br>


	<select>
		<?php
		for ($i=0; $i < 50; $i++) { 
			echo "<option class='hidden select' id=selection".$i.">Selection</option>";
		}
		?>
	</select>
<br><br>

	<?php
	for ($i=0; $i < 50; $i++) { 
		echo "<input class='hidden' name='keyCheck' id='selectCheckbox".$i."' type='checkbox'/></input>";
		echo "<label class='hidden' id='selectCheckboxLabel".$i."'>&nbsp</label>";
	}
	?>
<br><br>
<input type="radio" name="ANDOR" value="1" checked="checked">AND<br>
<input type="radio" name="ANDOR" value="0">OR<br>
<button onclick="getTableDataSelection()">getData</button>



<!-- <button onclick="getList()">get keywords</button> -->


<!--  <select>
  <option value="DC Motors">DC Motors</option>
  <option value="Soldering">Soldering</option>
  <option value="Actuator">Actuator</option>
  <option value="Camera">Camera</option>
  <option value="Consumable">Consumable</option>
  <option value="IntegratedChip">Integrated Chip</option>
  <option value="MicroController">MicroController</option>
  <option value="Office">Office</option>
  <option value="Potentiometer">Potentiometer</option>
  <option value="PowerSupply">Power Supply</option>
  <option value="Sensing">Sensing</option>
  <option value="Servo">Servo</option>
  <option value="Storage">Storage</option>
  <option value="Tools">Tools</option>
  <option value="Vibration">Vibration</option>

</select> 
 -->




</body>
</html>
