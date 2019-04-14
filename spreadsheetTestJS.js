function testFun() {
	// readSingleFile("invJson.txt")
	readTextFile("invJson.txt")
}

// This needs to be towards the top of the JS file
// Does not work if at end
// Function for reading upload files for importing csv
$(document).ready(function() {
	$('#file_input').on('change', function(e) {
		function loaded(evt) {
			fileString = evt.target.result;
			// ass = fileString
			itemArray = csvToObj(fileString)
			// console.log(itemArray)
			insertItemFromCSV(itemArray)
			// itemArr = fileString.split('\n')
			// colNames = itemArr.shift().split('\t')
			// console.log(colNames)
			// console.log(itemArr)
		}
		var res = readFile(this.files[0]);

		var reader = new FileReader();

		reader.readAsText(this.files[0], "UTF-8");

		// reader.onprogress = updateProgress;
		reader.onload = loaded;
	});
});




function readSingleFile(e) {
  // var file = e.target.files[0];
  if (!e) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    displayContents(contents);
  };
  reader.readAsText(e);
}

function displayContents(contents) {
  // var element = document.getElementById('file-content');
  // element.textContent = contents;
  console.log(contents)
}

// document.getElementById('file-input').addEventListener('change', readSingleFile, false);




function readTextFile(file){
	allText = ""
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4){
            if(rawFile.status === 200 || rawFile.status == 0){
                var allText = rawFile.responseText;
                console.log("working");
                printText(allText)
            }
        }
    }

    // console.log(allText)
    rawFile.send(null);
}



function printText(text) {
	// console.log(text.length)

	jsontext = JSON.parse(text)
	console.log(jsontext)
	console.log(jsontext.length)
	url = "sqlPHPRx.php"
	// console.log(JSON.stringify(jsontext))
	

	for (var i = jsontext.length - 1; i >= 0; i--) {
		console.log(typeof(JSON.stringify(jsontext[i])))
		$.ajax({
			type: 'POST',
			url: url,
			// datatype: "json",
			data: jsontext[i],
			success: function (data) {
				console.log(data)
			},
			retdata : {'name':"name1"},
		});
	}



	// for (var i = jsontext.length - 1; i >= 0; i--) {
	$.ajax({
		type: "POST",
		url: url,
		datatype: "json",
		data: jsontext,
		success: function (data) {
     		console.log(data);
		 },
		// retdata : {'name':"name1"},
	});

    }

	// }

	// for (var i = jsontext.length - 1; i >= 0; i--) {
	// 	// console.log(jsontext[i])
		
	// }



function fieldAdd() {

	var objectToAdd ={

	SKU: document.getElementById("sku").value,
	Name: document.getElementById("name").value,
	Keywords: document.getElementById("Keywords").value,
	Description: document.getElementById("Description").value,
	Consumable :document.getElementById("Consumable").checked,
	Availability: document.getElementById("Availability").value,
	Price: document.getElementById("price").value,
	Link :document.getElementById("link").value,
	Image :document.getElementById("imgUrl").value,
	Location: document.getElementById("location").value,
	POSTTYPE : "item"
}

console.log(objectToAdd)

if (objectToAdd.Consumable) {
	objectToAdd.Consumable = 1
}
else{
	objectToAdd.Consumable = 0
}
	// console.log(objectToAdd.Consumable)


url = "sqlPHPRx.php"
	$.ajax({
			type: 'POST',
			url: url,
			// datatype: "json",
			data: objectToAdd,
			success: function (data) {
				console.log(data)
			},
			retdata : {'name':"name1"},
		});



}




function addUser() {
	var newUser = {
	UCID: document.getElementById("UCID").value,
	Name: document.getElementById("uName").value,
	Address: document.getElementById("Address").value,
	POSTTYPE : "user"

	}


	url = "sqlPHPRx.php"
	$.ajax({
			type: 'POST',
			url: url,
			// datatype: "json",
			data: newUser,
			success: function (data) {
				console.log(data)
			},
			retdata : {'name':"name1"},
		});



}




function addTx() {
	txData = {
		transactionID: document.getElementById("TID").value,
		UCID: document.getElementById("txUCID").value,
		Name: document.getElementById("txName").value,
		Total: document.getElementById("Total").value,
		Item: document.getElementById("Item").value,
		POSTTYPE : "tx"
	}
	url = "sqlPHPRx.php"
	$.ajax({
			type: 'POST',
			url: url,
			// datatype: "json",
			data: txData,
			success: function (data) {
				console.log(data)
			},
			retdata : {'name':"name1"},
		});
}


function getTableData(arg) {
	console.log("getTableData")
	if (arg) {
		sendData = arg
		console.log(sendData)
	}
	else{
		sendData = {
			// tableName: $("input[name='tableName']:checked").val(),
			tableName: "inventory",

			query: "*",
			POSTTYPE: "get"
		}
	}
	console.log(sendData)
	url = "sqlPHPRx.php"
	// console.log("vvvv Here is the sendData object below vvvv")
	// console.log(sendData)
	// console.log("^^^^ End of sendData obkect ^^^^")
	// console.log("vvvv Here is the sendData String below vvvv")
	// console.log(JSON.stringify(sendData))
	// console.log("^^^^ End of sendData string ^^^^")


	$.ajax({
			type: 'POST',
			url: url,
			// datatype: "json",
			data: sendData,
			success: function (data) {
				console.log("RETURN DATA v--------------------v")
				// console.log(JSON.parse(data))
				console.log(data)
				console.log("RETURN DATA ^--------------------^")

			},
			retdata : {'name':"name1"},
		});
}





function getList() {
	url = "sqlPHPRx.php"
	sendData = {
		tableName: "inventory2",
		distinct : 1,
		query: "Keywords",
		POSTTYPE: "get"
	}
	console.log(sendData)
	console.log(JSON.stringify(sendData))
	$.ajax({
		type: 'POST',
		url: url,
		// datatype: "json",
		// data: JSON.stringify(JSON.stringify(sendData)),
		data:sendData,
		success: function (data) {
			console.log("HERE IS THE PHP STRING")
			console.log(data)

			decoded = JSON.parse(data)
			console.log(decoded)
			for (var i = 0; i <  decoded.length; i++) {
				console.log(decoded[i] + i)
				document.getElementById("selection"+i).innerHTML = decoded[i];
			    document.getElementById("selection"+i).classList.remove("hidden");

			    document.getElementById("selectCheckboxLabel"+i).innerHTML = decoded[i];
   			    document.getElementById("selectCheckboxLabel"+i).classList.remove("hidden");
			    document.getElementById("selectCheckbox"+i).classList.remove("hidden");
			}
		},
		failure: function(strig){
			console.log("ASS")
		},
		// retdata : {'name':"name1"},
	});
}





function getTableDataSelection(argument) {

	sendData = {
		tableName: "Inventory",
		query: "*",
		column: "Keywords",
		where: [],
		POSTTYPE: "get",
		andor:$("input[name='ANDOR']:checked").val()
	}


	// console.log( $("input[name='ANDOR']:checked").val())

	where="as"
	var io = 0
	var bool = 0

	do{
		if ($('#selectCheckbox'+io).is(":checked")){
			sendData.where.push(document.getElementById("selectCheckboxLabel"+io).textContent)
		}
		if(document.getElementById("selectCheckboxLabel"+io).className == "hidden"){
			break
		}
		io+=1
	}while(1)
	console.log(JSON.stringify(sendData))

	//If none selected, get all
	// if (sendData.where.length == 11) {
	// 	sendData.where+=('*')
	// }

	getTableData(sendData)


}



function testButts(){

console.log("TRYING ")

	sendData = {
		tableName: "Inventory",
		query: "*",
		column: "Keywords",
		where: [],
		POSTTYPE: "get",
		andor:$("input[name='ANDOR']:checked").val()
	}

	sendJ = JSON.stringify(sendData)



var url = 'sqlPHPRx.php'; //A local page
var http = new XMLHttpRequest();
var params = sendJ;
http.open('POST', url, true);

//Send the proper header information along with the request
http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
        console.log(http.responseText);
    }
}
http.send(params);
console.log("END TRING")
}




function testColumns() {
	console.log("TRYING ")

	sendData = {
		// tableName: "Inventory",
		// query: "*",
		// column: "Keywords",
		// where: [],
		POSTTYPE: "test",
		// andor:$("input[name='ANDOR']:checked").val()
	}

	sendJ = JSON.stringify(sendData)

	var url = 'sqlPHPRx.php'; //A local page



	$.ajax({
			type: 'POST',
			url: url,
			// datatype: "json",
			data: sendData,
			success: function (data) {
				// console.log("ASSGOBLINS")
				console.log(JSON.parse(data))
				console.log(data)
			},
			retdata : {'name':"name1"},
		});
}


function loadCSV() {
// var fileUpload = document.getElementById("csvFile");
var fileUpload=document.getElementById("csvFile").files[0];
var reader = new FileReader();

reader.readAsText(fileUpload/*, "UTF-8"*/);
console.log(reader)

console.log( String(reader.result))


// var txt = "";
// if ('files' in x) {
//     if (x.files.length == 0) {
//         txt = "Select one or more files.";
//     } else {
//     	console.log(readAsText(x))
//         for (var i = 0; i < x.files.length; i++) {
//             txt += "<br><strong>" + (i+1) + ". file</strong><br>";
//             var file = x.files[i];
//             if ('name' in file) {
//                 txt += "name: " + file.name + "<br>";
//             }
//             if ('size' in file) {
//                 txt += "size: " + file.size + " bytes <br>";
//             }
//         }
//     }
// } 
// console.log(txt)
// document.getElementById ("demo").innerHTML = txt;
}



function readFile(file) {
    var reader = new FileReader(),
        result = 'empty';

    reader.onload = function(e) {
        result = e.target.result;
    };

    reader.readAsText(file);

    return result;
}


function csvToObj(csvString) {
	var itemArr = csvString.split('\n')
	var colNames = itemArr.shift().split('\t')
	var itemObjectArray = []
	// itemObjectArray.push(colNames)

	for (var i = 0; i < itemArr.length; i++) {
		let tempItemArr = itemArr[i].split('\t')
		let tempItemObj = {}
		for (var j = 0; j < colNames.length; j++) {
			
			tempItemObj[colNames[j]] = tempItemArr[j]
		}	
		itemObjectArray.push(tempItemObj)
	}
	return itemObjectArray
}

function insertItemFromCSV(csvObj) {
	// console.log("HERE IS THE DATA")
	// console.log(csvObj.length)
	jsondata = JSON.stringify(csvObj)
	// console.log(jsondata.length)
	// testDat = csvObj[1]
	// console.log(testDat)
	// console.log(JSON.stringify(testDat))
	var url = 'oracleDBConn.php'; //A local page
	
	for (var i = 1; i < csvObj.length; i++) {
		// for (var i = 1; i < 6; i++) {

		// console.log(csvObj[i].Image)
		// console.log(csvObj[i].Image.length)
		// console.log(csvObj[i].Image.localeCompare("No Image"))
		if (csvObj[i].Image.length == 0) {
			// console.log("No Image")
			continue
		}			

		sendData = {
			tableName: "inventory",
			POSTTYPE: "tsvItem",
			csvData: csvObj[i],
			}
		$.ajax({
			type: 'POST',
			url: url,
			// datatype: "json",
			data: sendData,
			success: function (data) {
				console.log(data)
			},
		});
	}
}


function readURL(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      $('#blah').attr('src', e.target.result);
    }

    reader.readAsDataURL(input.files[0]);
  }
}

$("#imgInp").change(function() {
  readURL(this);
});







function check(element) {
	var textAreaElement = document.getElementById("rowDataFromSpreadsheet")
	var rowInputData = textAreaElement.value
	// console.log(rowInputData)
	event = new Event('change');
	textAreaElement.value = element.value;
	textAreaElement.dispatchEvent(event);
	parseRowData(rowInputData)
};




function parseRowData(rowData) {
	var tabs = rowData.split('\t');
	tabs.length=11
	tabs[3] = parseInt(tabs[3])
	// console.log(tabs)

	document.getElementById("sku_formatted").value = tabs[0]
	document.getElementById("keywords_formatted").value = tabs[1]
	document.getElementById("description_formatted").value = tabs[2]
	document.getElementById("consumable_formatted").checked = tabs[3]
	document.getElementById("availability_formatted").value = tabs[4]
	document.getElementById("price_formatted").value = tabs[5]
	document.getElementById("link_formatted").value = tabs[6]
	document.getElementById("name_formatted").value = tabs[7]
	document.getElementById("imgurl_formatted").value = tabs[8]
	document.getElementById("location_formatted").value = tabs[9]
}


function qrGen(argument) {
	$.getScript('../cap/assets/js/qrcode.js', function(){
		var qrcode = new QRCode("qrcode");
		function makeCode () {      
			var elText = document.getElementById("text");
			if (!elText.value) {
				alert("Input a text");
				elText.focus();
				return;
			}
			qrcode.makeCode(elText.value);
		}
		makeCode();
		$("#text").on("blur", function () {
			makeCode();
		}).
		on("keydown", function (e) {
			if (e.keyCode == 13) {
				makeCode();
			}
		});
	});
}


// new Element("script", {src: "../cap/assets/js/qrcode.js", type: "text/javascript"});





function saveCookies() {
	// document.cookie = "username=John Doe";
	cookieKey = document.getElementById("cookieKey").value
	cookieVal = document.getElementById("cookieVal").value

	document.cookie = cookieKey+"="+cookieVal
	console.log(document.cookie)
}

function loadCookies() {
	
	var x = (document.cookie).split(";");
	console.log(x)
	console.log(typeof(x))
}


function clearCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}


function cookieTester() {
	
	sku0 = 1337
	quantity0 = 69
	sku1 = 1234
	quantity1 = 99
	sku2 = 7777
	quantity2 = 343

	cookieString = ""

	cartArray=[]

	cartArray.push({
		[sku0]:quantity0
	})
		cartArray.push({
		[sku1]:quantity1
	})
		cartArray.push({
		[sku2]:quantity2
	})
	

	cart={
		[sku0]:quantity0,
		[sku1]:quantity1,
		[sku2]:quantity2,
	}

	cartJSON = JSON.stringify(cart)
	console.log(cartJSON)


	// for (item in cart){
	// 	console.log(item)
	// 	console.log(cart[item])
	// 	cookieString += item+"="+cart[item]+";"
	// }
	// console.log(cookieString)
	// console.log(typeof(cookieString))

	// cartArray.forEach(function(arrayItem){
	// 	console.log(arrayItem[0])
	// })

// for (var i = 0; i < cartArray.length; i++) {
// 	// cookieString += cartArray[i][0]
// 	console.log(cartArray[i][0])
// }

	document.cookie = "cartData="+cartJSON


	// console.log(cart)
	// console.log(cartArray)
}




function cartJson() {

	



	// Structure for this function
	// The cart data is aded to an object, 'cart'
	// Associative array, sku:quantity
	// Need to send the sku to the DB to get the correct price
	// 

	skuArray=[1337,1234,7777]
	quantityArray = [69,22,1]
	


	cart = []

	for (var i = 0; i < skuArray.length; i++) {
		cart.push({
			SKU:skuArray[i],
			quantity:quantityArray[i]
		})
	}
	// console.log(cart)
	// // cart[0]=({
	// // 	SKU:1337,
	// // 	quantity:23,
	// // })


	// cartData = JSON.stringify(cart)
	// // console.log(cartData)
	// jsObj={
	// 	transactionID : "2F19A0C17",
	// 	totalPrice : 153.99,
	// 	cartList : cart,
	// }
	// jsonString = JSON.stringify(jsObj)
	// console.log(jsObj)
	// console.log(jsonString)
	// console.log(JSON.parse(jsonString))


	// GET item price data from DB
	// Loop through all SKUs in the skuarray
	// Send individually
	// url = "oracleDBConn.php"
	url = "oracleDBConn.php"
	// for (var i = 0; i < skuArray.length; i++) {
		var sendData = {
			SKUArray : cart,
			POSTTYPE : "cartdata"
		}

		// console.log(sendData)

		$.ajax({
				type: 'POST',
				url: url,
				data: sendData,
				success: function (data) {
					console.log(data)
				},
			});




	// }
		


}


function vanillaQRFunction(){
	$.getScript('../cap/VanillaQR.js', function(){
	    var qr2 = new VanillaQR({
        url: "http://example.com",
        width: 400,
        height: 400,
        colorLight: "#FFFFFF",
        colorDark: "#000000",
        borderSize: 4
    });
    var imageElement = qr2.toImage("png");
	document.body.appendChild(imageElement);
	});
}