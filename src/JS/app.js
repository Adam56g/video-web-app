//The URIs of the REST endpoint
IUPS = "https://prod-23.uksouth.logic.azure.com:443/workflows/31b91635684d43cb906d4bf288fc3b2c/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=5lD7rCQWpCA9y60YzFbJ2omAhvfXs5GcLTJUz8xzMuc";
RAI = "https://prod-10.uksouth.logic.azure.com:443/workflows/558123aedeff4f89b7a618f001805a67/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ngcIeXHqfzpXmXW5a7RuVWUVjBoVGV0JQISDJo8H3rY";
LOGIN_VAL = "https://prod-15.uksouth.logic.azure.com:443/workflows/1c60d493141b433a971365804eaf476d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_jrxcIxVa7BV848SS6Yt2jClH02RsTmE-utjZWPvW20";
DEL_VIDEO = "https://prod-27.uksouth.logic.azure.com/workflows/ffec53fed8a345048a855519a7220263/triggers/manual/paths/invoke/rest/v1/assets/";
DEL_VIDEO1 = "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=m82WnqXjbIsQ_s2BJIiJxj2nZ-kfVqRhdrZXiYEAiP0";
CREATE_USER = "https://prod-22.uksouth.logic.azure.com/workflows/7f8af50af4254300a6415347b6ce40c8/triggers/manual/paths/invoke/rest/v1/assets?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=COJxlU3RGU5YEjQEuIcveCpQjAK02riES8tuo4RJW3s";

BLOB_ACCOUNT = "https://blobstorageb00836889.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function() {

 
  $("#retVideos").click(function(){

      //Run the get asset list function
      getVideos();

  }); 

   //Handler for the new asset submission button
  $("#subNewForm").click(function(){

    //Execute the submit new asset function
    submitNewAsset();
    
  }); 

  $("#adduser").click(function(){

    //Execute the submit new user function
    createuser();

    
  }); 
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset()

{
  submitData = new FormData();
 //Get form variables and append them to the form data object
 submitData.append('FileName', $('#FileName').val());
 submitData.append('userID', $('#userID').val());
 submitData.append('userName', $('#userName').val());
 submitData.append('File', $("#UpFile")[0].files[0]);

 //Post the form data to the endpoint, note the need to set the content type header
 $.ajax({
 url: IUPS,
 data: submitData,
 cache: false,
 enctype: 'multipart/form-data',
 contentType: false,
 processData: false,
 type: 'POST',
 success: function(data){

 }
 });
}

//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getVideos()

{
//Replace the current HTML in that div with a loading message
$('#VideosList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
$.getJSON(RAI, function( data ) {
//Create an array to hold all the retrieved assets
var items = [];

//Iterate through the returned records and build HTML, incorporating the key values of the record in the data
$.each( data, function( key, val ) {
items.push( "<hr />");
items.push("<video controls width='320' height='240' controls autoplay src='"+BLOB_ACCOUNT + val["filePath"] +"'type='video/mp4'/></video> <br />")
items.push( "File : " + val["fileName"] + "<br />");
items.push( "Uploaded by: " + val["userName"] + " (user id: "+val["userID"]+")<br />" + "Movie Title and Age Rating:" +val["title"] + " Age Rating: "+val["ageRating"] + " Genre:" +val["genre"]+" <br /> "+"Produced and Published by:" +val["producer"] + "Publisher:"+val["publisher"]);
items.push( "<hr />");
items.push( '<button type ="button" class="btn btn-danger"  onclick="delete_video(\''+val["id"]+ '\')">delete</button><br/>');
});
//Clear the assetlist div
$('#VideosList').empty();
//Append the contents of the items array to the ImageList Div
$( "<ul/>", {
"class": "my-new-list",
html: items.join( "" )
}).appendTo( "#VideosList" );
});

}
function delete_video(id){
$.ajax({
  type:"DELETE",
  url:DEL_VIDEO +id+DEL_VIDEO1,
}).done(function(){
  getVideos();
})
}

function createuser(){
  usercreation= new FormData();
  usercreation.append('username',$('#name').val());
  usercreation.append('forename',$('#fore_name').val());
  usercreation.append('surname',$('#sur_name').val());
  usercreation.append('userpass',$('#user_pass').val());
  usercreation.append('age',$('#age').val());

  $.ajax({
    url: CREATE_USER,
    data: usercreation,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'POST',
    success: function(data){
    window.location="./login.html";
    }
});
}

function loginvalidation(){

  var username  = document.getElementById("username").value;
  var userpass = document.getElementById("userpass").value;

  LoginCheck =new FormData();

  LoginCheck.append('username',username)
  LoginCheck.append('userpass',userpass)

  console.log(username)
  console.log(userpass)

  $.ajax({
 url: LOGIN_VAL,
 data: LoginCheck,
 cache: false,
 contentType: false,
 processData: false,
 type: 'POST',
 success: function(userinfo){
  console.log(userinfo)
  console.log(userinfo[0])

  username = userinfo[0].username;
  forename = userinfo[0].forename;
  surname = userinfo[0].surname;
  userID = userinfo[0].userID;
  userAccess = userinfo[0].Privileges;

  console.log(forename)

  if(userinfo[0].username){
    if(userAccess){
      alert("Welcome Admin!");
      window.location="./index.home.html";
    }else {
      alert("Welcome User!");
      window.location="index.home.users.html";
    }
  }else{
    alert("Unsuccessful Login")
  }
  return false;
 }


})
}

