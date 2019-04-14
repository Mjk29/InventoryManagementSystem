<?php

   session_start();
   if( !isset($_SESSION['uname']) )
       die( "Login required." );

?>
 
<!doctype html>
<html lang="en">
    <!--head-->
   <head>
      <!-- Required meta tags -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <!-- Bootstrap CSS -->
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
         crossorigin="anonymous">
      <!--FONT AWESOME-->
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.4.1/css/all.css" integrity="sha384-5sAR7xN1Nv6T6+dT2mhtzEpVJvfS3NScPQTrOxhwjIuvcA67KV2R5Jz6kr4abQsz" crossorigin="anonymous">
      <!--stylesheets-->
      <link rel="stylesheet" type="text/css" href="./assets/css/adminpage.css">
      <!--title-->
      <title>COAD Administator View</title>
   </head>
   <!--End head-->

   <!--Body-->
   <body  onload="generateInitJSON();">
      <header class="navbar">
         <div class="container-fluid">
            <a class="navbar-brand" href="#">CoAD Electronic Shop Inventory Management</a>
            <ul class="navbar-right">
               <li>
                  <i id="adminLogOut" class="fas fa-sign-out-alt"><a> Log out</a></i>
               </li>
            </ul>
         </div>
      </header>
      <!--Content-->
      <div class="container-fluid">
         <div class="row">
            <!--Sidebar-->
            <div class="col-12 col-md-3 col-xl-2 nopadding" >
               <!--Searchbar-->
               <form>
                    <div class="active-orange-4">
                        <input onKeyDown="if(event.keyCode==13){event.preventDefault(); searchForItems()};" id="searchBar" class="form-control" type="text" placeholder="Search  Enter ?help for help" aria-label="Search">
                    </div>

                </form>
               <!--Navigation menu-->
               <nav>
                  <label class="nav-split">Filters
                  </label>
                  <label class="checkbox-container">Integrated Chips
                  <input type="checkbox" id="Integrated Chip">
                  <span class="checkmark"></span>
                  </label>
                  <label class="checkbox-container">DC Motors
                  <input type="checkbox" id="DC Motors">
                  <span class="checkmark"></span>
                  </label>
                  <label class="checkbox-container">Solder
                  <input type="checkbox" id="Soldering">
                  <span class="checkmark"></span>
                  </label>
                  <label class="checkbox-container">Potentiometer
                  <input type="checkbox" id="Potentiometer">
                  <span class="checkmark"></span>
                  </label>
                  <label class="checkbox-container">Vibration
                  <input type="checkbox" id="Vibration">
                  <span class="checkmark"></span>
                  </label>
                  <label class="checkbox-container">Sensor
                  <input type="checkbox" id="Sensing">
                  <span class="checkmark"></span>
                  </label>
                  <label class="checkbox-container">Actuator
                  <input type="checkbox" id="Actuator">
                  <span class="checkmark"></span>
                  </label>
                  <label class="checkbox-container">Micro Controller
                  <input type="checkbox" id="MicroController">
                  <span class="checkmark"></span>
                  </label>
                  <label class="checkbox-container">Camera
                  <input type="checkbox" id="Camera">
                  <span class="checkmark"></span>
                  </label>
                  <label class="checkbox-container">Servo
                  <input type="checkbox" id="Servo">
                  <span class="checkmark"></span>
                  </label>
                  <label class="checkbox-container">Tools
                  <input type="checkbox" id="Tools">
                  <span class="checkmark"></span>
                  </label>
                  <label class="checkbox-container">Consumables
                  <input type="checkbox" id="Consumable">
                  <span class="checkmark"></span>
                  </label>
                  <label class="nav-split">Actions
                  </label>
                  <label id="add-item-button" class="admin-actions"> Add Items
                  <input type="checkbox" id="action-add-items">
                  <i class="fas fa-plus"></i>
                  </label>
                  <label id="update-item-button" class="admin-actions"> Update Items
                    <input type="checkbox" id="action-update-items">
                    <i class="fas fa-marker"></i>
                  </label>
                  <label style="display: none" id="action-cancel-update" class="admin-actions"> &nbsp;&nbsp;&nbsp;&nbsp;Cancel update
                    <input type="checkbox" >
                    <i class="fas fa-ban"></i>
                  </label>
                  <label  style="display: none" id="action-complete-update" class="admin-actions"> &nbsp;&nbsp;&nbsp;&nbsp;Complete update
                    <input type="checkbox">
                    <i class="fas fa-hand-point-right"></i>
                  </label>
                  <label id="view-order-button" class="admin-actions"> View Orders
                  <input  type="checkbox" id="action-view-orders">
                  <i class="fas fa-chart-line"></i>
                  </label>
                  <label style="display: none" id="action-view-new-orders" class="admin-actions"> &nbsp;&nbsp;&nbsp;&nbsp;View New Orders
                    <input type="checkbox" class="view-orders">
                    <i class="fas fa-hand-point-right"></i>
                  </label>
                  <label style="display: none" id="action-view-completed-orders" class="admin-actions"> &nbsp;&nbsp;&nbsp;&nbsp;View Completed Orders
                    <input type="checkbox" class="view-orders">
                    <i class="fas fa-hand-point-right"></i>
                  </label>
                  <label onclick="qrScanner()" class="admin-actions"> QR Scanner
                    <i class="fas fa-camera"></i>
                  </label>
                  <label id="action-delete-item" class="admin-actions"> Delete Items
                    <input onclick="deleteItems()" type="checkbox" >
                    <i class="fas fa-trash-alt"></i>
                  </label>
                   <label id="action-delete-item" class="admin-actions"> Download TSV
                    <input onclick="DownloadTSV()" type="checkbox" >
                    <i class="fas fa-file-csv"></i>
                  </label>
               </nav>
            </div>
            <!--Item list-->
            <main class="col-12 col-md-9 col-xl-10 items-view" id="body">
               <!--Populated by js-->
            </main>

            <body>
               <!--Dont remember what this is for, but its display:none and removing it breaks stuff-->
               <div class="col-12 col-md-3 col-xl-2 nopadding" id="pad-form"></div>
               <!--Form List-->
               <main class="col-12 col-md-9 col-xl-10 form-view">
                  
                  <form id="form-add-item" display="none">

                    <div class="form-group">
                        <h1><span class="big-text"> Add item to inventory </span> </h1>
                    </div>

                    <!--Enter Item Name-->
                     <div class="form-group">
                        <label for="item-name"></label>
                        <input type="text" class="form-control" id="item-name" aria-describedby="Item name" placeholder="Enter item name">
                     </div>
                     <!--Enter Item Description-->
                     <div class="form-group">
                        <label for="item-description"></label>
                        <textarea id="item-description" placeholder="Enter a description about this item"></textarea>
                     </div>
                     <!--Enter item location-->
                     <div class="form-group">
                        <label for="item-location"></label>
                        <input type="text" class="form-control" id="item-location" aria-describedby="Item location" placeholder="Enter item location">
                     </div>
                     <!--Enter URL-->
                     <div class="form-group">
                        <label for="item-link"></label>
                        <input type="text" class="form-control" id="item-link" aria-describedby="Item link" placeholder="Enter url to item webpage">
                     </div>
                     <!--Enter keywords-->
                     <div class="form-group">
                        <label for="item-keywords"></label>
                        <input type="text" class="form-control" id="item-keywords" aria-describedby="Item keywords" placeholder="Enter keywords separated by commas">
                     </div>
                     <!--Enter price-->
                     <div class="form-group">
                        <div>
                           <label for="item-price"></label>
                           <input type="number" class="form-control" id="item-price" aria-describedby="Item price" placeholder="Enter unit price">
                        </div>
                     </div>
                     <!--Enter Quantity-->
                     <div class="form-group">
                        <div>
                           <label for="item-quantity"></label>
                           <input type="number" class="form-control" id="item-quantity" aria-describedby="Item quantity" placeholder="Enter Quantity">
                        </div>
                     </div>
                     <!--Consumable checkbox-->
                     <div class="form-group" id="checkbox">
                        <div class="form-check">
                           <label class="form-check-label">
                           <input id="item-consumable" class="form-check-input" type="checkbox">Consumable
                           </label>
                        </div>
                     </div>
                     <!--Upload Datasheet-->
                     <div title="Upload PDF for this item" class="form-group">
                        <div class="input-group mb-3">
                           <div class="input-group-prepend">
                              <span class="input-group-text">Upload datasheet</span>
                           </div>
                           <div class="custom-file">
                              <input type="file" class="custom-file-input" id="item-datasheet">
                              <label id="item-datasheet-label" class="custom-file-label" for="inputGroupFile02">Upload .pdf</label>
                           </div>
                        </div>
                     </div>
                     <!--End upload Datasheet-->
                    
                     <!--Upload spreadsheet-->
                     <div title="Download google sheet as TSV, then upload here" class="form-group">
                        <div class="input-group mb-3">
                           <div class="input-group-prepend">
                              <span class="input-group-text">Upload spreadsheet</span>
                           </div>
                           <div class="custom-file">
                              <input type="file" class="custom-file-input" id="item-spreadsheet">
                              <label id="item-spreadsheet-label" class="custom-file-label" for="inputGroupFile02">upload tab seperated file</label>
                           </div>
                        </div>
                     </div>

                     <!--Upload Image container-->
                     <div title="If image upload fails, check that it is encoded properly" class="form-group">
                        <div class="container">
                           <div class="row clearfix">
                              <!--upload image-->
                              <div class="input-group mb-3">
                                 <div class="input-group-prepend">
                                    <span class="input-group-text">Upload image</span>
                                 </div>
                                 <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="item-image">
                                    <label id="item-image-label" class="custom-file-label" for="inputGroupFile02" >Upload .png, .jpg, ,jpeg, .gif</label>
                                 </div>
                              </div>
                              <!--End upload image-->
                              <!--Filename preview-->
                              <div class="preview-filename"></div>
                              <!--image preview-->
                              <!--<div class="input-group mb-3">
                                 <div class="input-group-prepend">
                                    <div>
                                       <p>image preview</p>
                                       <img class="imagePreview imgtoleft" id="imagePreviewEle" src="http://placehold.jp/150x150.png"/>
                                    </div>
                                 </div>
                              </div>-->
                              <!--End image preview-->
                           </div>
                        </div>
                     </div>

                    <!--Upload comma seperated values from spreadsheet-->
                    <div title="Copy entire row from spreadsheet, paste here" class="form-group paddingtop">
                      <button type="button" class="btn btn-outline-secondary" onclick="openModalForDump()">Paste item data from spreadsheet</button>
                    </div>



                    <!-- Submit button -->
                    <div  class="form-group  paddingtop">
                        <button id="submitItemButton" type="button" onclick="addItem()" class="btn btn-outline-secondary">Submit</button>
                    </div>


                     <!-- Response Box -->
                   <!--   <br><div id="responseModal" class="modalResponse" >
                        <div id="responseModalText">&nbsp</div>
                        <div class="modal-body">
                     </div></div></div><br> -->
                  

                  </form>
                  <!--End form-->


                  <div id="itemDumpModal" class="modal">
                     <div class="modal-content">
                        <div class="modalBoxTop">Paste Tab Seperated row data from spreadsheet </div>
                        <div class="modal-body" style="height: 75%">
                           <textarea id="rowDataFromSpreadsheet" onkeyup="check(this);" style="height: 100%; width: 100%; resize: none;" >
                           </textarea>
                           <br><br>
                        </div>
                     </div>
                  </div>

                  <div id="responseModal" class="modal">
                     <div class="modal-content">
                        <div class="modalBoxTop">Response </div>
                        <div class="modal-body" style="height: 75%">
                           <div id="responseModalText" style="height: 100%; width: 100%; resize: none;" >
                           </div>
                           <br><br>
                        </div>
                     </div>
                  </div>
      



               </main>



               <main class="col-12 col-md-9 col-xl-10 transaction-view">
                  <!--Populated by javascript-->
               </main>

               <div id="helpModal" class="modal">
                       <div class="modal-content">
                           <div class="modalBoxTop">Search Help</div>
                           <div class="modal-body" >
                           <div id="helpModalText">&nbsp </div>
                           <div id="returnText"></div>
                           </div>
                       </div>
                   </div>

         <div id="scannerModal" class="modal" >
            <div style="width: 500px" class="modal-content" >
               <div class="modalBoxTop">QR SCANNER</div>
                 
                  <select id="cameraSelect"></select>

               <div class="modal-body" >
                  <div id="app">
                     <div class="preview-container">
                        <video  height="320" id="preview"></video>
                     </div>
                  </div>
                  <div >
                  <img align="left" height="150" width="150" 
                  id="scannerResultImage" style="visibility: hidden">&nbsp</img>
                  <div align="center" >
                     <span id="scannerResultName">&nbsp</span><br>
                     <span id="scannerResultPrice">&nbsp</span><br>
                     <span id="scannerResultAvailibility">&nbsp</span><br>
                     <span id="scannerResultLocation">&nbsp</span>
                  </div>
                 </div>
               </div>
            </div>
         </div>



  </div>
      </div>






      <div id="QRModal" class="modal" >
      <div class="modal-content" style="height: 340px; width: 300px;">
      <div class="modalBoxTop">QR Code</div>
      <div class="modal-body" style="height: 55%">
      <!-- <img height="100%" width="100%" id="qrImage" src=""> -->
         <canvas id="qrCanvas" height="256" width="256" ></canvas>
      <!-- <div id="qrcode" style="margin-top:15px;"></div> -->
      <br><br>
      </div>
      </div>
      </div>

      <div id="helpModal" class="modal">
         <div class="modal-content">
            <div class="modalBoxTop">Paste Tab Seperated row data from spreadsheet </div>
            <div class="modal-body" style="height: 75%">
               <div id="helpModalText" >&nbsp</div>
               <br><br>
            </div>
         </div>
      </div>

      


      <!-- Optional JavaScript -->
      <!-- jQuery first, then Popper.js, then Bootstrap JS -->
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"crossorigin="anonymous"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
         crossorigin="anonymous"></script>
      <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
      <script src="./assets/js/adminpage.js"></script>
            <!-- <link rel="stylesheet" href="./assets/css/vue.min.css"> -->

      <script type="text/javascript" src="./assets/js/instascan.min.js"></script>
      <!-- <script type="text/javascript" src="./assets/js/qrScanApp.js"></script> -->
      <link rel="stylesheet" href="./assets/css/qrStyle.css">


<!-- This iframe is for downloading the TSV -->
      <iframe id="tsvDownloadFrame" style="display:none;"></iframe>
      <a href="javascript:download('file.ext')">download</a>
     

   </body>
</html>
