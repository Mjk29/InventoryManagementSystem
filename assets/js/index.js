
var URL = "https://web.njit.edu/~mjk29/cap/sqlPHPRx.php";
var body = document.querySelector('main');
var responseJSON;
var responseCartJson;
var cartitems = {}; //holds users cart items

 

//Generates the initial json request when page first loads
function generateInitJSON(){

    let requestJSON = {
		tableName: "inventory2",
		distinct : "1",
        query: "*",
        column : "Keywords",
        where : [],
        POSTTYPE: "getAll"
    }
    // console.log("Json request:");
    // console.log(requestJSON);

    //Sends request
    $.ajax({
        type: 'POST',
        url: "https://web.njit.edu/~mjk29/cap/oracleDBConn.php",
        // url: URL,
        data: requestJSON,
        success: function(data) {
            // console.log(data)
            responseJSON = JSON.parse(data);
            // console.log("Json response:")
            // console.log(responseJSON);
            populate(responseJSON);
        },
    });
}

//Listen to checkbox clicks for filtering items
var $filterCheckboxes = $('label.checkbox-container input[type="checkbox"]');
$filterCheckboxes.on('change', function() {
    
    var selectedFilters = {};

    $filterCheckboxes.filter(':checked').each(function() {
        //console.log("this.id= " + this.id);
        if ( ! selectedFilters.hasOwnProperty( this.id ) ) {
            selectedFilters[ this.id ] = 1;
            //console.log(selectedFilters);
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
                //console.log("match: " + $filterableSecs[i].className);
                $filterableSecs.eq(i).show();
            }   
        }


    } else if(numFilters === 0) { 
        $filterableSecs.show();
    }

} );


//Decipthers JSON and populates the body
function populate(queryReturn){
    //Clear body before populating
    while (body.firstChild) {
        body.removeChild(body.firstChild);
    }

    //Populate index body.main with items
    for (var i=0; i < queryReturn.length; i++){

        //create parent element
        var section = document.createElement('section'); 
        section.id = queryReturn[i].SKU; // SKU = ID of item to be sold

        //Each section element contains one of each of the below element
        var imgDiv = document.createElement('div');  
        var itemDiv = document.createElement('div')
        var formDiv = document.createElement('div');
        var item = document.createElement('h1');
        var desc = document.createElement('h2');
        var qty = document.createElement('h3');
        var qtyRaw = document.createElement('h3');
        var price = document.createElement('h3');
        var img = document.createElement('img');
        var hr = document.createElement('hr');
        var br = document.createElement('br');
        var datasheetLink = document.createElement('A');
        var datasheet = document.createElement('h3');
        var counter = document.createElement('input')

        //Place data into element
        //div.id = json[i][1];
        item.textContent =  queryReturn[i].NAME;
        item.className = "itemSku"

        //Place data into each child element of section
        item.textContent =  queryReturn[i].NAME;
        desc.textContent = queryReturn[i].DESCRIPTION;
        qty.textContent = "# In stock: " + queryReturn[i].AVAILABILITY;
        qtyRaw.textContent = queryReturn[i].AVAILABILITY;
        price.textContent = "Unit price: " + queryReturn[i].PRICE;

        //Add classes to elements
        section.className = queryReturn[i].KEYWORDS;
        imgDiv.className = 'img-content';
        itemDiv.className = 'item-content';
        formDiv.className = 'form-content';
        desc.className = 'description';
        qty.className = 'max-quantity';
       
        qtyRaw.className = 'qty-raw';
        qtyRaw.value = queryReturn[i].AVAILABILITY;

        

        //Attempt to load image from DB
        let currentImgString = queryReturn[i].IMAGE
        // console.log("HERE IS THE CURENT IMG STRING"+currentImgString)
        if (currentImgString.localeCompare("No Image")) {
            img.src=queryReturn[i].IMAGE;
        } else {
            img.src="../cap/images/placeholder.png";
        }

        //Checking for database datasheet
        if (queryReturn[i].DATASHEET == null) {
            datasheetLink.textContent = "No datasheet available"  
        } else {
            datasheetLink.href = queryReturn[i].DATASHEET;
            datasheetLink.textContent = "Datasheet"
        }
        
        //This sets css for the link
        var linkClone = datasheetLink.cloneNode(true);
        datasheet.appendChild(linkClone);


        //Append image to image div
        imgDiv.appendChild(img);


        //Append elements to the item View
        itemDiv.appendChild(item);
        itemDiv.appendChild(qty);
        itemDiv.appendChild(price);
        itemDiv.appendChild(desc);
        itemDiv.appendChild(datasheet);

        //Fill cart form
        var instr = document.createElement('h3');
        instr.innerHTML = "Add quantity to cart"
        instr.className = "submit-text";

        // var add = document.createElement('button');
        // add.className = 'add-button';
        // add.innerHTML = '+';

        //Set min and max values for item quantity
        counter.type = "number"
        counter.min = 0;
        counter.max = queryReturn[i].AVAILABILITY;
        counter.placeholder = "0"

        // var qtyInput = document.createElement('input');
        // qtyInput.className = 'qty-input';
        // qtyInput.value = 0;

        formDiv.appendChild(instr);
        formDiv.appendChild(counter);

        //Finally, we fill Section with our created divs
        section.appendChild(qtyRaw);
        section.appendChild(imgDiv);
        section.appendChild(itemDiv);
        section.appendChild(formDiv);
        section.append(hr);

        body.append(section);
    }
    

    // On click of 'add quantity to cart' adds quantity and SKU of item global cart var
    $('main section h3.submit-text').on('click', function(){
        let quantity = $(this).closest('section').find('input').val();
        let SKU = $(this).closest('section').attr('id'); 

        //Add items to cart
        if (quantity > 0){
            if (!cartitems.hasOwnProperty(SKU)){
                //Add new items to cart
                cartitems[ SKU ] = parseInt(quantity);
            } else {
                //If item already in cart then update quantity with new qty
                cartitems [ SKU ] = parseInt(quantity);
            }
        }   

        $('#cart-size').text("(" + Object.keys(cartitems).length + ")")
        //console.log("cart size: " + Object.keys(cartitems).length)
        console.log("current cart:")
        console.log(cartitems)

    });


}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }

    $('.subtotal input').popover('hide')

}

// Pop up modal on 'log in' click
var adminLogin = document.getElementById('admin-login-icon');
var loginModal = document.getElementById('login-modal');
adminLogin.onclick = function() {
    loginModal.style.display = "block";
}

// Pop up modal on 'view cart' click and send request to back
var viewCart = document.getElementById('view-cart-icon');
var cartModal = document.getElementById('cart-modal');
viewCart.onclick = function(){

    //Show the cart modal
    cartModal.style.display = "block";

    //Generate request to receice associated item data for price and item name
    let requestCartJSON = {
        tableName: "inventory2",
        column : "SKU",
        cart: cartitems,
        POSTTYPE: "cartdata"
    }
    //Sends request
    $.ajax({
        type: 'POST',
        url: "https://web.njit.edu/~mjk29/cap/oracleDBConn.php",
        data: requestCartJSON,
        success: function(data) {
            // console.log(data)
            responseCartJson = JSON.parse(data);
            //if (responseCartJson.PRICE != null) responseCartJson.PRICE = responseCartJson.PRICE.replace('.', '');
            console.log("Json Cart response:");
            console.log(responseCartJson);
            populateCartModal(responseCartJson);
        },
    });
    
   
}

// Hide modals on click outside of modal element 
window.onclick = function(event) {

    let cart = document.getElementById('cart-modal-body')

    if (event.target == loginModal) {
        loginModal.style.display = "none"
    }
    if (event.target == cartModal){
        cartModal.style.display = "none"
        cart.innerHTML = ""
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

function sendTransaction(){
    let studentID = $('.subtotal input')


    if (studentID.val().length == 8){

        $('.subtotal input').popover('hide')

        $('.subtotal button').popover('show')


        let transaction = [ ]
        $('#cart-modal-body div').each(function(){
            let itemSKU = $(this).find('.row-name').attr('id')
            let itemPrice = $(this).find('.row-price').html()
            let itemQTY = $(this).find('.cart-input-qty').val() 
            let itemName = $(this).find('.row-name').html()

            console.log("name: " + itemName)

    
            //console.log("SKU: " + itemSKU + " QUANTITY: " + itemQTY + " PRICE: " + itemPrice )
    
            let currItem = {SKU: itemSKU, PRICE: itemPrice, CHECKEDOUT: itemQTY, CHECKEDIN: 0, ITEMNAME: itemName}
    
            transaction.push(currItem)
    
        });
    
        let sendData = {
            EMAIL : $('#emailAddr').val(),
            ITEMDATA : JSON.stringify(transaction),
            SUBTOTAL : $('#subtotal').html(),
            STUDENTID : $('.subtotal input').val(),
            POSTTYPE: "addTransaction",
        }
    
        console.log(sendData)
    
        $.ajax({
            type: 'POST',
            url: "https://web.njit.edu/~mjk29/cap/oracleDBConn.php",
            data: sendData,
            success: function(data) {
                console.log(data)
        $('#cart-modal').hide(1000)

                // console.log(JSON.parse(data))
                // response = JSON.parse(data);
                //TODO If failure handle this
            },
        });

    } else {

        console.log("wrong student ID")
        $('.subtotal input').popover('show')
    }


}



//Populate modal with items from cart
function populateCartModal(json){

    //Select two elements that the Review Order modal contains
    let modalBody = document.getElementById('cart-modal-body') //parent element of each row 

    let SUBTOTAL = document.getElementById('subtotal')
    let subtotal = 0


    let itemdata = populateCartData(json, cartitems)
    
    //console.log("item data:")
    //console.log(itemdata)

    for (let i=0; i < json.length; i++){

        let row = document.createElement('div')
        let rowname = document.createElement('span')
        let rowprice = document.createElement('span')
        let rowqty = document.createElement('span')
        let rowtotal = document.createElement('span')
        let qtyinput = document.createElement('input')

        
        qtyinput.addEventListener('click', updateCartReview )
        // qtyinput.addEventListener('input', updateCartReview() )
        // qtyinput.addEventListener('change', updateCartReview() )


        //For debugging easier
        rowname.id = itemdata[i].SKU

        // Get data from json
        let name = itemdata[i].NAME
        let price = itemdata[i].PRICE
        let qty = itemdata[i].QTY // Number user is purchasing
        let stock = itemdata[i].AVAILABILITY // Total number available

        let total = qty * price
        subtotal = subtotal + total 

        rowname.innerHTML = name
        rowprice.innerHTML = price
        rowtotal.innerHTML = total
        qtyinput.value = qty
        qtyinput.placeholder = "Select number between 0 and " + stock

        qtyinput.type = "number"
        qtyinput.min = 0
        qtyinput.max = stock

        rowname.className = "col-3 row-name"
        rowprice.className = "col-3 row-price"
        rowtotal.className = "col-3 row-total"
        rowqty.className = "col-3"
        qtyinput.className = "cart-input-qty"

        rowtotal.id = "row-total"

        SUBTOTAL.innerHTML = subtotal

        rowqty.appendChild(qtyinput)

        row.appendChild(rowname)
        row.appendChild(rowprice)
        row.appendChild(rowqty)
        row.appendChild(rowtotal)

        row.className = "row padding-bottom"

        modalBody.appendChild(row)
    }

  
}

//Format Price
function fmtPrice(amt) {
    return parseFloat(Math.round(amt * 100) / 100).toFixed(2); //rounds to two decimal places
}

//updates individual total prices and subtotal price on change of quantity
function updateCartReview(){
    
    let newprice = 0
    // let price = $(this).closest('div').find('span.row-price').html().replace('.', '')
    let total = $(this).closest('div').find('span.row-total')
    let subtotal = $('#subtotal')
    let newqty = $(this).val()


   let price = $(this).closest('div').find('span.row-price').html()
    if (price.includes('.')){
        price.replace('.', '') //converts to pennies
        total.html(fmtPrice(price* newqty))
    } else {
        let price = $(this).closest('div').find('span.row-price').html()
        total.html((price * newqty));
    }

    
    //calculate subtotal
    let sum = 0
    $('span.row-total').each(function() {
        thisprice = $(this).html().replace('.', '') //convert to pennies
        sum = sum + +thisprice
    });

    //show 
    subtotal.html(fmtPrice(sum / 100))

}

//Takes cart data response and fetches its quantity from cartdata by matching SKU
function populateCartData(response, cart){

    newdata = []
    for (let i=0; i < response.length; i++){
        let responsesku = response[i].SKU
        let responsename = response[i].NAME
        let responseprice = response[i].PRICE
        let responseavailable = response[i].AVAILABILITY

        let quantity = cart[responsesku]

        let newentry = {SKU: responsesku, QTY: quantity, NAME: responsename, PRICE: responseprice, AVAILABILITY: responseavailable };

        newdata.push(newentry)
    }

    return newdata
}



//TODO IS THIS SENDING PLAINTEXT????
function login() {
    loginInfo = {
        uname: document.getElementById("uname").value,
        plainText: document.getElementById("plainText").value,
        POSTTYPE : "login"
    }

    $.ajax({
        type: "POST",
        url: URL,
        data: loginInfo,
        success: function (data) {
            decoded = JSON.parse(data)
            if (decoded == 'valid') {
            window.location.href = "adminpage.php";
            }else{
                document.getElementById("returnText").innerHTML = "INVALID PASSWORD" 
            }
         },
    });
    }

// Here is the function for the search bar
// Searching for PRICE is complete pending further bug testing

function searchForItems() {
   // init sending data
   sendData  = {
        searchCol: "NAME",
        searchText: "",
        POSTTYPE : "search"
    }
    // Array of valid columns to search
    var validCols = ["keywords","description", "price",
     "name", "image", "location", "datasheet", "sku"]
    // get the string from the input field
    var searchString = $('#searchBar')[0].value.toLowerCase()

    if (searchString == "?help") {

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
                            // console.log(data)

            parsedSearch = JSON.parse(data)
            if (parsedSearch.length==0) {
                parsedSearch = JSON.parse(
                `[{"SKU":"No Item Available","KEYWORDS":"null","DESCRIPTION":"","CONSUMABLE":"0",
                "AVAILABILITY":"","PRICE":"","LINK":"","NAME":"No Items Found","IMAGE":"../cap/images/placeholder.png",
                "LOCATION":"","DATASHEET":null,"DATEADDED":""}]`)
            }            
            populate(parsedSearch);
        },
    });
}




// 
// Code for the QR scanner
// 
var scannerModal = document.getElementById('scannerModal');
currentQRItem=""
function qrScanner() {
    // Open Modal
    scannerModal.style.display = "block";
    // Creating new scanner object, refer to the documentation for information
    scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
    // Listens for successful QR read, then sends that string to the search
    scanner.addListener('scan', function (content) {
        // content holds the scanned qr string
        // Its a listener function, data can be sent, but not returned. 
        currentQRItem = content
        scanSearch(content)

    });
    // Init camera
    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
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
        } else {
            console.error('No cameras found.');
        }
    }).catch(function (e) {
        console.error(e);
    });
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
    document.getElementById('scannerAddButton').style.display = "block"
    
}

function clearQRReader() {
    document.getElementById('scannerResultImage').src = ""
    document.getElementById('scannerResultImage').style.visibility = "hidden";
    document.getElementById('scannerResultName').innerHTML = ""
    document.getElementById('scannerResultPrice').innerHTML = ""
    document.getElementById('scannerResultAvailibility').innerHTML = ""
    document.getElementById('scannerResultLocation').innerHTML = "" 
    document.getElementById('scannerAddButton').style.display = "none"
}

function addQRtoCart(){
    console.log(cartitems)
    cartitems[currentQRItem] = 1
     $('#cart-size').text("(" + Object.keys(cartitems).length + ")")
    
}

function closeCartModal() {
        cartModal.style.display = "none"
}
function closeLoginModal(){
    document.getElementById('login-modal').style.display = "none"


}