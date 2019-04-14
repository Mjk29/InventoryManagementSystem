 
var body = document.querySelector('main');
var URL = "https://web.njit.edu/~mjk29/cap/sqlPHPRx.php";
var responseJSON;
var items;
var adminLogOut = document.getElementById("adminLogOut");


//Generates the initial json request when page first loads
function generateInitJSON(){

    var requestJSON = {
        USER: "admin",
        POSTTYPE: "getAll"
    }
    console.log("Json request:\n");
    console.log(requestJSON);

    // Sends request
    $.ajax({
        type: 'POST',
        url: "https://web.njit.edu/~mjk29/cap/oracleDBConn.php",
        data: requestJSON,
        success: function(data) {
            responseJSON = JSON.parse(data);
            console.log(responseJSON);
            populate2(responseJSON); 
        },
    });
}


// GIS is for tracking what item is where,
// Used for gathering item name forother functionality
globalItemStack=[]

//For testing purposes
//TODO NEW POPULATE METHOD
// https://stackoverflow.com/questions/32312958/making-html-elements-editable-after-a-click-of-a-button-and-save-on-the-database
function populate2(json){
    // Clear the GIS at the start of every populate
    globalItemStack.length=0

    //Clear body before populating
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    //For each item in json
    for (var i=0; i < json.length; i++){


        //create element
        var section = document.createElement('section');
        var imgDiv = document.createElement('div');
        var itemDiv = document.createElement('div');
        var item = document.createElement('input'); 
        var desc = document.createElement('textarea'); 
        var qty = document.createElement('input'); 
        var price = document.createElement('input'); 
        var img = document.createElement('img');
        var hr = document.createElement('hr');
        var datasheetLink = document.createElement('A');
        var datasheet = document.createElement('h3');
        var qrCode = document.createElement('h3');
        var deletebutton = document.createElement('button');

        //Place data into element
        //div.id = json[i][1];
        item.value =  json[i].NAME;
        desc.placeholder = json[i].DESCRIPTION;
        qty.value = "# In stock: " + json[i].AVAILABILITY;
        price.value = "Unit price: " + json[i].PRICE;
        qrCode.textContent = "QRCODE";
        qrCode.setAttribute("onclick", "generateQR(\""+json[i].SKU+"\")")
        qrCode.setAttribute("style","color:#2874A6")

        //Add classes to elements
        section.className = json[i].KEYWORDS;
        imgDiv.className = 'img-content';
        itemDiv.className = 'item-content';

        //Adds css for elements that are editable
        item.className = "editable name";
        desc.className = "description editable desc noscroll";
        qty.className = "editable";
        price.className = "editable";
    
        //disable editable elements
        item.disabled = true;
        desc.disabled = true;
        qty.disabled = true;
        price.disabled = true;
        
        deletebutton.innerHTML = "Delete item"
        deletebutton.className = "delete-button"
        deletebutton.style.display = "none"


        let currentImgString = json[i].IMAGE
        // Attempt to load image from DB
        if (currentImgString.localeCompare("No Image")) {
            img.src=json[i].IMAGE;
        } else {
            img.src="../cap/images/placeholder.png";
        }


       if (json[i].DATASHEET == null) {
            datasheetLink.textContent = "No datasheet available"  
        } else {
            datasheetLink.href = json[i].DATASHEET;
            datasheetLink.textContent = "Datasheet"
        }

        // This sets css for the link
        var linkClone = datasheetLink.cloneNode(true);
        datasheet.appendChild(linkClone);


        // Append image to image div
        imgDiv.appendChild(img);


        // Append elements to the item View
        itemDiv.appendChild(deletebutton);
        itemDiv.appendChild(item);
        //itemDiv.appendChild(document.createElement('br'));
        itemDiv.appendChild(qty);
        //itemDiv.appendChild(document.createElement('br'));
        itemDiv.appendChild(price);
        //itemDiv.appendChild(document.createElement('br'));
        itemDiv.appendChild(desc);
        //itemDiv.appendChild(document.createElement('br'));
        itemDiv.appendChild(datasheet);
        itemDiv.appendChild(qrCode);
        
        
        // Finally, we fill Section with our created divs
        section.appendChild(imgDiv);
        section.appendChild(itemDiv);
        section.append(hr);

        body.append(section);

    }

}


// Change view of page when action is selected for Adding Items
var addItemAction = $('label.admin-actions input[type="checkbox"]#action-add-items');
addItemAction.on('click', function() {

    //Select divs to show and hide 
    var items = $('main.items-view');
    var formpad = $('div#pad-form');
    var form = $('main.form-view');

    //Select clicked element
    var ele = $(this).find(":checkbox");

    if ($(':checked').length){
        items.css("display", "none");
        formpad.css("display", "none");
        form.css("display", "block");
    } else {
        items.css("display", "block");
        formpad.css("display", "block");
        form.css("display", "none");
    }

});

//TODO 
//Change view of page when action is selected for Update items
var count = 0;
var actionUpdateItems = $('#action-update-items');
actionUpdateItems.on('click', function() {

    //Show the two new buttons for canceling and completing update
    let cancel =  document.getElementById('action-cancel-update')
    let complete = document.getElementById('action-complete-update')

    //Select other buttons to unclick when update is clicked
    // let additem = $('#add-item-button')
    // let vieworder = $('#action-add-items')

    //select all elements that can be edited
    let edits = $('input.editable');
    let desc = $('textarea.editable');
    if (count % 2 == 0){
        edits.prop('disabled', false);
        desc.prop('disabled', false);
        edits.css('border', '1px solid black');
        desc.css('border', '1px solid black');
        cancel.style.display = "block"
        complete.style.display = "block"
        // additem.prop('checked', false)
        // vieworder.prop('checked', false)
    } else {
        edits.prop('disabled', true);
        desc.prop('disabled', true);
        edits.css('border', 'transparent');
        desc.css('border', '1px solid #ced4da');
        cancel.style.display = "none"
        complete.style.display = "none"
    }


    //change css of each element so its clear it can be edited
    //add a button to click which submits any changes

    count = count + 1; //Keep track of order
});

// Change view of page when action is selected for Viewing Orders
var actionViewOrder = $('label.admin-actions input[type="checkbox"]#action-view-orders');
actionViewOrder.on('click', function() {

    //Deselect inner checkboxes
    $('input.view-orders').not(this).prop('checked', false);

    //Select divs to show and hide
    var items = $('main.items-view');
    var orders = $('main.transaction-view');
    var formpad = $('div#pad-form');

    //Clear view
    orders.html(' ')

    let header = document.createElement('div')
    header.className = "view-orders-header"
    let headerText = document.createElement('h1')
    headerText.innerHTML = "View Orders"

    header.appendChild(headerText)
    orders.append(header)

    //Select new buttons to show
    let oldorders = document.getElementById('action-view-completed-orders')
    let neworders = document.getElementById('action-view-new-orders')


    //Select clicked element
    var ele = $(this).find(":checkbox");
    

    if ($(':checked').length){
        items.css("display", "none"); //Hide items view
        orders.css("display", "block"); //Show orders view
        formpad.css("display", "none"); //Hide this because it fixes other stuff
        oldorders.style.display = "block"
        neworders.style.display = "block"
    } else {
        items.css("display", "block");
        orders.css("display", "none");
        formpad.css("display", "block");
        oldorders.style.display = "none"
        neworders.style.display = "none"
    }


});

/* Listen to filter checkbox clicks for filtering items */
var $filterCheckboxes = $('label.checkbox-container input[type="checkbox"]');
$filterCheckboxes.on('change', function() {
    
    var selectedFilters = {};

    $filterCheckboxes.filter(':checked').each(function() {
        console.log("this.id= " + this.id);
        if ( ! selectedFilters.hasOwnProperty( this.id ) ) {
            selectedFilters[ this.id ] = 1;
            console.log(selectedFilters);
        } else {
            selectedFilters[ this.id ] = 0;
        }
    } );    

    //apply filters
    $filterableSecs = $('section');
    var numFilters = Object.keys(selectedFilters).length;
    if (numFilters > 0){
        $filterableSecs.hide();

        for (var i=0; i < $filterableSecs.length; i++){
            if($filterableSecs[i].className in selectedFilters){
                console.log("match: " + $filterableSecs[i].className);
                $filterableSecs.eq(i).show();
            }   
        }


    } else if(numFilters === 0) { 
        $filterableSecs.show();
    }

} );


// LOGOUT
adminLogOut.onclick = function() {
    logoutInfo = {
        POSTTYPE : "logout"
    }
    url = "https://web.njit.edu/~mjk29/cap/sqlPHPRx.php"
    $.ajax({
        type: "POST",
        url: url,
        data: logoutInfo,
        success: function (data) {
            window.location.href = "index.html";

            },
    });
}

function addItem() {



    if (confirm("Add item?")) {
        // Check for TSV file
        if ( tsvMode == 1 ) {
            insertItemFromCSV(itemArray)
            return
        }

 	var itemInput ={
		itemName :document.getElementById("item-name"),
		itemKeywords: document.getElementById("item-keywords"),
		itemDesc :document.getElementById("item-description"),
		itemConsume :document.getElementById("item-consumable"),
		itemAvail: document.getElementById("item-quantity"),
		itemPrice :document.getElementById("item-price"),
		itemLink: document.getElementById("item-link"),
		itemLoc :document.getElementById("item-location"),
		itemDataS :document.getElementById("item-datasheet"),
 	}
 	// Validation Function
	if(validateItemInput(itemInput) == 0){
		return
	}

    var objectToAdd ={
	    SKU:   btoa(itemInput.itemName.value),
	    Name: itemInput.itemName.value,
	    Keywords: itemInput.itemKeywords.value,
	    Description: itemInput.itemDesc.value,
	    Consumable : itemInput.itemConsume.checked,
	    Availability: itemInput.itemAvail.value,
	    Price: itemInput.itemPrice.value,
	    Link :itemInput.itemLink.value,
	    Image :imageFileName,
	    Location: itemInput.itemLoc.value,
	    Datasheet:datasheetFileName,
	    ImageData:imageFile,
	    DatasheetData:datasheetFile,
	    POSTTYPE : "item"
    }

    // FOR TESTING
    // var objectToAdd ={
	   //  SKU:   Math.floor(Math.random() * 10000),
	   //  Name: "itemName.value",
	   //  Keywords: "itemKeywords.value",
	   //  Description: "itemDesc.value",
	   //  Consumable : "itemConsume.checked",
	   //  Availability: "itemAvail.value",
	   //  Price: "itemPrice.value",
	   //  Link :"itemLink.value",
	   //  Image :"imageFileName",
	   //  Location: "itemLoc.value",
	   //  Datasheet:"itemDataS.value",
	   //  ImageData:"imageFile",
	   //  DatasheetData:datasheetFile,
	   //  POSTTYPE : "item"
    // }

    if (objectToAdd.Consumable) {
        objectToAdd.Consumable = 1
    }
    else{
        objectToAdd.Consumable = 0
    }

    url = "oracleDBConn.php"
    $.ajax({
        type: 'POST',
        url: url,
        data: objectToAdd,
        success: function (data) {
        	console.log(data)
            result = JSON.parse(data)
            console.log("return data : "+data)
            console.log("PARSED DATA")
            console.log(result)
            if (result.result == "success") {
                // successModalPopup(data)
                successModalPopup(data)
            }
            else{
                // alert("An error has occurred\n"+result.result)
                successModalPopup(data)
            }
        },
    });
}
}

/* ------------------- ADD ITEMS ACTIONS ------------------- */
	var imageFileName
	var datasheetFileName = null
	var imageFile
	var datasheetFile

    // THis runs when an image is selected
    // Sets the image path to a global to be used by AddItem()
    $(document).ready(function() {
        // Runs on image input change
        $('#item-image').on('change', function(e) {
            function loaded(evt) {
                // vaildate image
                if (validateImage(evt.target.result) == false) {
                    $('#item-image-label').html("Image not valid")
                    $('#item-image-label').css("background-color", "#ffcccc");
                }
                else{
                    imageFile = evt.target.result;
                    imageFileName = e.target.files[0].name
                    $('#item-image-label').css("background-color", "#FFFFFF");
                    $('#item-image-label').html(imageFileName)
                }
            }
            res = readFile(this.files[0]);
            reader = new FileReader();
            reader.readAsDataURL(this.files[0]);
            reader.onload = loaded;
        });
    });

	// THIS is for parsing datasheets
    $(document).ready(function() {
        $('#item-datasheet').on('change', function(e) {
            function loaded(evt) {
                if (validateDatasheet(evt.target.result) == false) {
                    $('#item-datasheet-label').html("Datasheet not valid")
                    $('#item-datasheet-label').css("background-color", "#ffcccc");
                }
                else{
                    datasheetFile = evt.target.result;
                    $('#item-datasheet-label').css("background-color", "#FFFFFF");
                    $('#item-datasheet-label').html(e.target.files[0].name)
                }

            }
            var res = readFile(this.files[0]);
            var reader = new FileReader();
            reader.readAsDataURL(this.files[0]);
            datasheetFileName = e.target.files[0].name
            // Updates the imge label to show filename
            $('#item-datasheet-label').html(datasheetFileName)
            reader.onload = loaded;
        });
    });







// Listen for file uploads
// $('#item-image').on('click', function(){
//     var filename = $(this).val().split('\\').pop();
//     alert(filename);
//     //add element to html that is initially blank and populate it with the filename on upload 
// });


function check(element) {
    var textAreaElement = document.getElementById("rowDataFromSpreadsheet")
    var rowInputData = textAreaElement.value
    console.log(rowInputData)
    event = new Event('change');
    textAreaElement.value = element.value;
    textAreaElement.dispatchEvent(event);
    parseRowData(rowInputData)
};


function parseRowData(rowData) {
    var tabs = rowData.split('\t');
    tabs.length=11
    tabs[3] = parseInt(tabs[3])
    console.log(tabs)

    // document.getElementById("sku_formatted").value = tabs[0]
    document.getElementById("item-keywords").value = tabs[1]
    document.getElementById("item-description").value = tabs[2]
    document.getElementById("item-consumable").checked = tabs[3]
    document.getElementById("item-quantity").value = tabs[4]
    document.getElementById("item-price").value = tabs[5]
    document.getElementById("item-link").value = tabs[6]
    document.getElementById("item-name").value = tabs[7]
    document.getElementById("item-image-label").value = tabs[8]
    document.getElementById("item-location").value = tabs[9]
    document.getElementById("item-datasheet").value = tabs[10]
}


// MODAL FUNCTIONS
var itemDumpModal = document.getElementById('itemDumpModal');
var qrModal = document.getElementById('QRModal');
var responseModal = document.getElementById('responseModal');
var helpModal = document.getElementById('helpModal');


window.onclick = function(event) {
    if (event.target == itemDumpModal) {
        itemDumpModal.style.display = "none";
    }
    if (event.target == qrModal) {
        qrModal.style.display = "none";
        document.getElementById("qrcode").innerHTML = "";
    }
    if (event.target == responseModal) {
        responseModal.style.display = "none";
        // document.getElementById("qrcode").innerHTML = "";
    }
    if (event.target == helpModal){
        helpModal.style.display = "none"
    }
    if (event.target == scannerModal){
        scannerModal.style.display = "none"
        scanner.stop()
        clearQRReader()
    }    
}

function openModalForDump(){
    itemDumpModal.style.display = "block";
}



function successModalPopup(responseText) {
    responseModal.style.display="block"
    responseTextDisplay = document.getElementById('responseModalText')
    decodedText = JSON.parse(responseText)
    string = ""
    for(var key in decodedText){
        string+= key +" : "+decodedText[key]
    }
    responseTextDisplay.innerHTML = string 
}

// This is for logging error messages on Insert Item
// Mainly built fo csv insert
function tsvResponseMessage(response){
    // object for storing errors
    resultLog={
        successful_Inserts:0,
        failed_Inserts:0,
    }
    for (var i = 0; i < response.length; i++) {
        parsedData = JSON.parse(response[i])
        if (parsedData.result == "success") {
            resultLog.successful_Inserts+=1
        }
        // If the insert is a failure
        else{
            resultLog.failed_Inserts+=1
            // This works by adding a new key to resultLog for 
            // each unique error message
            // Check if the key exists, if so push the name of the 
            // item to the error message array
            if (parsedData.result in resultLog) {
                resultLog[parsedData.result].push(parsedData.statement)
            }
            // If the key does not exist, create it and give it an array
            else{
                resultLog[parsedData.result]=[]
            }
        }
    }
    // Show the response modal
    responseModal.style.display="block"
    responseTextDisplay = document.getElementById('responseModalText')
 
    // Create a string for display and fill it with everything in the log
    erroString = ""
    erroString += "successful_Inserts : " + resultLog["successful_Inserts"]+"<br>"
    erroString += "failed_Inserts : " + resultLog["failed_Inserts"]+"<br>"
    delete resultLog["failed_Inserts"]
    delete resultLog["successful_Inserts"]

    for(key in resultLog){
        erroString += key + ": " 
        for (var i = 0; i < resultLog[key].length; i++) {
        	erroString +=resultLog[key][i]+"<br>"
        }

        // + resultLog[key]+"<br>"
    }
    responseTextDisplay.innerHTML = erroString
}


// this._htOption = {
//             width : 256, 
//             height : 256,
//             typeNumber : 4,
//             colorDark : "#000000",
//             colorLight : "#ffffff",
//             correctLevel : QRErrorCorrectLevel.H
//         };

// QR GENERATION
// This is utilizing QR generation code from a repository
// The code for this is in qrcode.js
// This function invokes it
function generateQR(SKUCode) {
    // Unhide the qr modal
    qrModal.style.display = "block";
    $.getScript('../cap/VanillaQR.js', function(){
        qr2 = new VanillaQR({
            url: SKUCode,
            width: 256,
            height: 256,
            colorLight: "#FFFFFF",
            colorDark: "#000000",
            borderSize: 2
        });
        var canvas = document.getElementById("qrCanvas");

        var ctx = canvas.getContext("2d");
          imageElement = qr2.toImage("png");
        imageElement.onload = function() {
          ctx.drawImage(imageElement, 0, 0);
        };
    });
}

//Read in spreadhseet
var tsvMode = 0
$(document).ready(function() {
    $('#item-spreadsheet').on('change', function(e) {
        function loaded(evt) {
        	if (validateTSV(evt.target.result) == false) {
                $('#item-spreadsheet-label').html("Tab Seperated File Not Valid")
                $('#item-spreadsheet-label').css("background-color", "#ffcccc");
            }
            else{
                imageFile = evt.target.result;
                $('#item-spreadsheet-label').css("background-color", "#FFFFFF");
                $('#item-spreadsheet-label').html(e.target.files[0].name)
            }


            tsvFileString = evt.target.result;
            itemArray = csvToObj(tsvFileString)
            // Moving the upload function from automatic to submit button
            // insertItemFromCSV(itemArray)
        }
        var res = readFile(this.files[0]);
        var reader = new FileReader();
        reader.readAsText(this.files[0], "UTF-8");
        //document.getElementById('custom-tab-label').innerHTML = reader.fileName
        $('#item-spreadsheet-label').html(e.target.files[0].name)
        tsvMode = 1
        reader.onload = loaded;
    });
});


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
    itemArr = csvString.split('\n')
    colNames = itemArr.shift().split('\t')
    // Google docs adds a \r carriage  return to the end of a line
    // It breaks the JSliteral string for the key of the last colname
    // I was removing this in php, but it needs to be removed here
    const tsvRegex = /[\n\r]+/g;
	colNames[colNames.length-1] = colNames[colNames.length-1].replace(/[\n\r]+/g, '');
    itemObjectArray = []

    for (var i = 0; i < itemArr.length; i++) {
        let tempItemArr = itemArr[i].split('\t')
        let tempItemObj = {}
        for (var j = 0; j < colNames.length; j++) {
			// var regexResult = tsvRegex.test(tempItemArr[j])
			// if (regexResult == 1) {
				tempItemObj[ colNames[j]] = tempItemArr[j].replace(/[\n\r]+/g, '')
			// }
        }   
        itemObjectArray.push(tempItemObj)
    }
    return itemObjectArray
}




function insertItemFromCSV(csvObj) {
    csvObj = replaceSKU(csvObj)
    jsondata = JSON.stringify(csvObj)
    var url = 'oracleDBConn.php'; 
    parray = []
    for (var i = 1; i < csvObj.length; i++) {
        if (csvObj[i].IMAGE.length == 0) {
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
            data: sendData,
            success: function (data) {
            	console.log(data)
                parray.push(data)
            },
        });
    }
    setTimeout(function(){
     tsvResponseMessage(parray)
    }, 3000);
}




function replaceSKU(itmArr) {
    for (var i = 0; i < itmArr.length; i++) {
        itmArr[i].SKU = btoa(itmArr[i].NAME)
    }
    return itmArr

}


function uploadSpreadsheet() {
    console.log(itemArray)
    insertItemFromCSV(itemArray)

}


function printQR(){
    console.log("test")
}

//If checkbox is clicked send query
$('#action-view-new-orders input').change(function(){

    //Clear main view
    $("main.transaction-view").html(" ");


    //deselect other checkboxes
    $('input.view-orders').not(this).prop('checked', false);

    if (this.checked){
        sendData  = {
            // Set pending to 0 or 1
            PENDING: 0,
            POSTTYPE : "queryPending"
        }
        $.ajax({
            type: 'POST',
            url: "https://web.njit.edu/~mjk29/cap/oracleDBConn.php",
            data: sendData,
            success: function(data) {
                console.log(data)
                parsed = JSON.parse(data)
                populatePendingOrders(parsed)
            },
        });
    }
})

//If checkbox is clicked send query
$('#action-view-completed-orders input').change(function(){

    //Clear main view
    $("main.transaction-view").html(" ");

    //deselect other checkboxes
    $('input.view-orders').not(this).prop('checked', false);


    if (this.checked){
        sendData  = {
            // Set pending to 0 or 1
            PENDING: 1,
            POSTTYPE : "queryPending"
        }
        $.ajax({
            type: 'POST',
            url: "https://web.njit.edu/~mjk29/cap/oracleDBConn.php",
            data: sendData,
            success: function(data) {
                parsed = JSON.parse(data)
                populateCompletedOrders(parsed)
            },
        });
    }
})


//TODO
function populatePendingOrders(json){

    //Populate header
    let header = document.createElement('div')
    header.className = "view-orders-header"
    let headerText = document.createElement('h1')
    headerText.innerHTML = "View New Orders"
    header.appendChild(headerText)

    //Parent element to append transaction divs to
    let orders = document.querySelector('main.transaction-view')
    orders.append(header)


    //Decode JSON response
    for (let i=0; i < json.length; i++){

        //Create elements
        let row = document.createElement('div') //Parent element for two below divs
        let orderDiv = document.createElement('div') //holds info for each transaction
        let orderActions = document.createElement('div')
        let transid = document.createElement('h2')
        let ucid = document.createElement('h3')
        let subtotal = document.createElement('h3')
        let finishOrder = document.createElement('button')

        //Add classnames for styling
        row.className = "row"
        orderDiv.className = "order-info col-9"
        orderActions.className = "order-actions col-3"
        transid.className = "trans-id"
        ucid.className = "ucid"
        subtotal.className = "subtotal"
        finishOrder.className = "finish-order-btn btn btn-danger"

        //For retrieving ID
        transid.value = json[i].TRANSACTIONID
        orderActions.id = json[i].TRANSACTIONID

        //Fill in text for buttons
        finishOrder.innerHTML = "Finish order"

        //Decide json
        transid.innerHTML = "Transaction ID: " + json[i].TRANSACTIONID
        ucid.innerHTML = "Student ID: " + json[i].UCID
        subtotal.innerHTML = "Order Subtotal: $" + json[i].SUBTOTAL

        ITEMDATA = JSON.parse(json[i].ITEMDATA)
        //console.log("ITEMDATA PARSE")
        //console.log(ITEMDATA)

        //APPEND PRE ITEM DATA
        orderDiv.appendChild(transid)
        orderDiv.appendChild(ucid)

        for (let j=0; j < ITEMDATA.length; j++){
            console.log(ITEMDATA[j])

            //CREATE ELEMENTS FOR EACH ITEM
            let sku = document.createElement('h3')
            let itemname = document.createElement('h3')
            let checkedin = document.createElement('h3')
            let checkedout = document.createElement('h3')
            let price = document.createElement('h3')

            //ADD CSS FOR EACH ITEM
            itemname.className = "item-name"
            price.className = "price"
            sku.className = "sku"
            checkedin.className = "checked-in"
            checkedout.className = "checked-out"

            //FILL IN DATA FOR EACH ITEM
            sku.innerHTML = "Item SKU: " + ITEMDATA[j].SKU
            itemname.innerHTML = "Item name: " + ITEMDATA[j].ITEMNAME
            checkedin.innerHTML= "Quantity returned: " + ITEMDATA[j].CHECKEDIN
            checkedout.innerHTML = "Quantity checked out: " + ITEMDATA[j].CHECKEDOUT
            price.innerHTML = "Item Price: $" + ITEMDATA[j].PRICE
            
            orderDiv.appendChild(itemname)
            orderDiv.appendChild(price)
            orderDiv.appendChild(sku)
            orderDiv.appendChild(checkedin)
            orderDiv.appendChild(checkedout)

        }

        orderDiv.appendChild(subtotal)

        orderActions.appendChild(finishOrder)

        row.appendChild(orderDiv)
        row.appendChild(orderActions)

        finishOrder.addEventListener("click", function(){
            let transactionID = $(this).closest('div').attr('id')
            let transaction = $(this).closest('div.row')
            transaction.hide(1000)
            sendUpdate(transactionID)

        });

        orders.appendChild(row)

    }

    //post type = updatetransaction

}

//TODO
function populateCompletedOrders(json){
    
    //Populate header
    let header = document.createElement('div')
    let headerText = document.createElement('h1')
    header.className = "view-orders-header"
    headerText.innerHTML = "View Completed Orders"
    header.appendChild(headerText)

    //Parent element to append transaction divs to
    let orders = document.querySelector('main.transaction-view')
    orders.appendChild(header)

    //Decode JSON response
    for (let i=0; i < json.length; i++){

        //Create Elements
        let parent = document.createElement('div') //holds info for each transaction
        let transid = document.createElement('h3')
        let ucid = document.createElement('h3')
        let subtotal = document.createElement('h3')

        //Decide json
        transid.innerHTML = "Transaction ID: " + json[i].TRANSACTIONID
        ucid.innerHTML = "Student ID: " + json[i].UCID
        subtotal.innerHTML = "Order Subtotal: $" + json[i].SUBTOTAL

        ITEMDATA = JSON.parse(json[i].ITEMDATA)
        //console.log("ITEMDATA PARSE")
        //console.log(ITEMDATA)

        for (let j=0; j < ITEMDATA.length; j++){

            //Create elements
            let sku = document.createElement('h3')
            let itemname = document.createElement('h3')
            let checkedin = document.createElement('h3')
            let checkedout = document.createElement('h3')
            let price = document.createElement('h3')

            sku.innerHTML = "Item SKU: " + ITEMDATA[j].SKU
            itemname.innerHTML = "Item name: " + ITEMDATA[j].ITEMNAME
            checkedin.innerHTML= "Quantity returned: " + ITEMDATA[j].CHECKEDIN
            checkedout.innerHTML = "Quantity checked out: " + ITEMDATA[j].CHECKEDOUT
            price.innerHTML = "Item Price: $" + ITEMDATA[j].PRICE

            itemname.className = "item-name"
            price.className = "price"
            sku.className = "sku"
            checkedin.className = "checked-in"
            checkedout.className = "checked-out"

            parent.appendChild(ucid)
            parent.appendChild(itemname)
            parent.appendChild(price)
            parent.appendChild(sku)
            parent.appendChild(checkedin)
            parent.appendChild(checkedout)
        }
        
        //Add classnames for styling
        parent.className = "trans-parent"
        transid.className = "trans-id"
        ucid.className = "ucid"
        subtotal.className = "subtotal"
  
        parent.appendChild(transid)
        parent.appendChild(subtotal)
        
        orders.appendChild(parent)
    }
}


function sendUpdate(transID) {
    console.log('sending update')
    sendData  = {
        transactionID: transID,
        POSTTYPE : "updateTransaction"
    }
    $.ajax({
        type: 'POST',
        url: "https://web.njit.edu/~mjk29/cap/oracleDBConn.php",
        data: sendData,
        success: function(data) {
            console.log("SEND UPDATE")
            console.log(data)
            // displayQRResult(data)
        },
    });
}

//For deleting items from database
//TODO Probably needs an each loop
function deleteItems(){

    console.log("delete items")
    let checkbox = document.querySelector('#action-delete-item input')
    
    let deleteButton = document.querySelector('.delete-button')

    if (checkbox.checked){
        deleteButton.style.display = "block"
    } else {
        deleteButton.style.display = "none"
    }
}

// let deletebutton = $('button .delete-button')
// deletebutton.on(click, function(){

//     console.log("delete clicked")

//     if ($(':checked').length){
//         deletebutton.style.display = "block"
//     } else {
//         deletebutton.style.display = "none"
//     }
// });

// validations
function validateItemInput(itemInput){
	var flag = 1
	if (itemInput.itemName.value.length == 0) {
		itemInput.itemName.style.backgroundColor = "#ffcccc";
		flag = 0
	}else{
		itemInput.itemName.style.backgroundColor = "#FFFFFF";
	}

	if (itemInput.itemKeywords.value.length == 0) {
		itemInput.itemKeywords.style.backgroundColor = "#ffcccc";
		flag = 0
	}else{
		itemInput.itemKeywords.style.backgroundColor = "#FFFFFF";
	}

	if (itemInput.itemAvail.value.length == 0) {
		itemInput.itemAvail.style.backgroundColor = "#ffcccc";
		flag = 0
	}else{
		itemInput.itemAvail.style.backgroundColor = "#FFFFFF";
	}

	if (itemInput.itemPrice.value.length == 0) {
		itemInput.itemPrice.style.backgroundColor = "#ffcccc";
		flag = 0
	}else{
		itemInput.itemPrice.style.backgroundColor = "#FFFFFF";
	}	

	if ($('#item-image')[0].value.length == 0) {
		$('#item-image-label').css("background-color", "#ffcccc");
		flag = 0
	}else{
		$('#item-image-label').css("background-color", "#FFFFFF");
	}

	return flag
}

function validateImage(b64ImgStr){
    // These are the 64b headers for the following image files
    // For reference, dont delete
    
        // PNG Header
        // data:image/png;base64,iVBORw0KGgo=

        // JPG Group Headers
        // data:image/jpeg;base64,/9g=
        // data:image/jpeg;base64,/9j/

        // GIF Header
        // data:image/gif;base64,R0lGOA== 

        // WEBP Header
        // UklGR
        // data:image/webp;base64,UklGR

    // regex string for finding the valid headers
    const imgRegex = /(\/9g=)|(\/9j\/)|(iVBORw0KG)|(R0lGODlh)|(UklGR)/gm;
    const webPRegex = /UklGR/gm;
    // Faster to split the header string and regex only first 25 characters
    var dataHeaderID = b64ImgStr.split(',')[1].substring(0,25)    
    var regexResult = imgRegex.test(dataHeaderID)
    if (regexResult == 1) {
        if (webpValidate = webPRegex.test(dataHeaderID)) {
            alert("WEBP Format not compatible with all browsers")
        }
    }
    return regexResult
}


function validateDatasheet(b64DataStr){
     const imgRegex = /(JVBER)/gm;
    // Faster to split the header string and regex only first 25 characters
    dataHeaderID = b64DataStr.split(',')[1].substring(0,25)    
    regexResult = imgRegex.test(dataHeaderID)
    return regexResult

}


function validateTSV(tsvData) {
    tsvLines = tsvData.split('\n')
    if (tsvLines.length > 2){
        colCounter = tsvLines[0].split('\t').length
        for (var i = 1; i < tsvLines.length; i++) {
            if (tsvLines[i].split('\t').length != colCounter) {
				return 0
            }
        }
    }
    else{
		return 0
	}
    return 1

}


function searchForItems() {
   // init sending data
   sendData  = {
        USER: "admin",
        searchCol: "NAME",
        searchText: "",
        POSTTYPE : "search"
    }
    // Array of valid columns to search
    var validCols = ["keywords","description", "price",
     "name", "image", "location", "datasheet"]
    // get the string from the input field
    var searchString = $('#searchBar')[0].value.toLowerCase()

    const helpRegex = /\s*\?help\s*$/gm;
    if (helpRegex.test(searchString) == true) {
	    var helpModal = document.getElementById('helpModal');
	    var helpModalText = document.getElementById('helpModalText');
	    helpModal.style.display = "block";

	    helpModalText.innerHTML = `
	        Search feature tutorial<br>
	        Search a string returns matching item names<br>
	        Search with <br>
	        descriptor : value<br>
	        name : raspberrypi<br>
	        description : GPIO<br>
	        keywords : microcontroller<br>
	        location : drawer 1d<br>
	        image : pi.png<br>
	        datasheet : userguide.pdf<br><br>
	        Search for price<br>
	        price : < 15<br>
	        price : > 9<br>
	        price : > 9 and < 15<br>
	        price : < 9 or > 15<br>
	        price : = 15.99<br><br>`

		return
    }

    // check if the search is a column:term type search
    if (searchString.indexOf(':') > -1){
        categorySearch = searchString.split(':')

        // Check if the input column is valid for searching
        if (validCols.includes(categorySearch[0])) {
            sendData.searchCol = categorySearch[0]
        }else{
            alert("not valid search column")
        }
        // Checks for price statements
        // This regex is for validating the search entry for price
		var priceRegex = new RegExp(/(\s*[<->]\s*\d{1,6}(.\d{2})?)(\s*(and|or)\s*([<->])\s*(\d{1,6}(.\d{2})?))?\s*$/);
        if (categorySearch[0] == "price") {
        	// testing if the input string is valid
			var regexValid = priceRegex.test(categorySearch[1]);	
			if (regexValid == false) {
				alert("bad string")
				return
			}
			// String is valid
			// It needs to be formatted into the correct type for oracle
			// where an input string will be something like
			// price: =10.99 or>19
			// but oracle needs WHERE PRICE = 1.99 OR PRICE > 19
			// Most of this function is just inserting the extra price
			else{
				regexResult = priceRegex.exec(categorySearch[1]);
				// Check for or || and, format string if true
				if (regexResult[4] == 'or'|| regexResult[4] == 'and') {
					regexResult.splice(5, 0, " price ");
					regexString = regexResult[1]+" "+regexResult[4]+regexResult[5]+regexResult[6]+regexResult[7]
					sendData.searchText = regexString
				}
				// If no or || and the string does not need to be formatted
				else{
					sendData.searchText = categorySearch[1]
				}				
			}			
        }
        else{
        // Set the search text
        sendData.searchText = categorySearch[1]
    	}
    }
    // base case, search for whole input string in NAME
    else{
        sendData.searchText = searchString
    }
    // Send the query
    $.ajax({
        type: 'POST',
        url: "https://web.njit.edu/~mjk29/cap/oracleDBConn.php",
        data: sendData,
        success: function(data) {
        	console.log(data)
        	parsedSearch = JSON.parse(data)
        	// If the query returns nothing, this writes a nothing found message
        	if (parsedSearch.length==0) {
        		parsedSearch = JSON.parse(
				`[{"SKU":"No Item Available","KEYWORDS":"null","DESCRIPTION":"","CONSUMABLE":"0",
				"AVAILABILITY":"","PRICE":"","LINK":"","NAME":"No Items Found","IMAGE":"../cap/images/placeholder.png",
				"LOCATION":"","DATASHEET":null,"DATEADDED":""}]`)
        	}
            populate2(parsedSearch);
        },
    });
}

// 
// Code for the QR scanner
// 
externCameras = ""
var scannerModal = document.getElementById('scannerModal');
function qrScanner() {
	// Open Modal
	scannerModal.style.display = "block";
	// Creating new scanner object, refer to the documentation for information
	scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
	// Listens for successful QR read, then sends that string to the search
	scanner.addListener('scan', function (content) {
		// content holds the scanned qr string
		// Its a listener function, data can be sent, but not returned. 
		scanSearch(content)
	});
	// Init camera
	Instascan.Camera.getCameras().then(function (cameras) {
		if (cameras.length > 0) {
			externCameras = cameras[0]
			if (cameras.length > 1) {
				const camRegex = /back/gm;
				camFlag = 0
				camList = ""
				for (var i = 0; i < cameras.length; i++) {
					camList +=cameras[i].name
					if(camRegex.test(cameras[i].name)){
						scanner.start(cameras[i]);
						camFlag = 1
					}
				}
				if (camFlag == 0) {
					scanner.start(cameras[0]);
				}
			}else{
				scanner.start(cameras[0]);
			}
			alert(camList)

			// var cameraSelect = document.getElementById('cameraSelect');
			// console.log(scanner.activeCameraId)
			// for (var i = 0; i < cameras.length+1; i++) {
				// cameraSelect.innerHTML += '<option value="cameras['+i+']">'+cameras[i].name+'</option>'
				// cameraSelect.innerHTML += '<option value="cameras['+i+']">test</option>'

			// }
			// scanner.start(cameraSelect.options[cameraSelect.selectedIndex].value);

			// cameraSelect.addEventListener("change", changeCamera);
			// cameraSelect.onchange = function(){
				// changeCamera()
				// scanner.start(cameraSelect.options[cameraSelect.selectedIndex].value);
				// cameras.selectCamera(camera[1])
				// console.log('test')
			// };


		} else {
			console.error('No cameras found.');
		}
	}).catch(function (e) {
		console.error(e);
	});
}

function changeCamera() {
	// scanner.stop()
	// var cameraSelect = document.getElementById('cameraSelect');
	// scanner.start(cameraSelect.options[cameraSelect.selectedIndex].value);
	scanner.start(externCameras[1])
}


function scanSearch(searchText) {
	// Creates query data to send to oracle
	sendData  = {
        USER: "admin",
        searchCol: "SKU",
        searchText: searchText,
        POSTTYPE : "search"
    }
    $.ajax({
        type: 'POST',
        url: "https://web.njit.edu/~mjk29/cap/oracleDBConn.php",
        data: sendData,
        success: function(data) {
			displayQRResult(data)
        },
    });
}

// 
// These 2 are for writing the query result to the modal
// And for clearing the written data to the modal
// 
function displayQRResult(resultData){
	decodedResult = JSON.parse(resultData)
	console.log(decodedResult[0].IMAGE)
	document.getElementById('scannerResultImage').src = decodedResult[0].IMAGE
	document.getElementById('scannerResultImage').style.visibility = "visible";
	document.getElementById('scannerResultName').innerHTML = decodedResult[0].NAME
	document.getElementById('scannerResultPrice').innerHTML = "$"+decodedResult[0].PRICE
	document.getElementById('scannerResultAvailibility').innerHTML = "In Stock : "+decodedResult[0].AVAILABILITY
	if (decodedResult[0].LOCATION != null) {
		document.getElementById('scannerResultLocation').innerHTML = "Location : "+decodedResult[0].LOCATION
	}else{
		document.getElementById('scannerResultLocation').innerHTML = ""
	}
}

function clearQRReader() {
	document.getElementById('scannerResultImage').src = ""
	document.getElementById('scannerResultImage').style.visibility = "hidden";
	document.getElementById('scannerResultName').innerHTML = ""
	document.getElementById('scannerResultPrice').innerHTML = ""
	document.getElementById('scannerResultAvailibility').innerHTML = ""
	document.getElementById('scannerResultLocation').innerHTML = ""	
}

// $(function checkMobile(){
// 			console.log("]]]]]]]]]]]]]]]]]]]]]]")
// 	window.mobilecheck = function() {
// 		 mobocheck = false;
// 		(function(a){
// 			if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
// 			 mobocheck = true;
// 			alert(mobocheck)
// 		})
// 		(navigator.userAgent||navigator.vendor||window.opera);
// 		console.log("asdasdasdasd"+mobocheck);
// 	};
// });



// $(function loadScannerVue() {
// 	console.log("&*&*&*&*&*&**&&*")
// 	$.getScript('vue.min.js', function(){
// 		 app = new Vue({
// 			el: '#app',
// 			data: {
// 				scanner: null,
// 				activeCameraId: null,
// 				cameras: [],
// 				scans: []
// 			},
// 			mounted: function () {
// 				var self = this;
// 				self.scanner = new Instascan.Scanner({ 
// 					video: document.getElementById('preview'), scanPeriod: 5 
// 				});
// 				self.scanner.addListener('scan', function (content, image) {
// 					self.scans.unshift({
// 						date: +(Date.now()), content: content 
// 					});
// 				});
// 				Instascan.Camera.getCameras().then(function (cameras) {
// 					self.cameras = cameras;
// 					if (cameras.length > 0) {
// 						self.activeCameraId = cameras[0].id;
// 						self.scanner.start(cameras[0]);
// 					} else {
// 						console.error('No cameras found.');
// 					}
// 				}).catch(function (e) {
// 					console.error(e);
// 				});
// 			},
// 			methods: {
// 				formatName: function (name) {
// 					return name || '(unknown)';
// 				},
// 				selectCamera: function (camera) {
// 					this.activeCameraId = camera.id;
// 					this.scanner.start(camera);
// 				}
// 			}
// 		});
// 	});
// });




function testUpdate() {
    console.log('sending')
    sendData  = {
        transactionID: '100044',
        POSTTYPE : "updateTransaction"
    }
    $.ajax({
        type: 'POST',
        url: "https://web.njit.edu/~mjk29/cap/oracleDBConn.php",
        data: sendData,
        success: function(data) {
            console.log(data)
            // displayQRResult(data)
        },
    });
}




function DownloadTSV( ) {
console.log('sending')
    sendData  = {
        POSTTYPE : "downloadTSV"
    }
    $.ajax({
        type: 'POST',
        url: "https://web.njit.edu/~mjk29/cap/oracleDBConn.php",
        data: sendData,
        success: function(data) {
            console.log(data)
		    var element = document.createElement('a');
            element.setAttribute('href', data);
    		element.setAttribute('download', "IMS_TSV_FILE.tsv");
			element.style.display = 'none';
		    document.body.appendChild(element);
		    element.click();
		    document.body.removeChild(element);
        },
    });

}

