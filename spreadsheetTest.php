

<body onload="getList();">


<!DOCTYPE html>
<html>
<head>
<title>Page Title</title>
</head>
<body>
<body onload="imagePreviewer()">

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

<br><br>
Upload TSV File
<br>
<input type="file" id="file_input" class="foo" />
<div id="progBar" style="background-color:black;width:1px;"> </div>
<div id="output_field" class="foo"></div>

<br><br><br>


Select an image file: 
<!-- <form id="form1" runat="server"> -->
  <input type='file' id="imgInp" />
  <img id="blah" src="#" alt="your image" />

<br><br>
<textarea id="rowDataFromSpreadsheet" onkeyup="check(this);" rows="4" cols="50" placeholder="Copy and paste spreadsheet row data here">
</textarea>
<br>

<br>
SKU: <input type="number" id="sku_formatted" ><br>
Keywords: <input type="text" id="keywords_formatted"  ><br>
Description: <input type="text" id="description_formatted"  ><br>
Consumable: <input type="checkbox" id="consumable_formatted"  ><br>


Availability: <input type="number" id="availability_formatted"  ><br>
Price: <input type="number" id="price_formatted"  ><br>
Link: <input type="text" id="link_formatted"  ><br>
Name: <input type="text" id="name_formatted"  ><br>
Image URL: <input type="text" id="imgurl_formatted"  ><br>
Location: <input type="text" id="location_formatted"  ><br>
<br>



<button onclick="qrGen()" >QR GENERATOR</button>


<input id="text" type="text" value="https://hogangnono.com" style="width:80%" /><br />
<div id="qrcode"></div>

<br><br><br><br><br><br>


<br>
<input type="text" id="cookieKey" placeholder="cookieKey">
<input type="text" id="cookieVal" placeholder="cookieVal">

<br>
<button onclick="saveCookies()">Save Cookies</button>

<br>


<button onclick="loadCookies()">Load Cookies</button>
<div id="cookieTest"></div>

<button onclick="clearCookies()">Clear Cookies</button>

<br>
<button onclick="cookieTester()">cookieTester</button>


<button onclick="cartJson()">cartJson</button>

<br><br>

<button onclick="vanillaQRFunction();">vanilla qr</button>



<br><br><br><br><br><br>
<br><br><br><br><br><br>

</body>
</html>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script type="../cap/assets/js/qrcode.js"></script>
<script type="text/javascript" src="spreadsheetTestJS.js"></script>
<script src="VanillaQR.js"></script>


