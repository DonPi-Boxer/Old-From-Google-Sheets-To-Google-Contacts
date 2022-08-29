// Link to google Spreadsheet:
// https://docs.google.com/spreadsheets/d/1OmorzZyeV6XJW5UrYhfeu6KkyeicIK3xZfvtvJj71SY/edit#gid=0


// This code runs but doesnt recognize group exists is true


// Add contacts UI here

//UI 1: Add a new contact to the list / delete an old contact / Alter an existing contact
// Maybe also generate an automatic mail to everyone subsscribed about updates in this list ??

// function onOpen()
// {
//   var ui = SpreadsheetApp.getUi();
//   ui.createMenu('Contacts')
//       .addItem('add Contact', 'addContact')
//       .addToUi();
// }

// UI2: Import contact for user /// think of something for to do when there is an update over here

//Declare all constants

var contactgroupIndex = 0;
var contactGroupIndex = 1;
var positionIndex = 2;
var firstNameIndex = 3;
var lastNameIndex = 4;
var emailIndex = 5;
var mobileIndex = 6;
var statusIndex = 7;
var headerRows = 2;

var ui = SpreadsheetApp.getUi();

// Sheet constants
var sheet = SpreadsheetApp.getActiveSheet();
var ss = SpreadsheetApp.getActiveSpreadsheet();
var headerRows = 2;
var numColsContacts = 7;
var startColContacts = 1;
var MaxRow = sheet.getLastRow();
var dataRange = sheet.getDataRange();
var data = dataRange.getValues();     // Read all data
data.splice(0,headerRows);            // Remove header rows
var existingContactgroups = SpreadsheetApp.getActiveSheet().getRange(1, contactgroupIndex+1, MaxRow).getValues();
var userProperties = PropertiesService.getUserProperties();
var userCache = CacheService.getUserCache();



// Underneath is all about importing the contact to google contacts
function importContacts() {ContactsApp.createContac
  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var firstName = row[firstNameIndex];
    var lastName = row[lastNameIndex];
    var emailAdd = row[emailIndex];
    var teamAdd = row[contactgroupIndex];
    var positionAdd = row[positionIndex];
    var mobileAdd = row[mobileIndex];
    var statusRow = row[statusIndex];

    if (statusRow != "Uploaded") {
      var contact = ContactsApp.createContact(firstName, lastName, emailAdd);

      if (mobileAdd != "" ) {
        contact.addPhone(ContactsApp.Field.MOBILE_PHONE, mobileAdd);
      }

      if (teamAdd != "" ) {
        contact.addCompany(teamAdd, positionAdd);

        // NOT sure what is meant by group over here
        var group = ContactsApp.getContactGroup("System Group: My Contacts");
        group.addContact(contact);

        // Finally, once we have uploaded the contact, set Status to "Uploaded".
        // --> this does not work, as all users of the sheet will see this message...
        for (var iRow = 3; iRow <= MaxRow; iRow++) {
          sheet.getRange("K" + iRow).setValue('Uploaded');
        }
      }
    }
  }
}


//functions to cache and decache variables which might have to be stored in the local memory
function cacheNewContactGroupVariables(contactGroupDimensionNamesArray, iterationNotFound,lastFoundFirstRowExtreme, lastFoundLastRowExtreme){
  var valuesToCache = {
    'contactGroupDimensionNamesArray' : contactGroupDimensionNamesArray.toString(),
    'iterationNotFound' : iterationNotFound.toString(),
    'lastFoundFirstRowExtreme' : lastFoundFirstRowExtreme.toString(),
    'lastFoundLastRowExtreme' : lastFoundLastRowExtreme.toString()};    
  
    userCache.putAll(valuesToCache);    
  /*
    //For testing purposes
    var checkCacheKey = userCache.getAll(['fullContactCredentials','contactGroupDimensionNamesArray','iterationNotFound','lastFoundFirstRowExtreme','lastFoundLastRowExtreme']);
     //ui.prompt("cache is " + checkCacheKey);
    */ 
  }

  /*
  function getCachedFormObject(){

    var cachedFullContactCredentials = userCache.get('fullContactCredentials');
    return cacheFullContactCredentials; 
  }
*/

/*
  function getCachedContactGroupNotFoundVars(){

  //ui.prompt("Inside the cached contact group not found vars function");
  var cachedVars = 
  [ 
  []
  [],
  [userCache.get('lastFoundFirstRowExtreme')],
  [userCache.get('lastFoundLastRowExtreme')]
    ];

  //ui.prompt("cached is succesfull");  
    return cachedVars;

  //For testing puposes  
  // //ui.prompt("array of cache object is " + checkCacheKey2);     
  }
*/

function cacheFullContactCredentials(fullContactCredentials){
  //ui.prompt("within cache full contact credentials  function");
  userCache.put("fullContactCredentials", fullContactCredentials.toString());
  //ui.prompt("credentials cache filling succesful");
}

  function getCachedContactCredentialsInArray(contactCredentialsToGet){ 
   
   // ui.prompt("Inside get cached contact credentials function");
   var contactCredentialsToGetString = contactCredentialsToGet.toString(); 
   //ui.prompt("contact credentials to get string equals " + contactCredentialsToGetString); 
   var contactCredentialsString = userCache.get(contactCredentialsToGetString); 
   //ui.prompt("contactCredentialsString equals " + contactCredentialsString);
   var contactCredentials = contactCredentialsString.split(",");
   //ui.prompt("full contact credentials array equals " + contactCredentials);
    return contactCredentials;
  }




  function addContactContainer(formObject){
    ////ui.prompt ("In the add contact container function, going into the getCredentialsOfForm functions");
    var fullContactCredentials = getCredentialsOfFormObject(formObject);
    // function runs into the getcredentials of form, but not further than there. where goes this wrong ?
    ////ui.prompt ("In de add contact container, the full contact credentials array is equal to " + fullContactCredentials);
    ////ui.prompt ("Moving withinin the add contact container function from the get credentials of form function into the appendcontactToRowPosition function");
    evaluateInputContactCreds(fullContactCredentials);
    ////ui.prompt ("All done with the addContactContainer function (and thus with everything_)");
  }  


  //// Search the (grouped) range that has hadder name "GroupedRangeHeader", within the range startRow, numrows, collumn
//// Note that in this function, we do not yet use the fact that the range is grouped to find the group
//// Return it's starting row number if found, return false if not found.
//Ensure that the groupedRangeHeader is a string !!!


function  findContactGroupRowPositionExtremes(contactGroupHeader, firstRowPositionToSearch, lastRowPositionToSearch, collumnPositionToSearch) {  
  
  //ui.prompt ("now inside the findcontactRowPositionExtremes function, where we will search for the contact group " + contactGroupHeader);
  
  // The ammount of rows in which we want to search for the header is equal to the substraction of the lastRowPosition and FirstRowPosition + 1
  // +1 one, since we are dealing with POSITIONS here, not indices
  var numRowsToSearch = (lastRowPositionToSearch - firstRowPositionToSearch) + 1;
  
  //We than get the rangeToSearch by taking:
  //FirstRowPosition
  //CollumnPosition
  //NumRows
  // --> A single collumn existing out of the collumn to search of the row positions to search
  var rangeToSearch = sheet.getRange(firstRowPositionToSearch, collumnPositionToSearch, numRowsToSearch);


  //Get the values in this range
  var rangeToSearchValuesArrays = rangeToSearch.getValues();
  ////ui.prompt ("range to search equals "  + rangeToSearchValuesArrays);
 
  //Range to search values Arrays contains of arrays of arrays (depicting the string we search)
  // We wnat an array of strings to use the indexOf and lastindex of functions
  //--> force the array of string arrays into one long array
  //Then split it into one array of strings, at every "," in the entire arrays of the arrays of arrays
  //(Bullshit workaround but it works :))))))

  var rangeToSearchValues = String(rangeToSearchValuesArrays).split(",");
  ////ui.prompt ("Range to search values array equals " + rangeToSearchValues);
  

  var searchContactGroup = String(contactGroupHeader);
  //Use indexOf to find the first index of the GroupedRangeHeader
  var firstRowIndexcontactGroupDimension = rangeToSearchValues.indexOf(searchContactGroup);
  
  ////ui.prompt ("first row index contact group equals " + firstRowIndexcontactGroupDimension);
  
  

  //Confirm that the first index is found by checking that the query did NOT return -1

  if (firstRowIndexcontactGroupDimension != -1){
  //Then use lastindex to find the last index of the GroupedRangeHeader
  //Note that last index and first index can have the same value, if only one row with the header exists
  var lastRowIndexOfGroupedRangeHeader = rangeToSearchValues.lastIndexOf(searchContactGroup);

  //Convert both found indices to position by adding it to the starting position of the Rows used for the search range  
  var firstRowPositionOfHeader = firstRowIndexcontactGroupDimension + firstRowPositionToSearch;
  var lastRowPositionOfHeader = lastRowIndexOfGroupedRangeHeader + firstRowPositionToSearch;

  //ui.prompt ("We found the grouped row ! It has start position " + firstRowPositionOfHeader + "and last position " + lastRowPositionOfHeader);

  return [true, firstRowPositionOfHeader, lastRowPositionOfHeader];
  }
  
  //This would mean that the contact group was not found :(). We return the extremes we had found in the previous iteration + the collumns that still need to be found
  else if (firstRowIndexcontactGroupDimension == -1){
  //Als grouped range niet gevonden is --> maak een nieuwe
  ////ui.prompt ("group header not found --> inser new group ?");
  //ui.prompt("Did not found one group dimension, the group dimension are" + contactGroupHeader);
  return [false];
    }

  }


function findRowPositionOfNewContact(contactGroupNamesArray) {

  // for testing purposes
  //var contactGroupNamesArray = ["Krant", "Algemeen dagblad", "Politiek", "lead"]
  // Contact groups array for testing puposes now: get here the array of the contact groups of the credentials of new contact
  //ui.prompt ("Inside finding row function"); 
  //ui.prompt ("contact groups array is " + contactGroupNamesArray);

  // Array consisting of the length of the number of contact groups defined in the sheet
  //NOTE: CHANGE THIS BY AN ARRAY WITH INCREMENTAL STEP OF ! UNTILL  THE LENGTH OF THE CgroupDImensions


  /* TODO BUGGING FOR SOME REASON, FIX THIS LATER. for now just declare the array to search collumn myselrf
  var contactGroupNamesArrayLength = contactGroupNamesArray.length();
  var collumnsPositionsToSearchArray = [];

  for (var i=0; i<contactGroupNamesArray.length; i++){
    collumnsPositionsToSearchArray.push(i);
  }
*/


  
  var collumnsPositionsToSearchArray = [1,2,3,4];
  //ui.prompt("collumnpositiontosearch array is " + collumnsPositionsToSearchArray);
  // For the 1st dimenstion, we want to search through the entire sheet, minus the headers
  var firstRowPositionToSearch = 4;
  var lastRowPositionToSearch = ss.getLastRow();
  

 // for (var i=0; i < contactGroupNamesArray.length; i++)
  for (var i=0; i < collumnsPositionsToSearchArray.length; i++){

  Logger.log("In iteration " + i + " for finding row position of new contact")

  var contactGroupDimensionToSearch = contactGroupNamesArray[i];
  var collumnPositionToSearch = collumnsPositionsToSearchArray[i];
  
  ////ui.prompt ("In the " + i + " iteration of searching contact group dimensions. Current Dimension name is " + contactGroupDimensionToSearch + " which we search in collumn" + collumnPositionToSearch);

  var rowRangeFoundcontactGroup = findContactGroupRowPositionExtremes(contactGroupDimensionToSearch, firstRowPositionToSearch, lastRowPositionToSearch, collumnPositionToSearch);
  
  //ui.prompt ("output of the find contact Row Position extremes functin is " + rowRangeFoundcontactGroup);

  Logger.log(rowRangeFoundcontactGroup);
    
  if (rowRangeFoundcontactGroup[0] == true){

  //Update the first and last row position to search for the next iteration  
  firstRowPositionToSearch = rowRangeFoundcontactGroup[1];
  lastRowPositionToSearch = rowRangeFoundcontactGroup[2]; 
  }

  else if (rowRangeFoundcontactGroup[0] == false){

    //figure out what to do here !!!
    //ui.prompt("contact group dimension in collumn" + contactGroupDimensionToSearch + "not found, we have had " + i + "iterations, previously we did find as lower extreme " + firstRowPositionToSearch + "and as upper extreme " + lastRowPositionToSearch);

    //Return False so we know it was not found, i so we know how many iterations did find a match, and the extremes of the last found dimension
    return [false, i, firstRowPositionToSearch, lastRowPositionToSearch];
  }
    }

    SpreadsheetApp.getActive().toast("leaving finding row functio, CONTACT WAS FOUND for poSITION " + lastRowPositionToSearch);
    return [true, lastRowPositionToSearch];    
}

function getRangeOfNewContactToAdd(rowPositionOfNewContact, fullContactCredentialsLength){
  //ui.prompt ("length of credentials is " + fullContactCredentialsLength);
  //Get the range of the new contact  
  const rangeOfNewContact = sheet.getRange(rowPositionOfNewContact, 1, 1, fullContactCredentialsLength);
  return rangeOfNewContact;
}



//If none of the contact groups does not exist ready
function addContactAndNewContactGroup(fullContactCredentials){
  var lastRow = sheet.getLastRow();
  var fullContactCredentialsLength = fullContactCredentials.length;
  const rangeOfNewContact = getRangeOfNewContactToAdd(lastRow, fullContactCredentialsLength);
  rangeOfNewContact.setValues([fullContactCredentials]);
  //ui.prompt("Added new contact and its contact gorups to the last row in the sheet");
}

//If atleast one of the contact groups does exist already
//Insert a new row after the last found contact already existing inside all 4 corresponding contact group dimensions
function addContactToRow(rowPositionOfNewContact, fullContactCredentials){
  sheet.insertRows(rowPositionOfNewContact);
  SpreadsheetApp.getActive().toast("appended succesfully")
  //Length of the entire contact Credentials array in order to succesfully grab a range to set the values of the credentials in
  const fullContactCredentialsLength = fullContactCredentials.length;
  const rangeOfNewContact = getRangeOfNewContactToAdd(rowPositionOfNewContact, fullContactCredentialsLength);
  rangeOfNewContact.setValues([fullContactCredentials]);
  SpreadsheetApp.getActive().toast("Added new contact !");
}



//Parse all functions and let the magic happen niffo
//Note that this function gets call from the getCredentialsOfForm function
function evaluateInputContactCreds(fullContactCredentials) {

  //ui.prompt ("Now inside the append contact to Row Position functions");
  //ui.prompt("fullcontact credentials equals " + fullContactCredentials);
  //Get only the contact group dimensional names from the full contact credentials.
  var contactGroupDimensionNamesArray = fullContactCredentials.slice(0,4);
  //ui.prompt ("The contact group dimension names array is " + contactGroupDimensionNamesArray);
 
  // SpreadsheetApp.getActive().toast("Full contact credentials is " + fullContactCredentials);
  //Note: probably have to expand this variable in order to take non full contact group dimensions into account
  //Probably work something out using true false booleans ?
  ////ui.prompt ("Moving from appendcontacttoRowPosition to findRowPositionOfNewContact");
  var rowPositionOfLastContactInSameDimension = findRowPositionOfNewContact(contactGroupDimensionNamesArray);
  ////ui.prompt ("Moved back rom find the row position of last contact in same dimenions to the append contact function, row position of the last similair contact is " + rowPositionOfLastContactInSameDimension);
  
  
  //If the first entry True, we have found all four input dimension and we can simply add the new contact to its found row
  if (rowPositionOfLastContactInSameDimension[0] == true) {
  var rowPositionOfNewContact = rowPositionOfLastContactInSameDimension[1] + 1;
  //ui.prompt ("So new contact comes in row " + rowPositionOfNewContact + " we append in this row the credentials " + fullContactCredentials);
  addContactToRow(rowPositionOfNewContact, fullContactCredentials);
  }

  //If the last entry is not true, cache all relevant variables for later. Run the modal for asking whether to add the new contact, or to alter the input Cgroups
  else if (rowPositionOfLastContactInSameDimension[0] == false){    
    //ui.prompt("Do something");
    var itertationNotFound = rowPositionOfLastContactInSameDimension[1];
    var lastFoundFirstRowExtreme = rowPositionOfLastContactInSameDimension[2];
    var lastFoundLastRowExtreme = rowPositionOfLastContactInSameDimension[3];

    cacheNewContactGroupVariables(contactGroupDimensionNamesArray, itertationNotFound,lastFoundFirstRowExtreme, lastFoundLastRowExtreme);
    contactGroupNotFoundModalDialog();
    
    //Store the relevant variables wrt to the contact groups dimensions and their poitions
    
    
    
     
    //Run the modal
    
    //From the model we will go from callback function to callback function to further guide the process when one the CGroups at input was not found  
    }
  }

function createNewRowGroup(rowPositionOfNewRowGroup, numberOfRowsToGroup) {
  SpreadsheetApp.getActive().toast("inside cerearte row position function");
  ui.prompt("inside create new row group function");
  var rangeOfGroup = sheet.getRange(rowPositionOfNewRowGroup,1,numberOfRowsToGroup,1);
  rangeOfGroup.activate().shiftRowGroupDepth(1);
}


function createNewContactGroups(){
  ui.prompt("inside create new contact groups function");

  // get the relevant variables from the cache   
  var getCachedFullContactCredentials = "fullContactCredentials";
  var fullContactCredentials = getCachedContactCredentialsInArray(getCachedFullContactCredentials);
// ui.prompt("cached full contact credentials equals " + fullContactCredentials);
// ui.prompt("type of full contact credentials equals " + typeof(fullContactCredentials));
  var getCachedContactGroupDimensionNames = "contactGroupDimensionNamesArray"
  var contactGroupDimensionNames = getCachedContactCredentialsInArray(getCachedContactGroupDimensionNames);
// ui.prompt("cached contact group dimension names equals" + contactGroupDimensionNames);    
  var cGroupDimensionPoisitionNotFound = parseInt(userCache.get('iterationNotFound'));
//  ui.prompt("cGroupDimensionPoisitionNotFound equals " + cGroupDimensionPoisitionNotFound);
//  ui.prompt(" type of dimesnion not foud is " + typeof(cGroupDimensionPoisitionNotFound));
  var cGroupDimensionsLength = contactGroupDimensionNames.length;
  //Get the row under which we want to add the new contact
  var initialPositionoNewContactAndContactGroup = parseInt(userCache.get('lastFoundFirstRowExtreme'));
//  ui.prompt("initialPositionoNewContactAndContactGroup equals " + initialPositionoNewContactAndContactGroup);   
  var fullContactCredentialsLength = fullContactCredentials.length;
//  ui.prompt("fullContactCredentialslength equals  " + fullContactCredentialsLength);
  //var whatIsGroupNames = typeof(contactGroupDimensionNames);
  // ui.prompt("Type of group names equals " + whatIsGroupNames);
  var cGroupDimensionsFound = contactGroupDimensionNames.slice(0,cGroupDimensionPoisitionNotFound);
  var cGroupDimensionsNotFound = contactGroupDimensionNames.slice(cGroupDimensionPoisitionNotFound, cGroupDimensionsLength);
//  ui.prompt("cgroup dimensions found equals " + cGroupDimensionsFound + " cgroup dimension not found equals " + cGroupDimensionsNotFound);
 
  //First we add the new contact to the first Row position of which we know he fits wihtin the contact Group Dimensions   
  //Frst add the not yet found contact Groups as new Contact Groups to the list

  // Array to store in which rows (+1) we have added new contact groups in order to later create rowgroups in these rows
  var rowGroupPositionsToAdd = [];
  for (let i = 0; i<cGroupDimensionsNotFound.length; i++) {
  
    initialPositionoNewContactAndContactGroup = initialPositionoNewContactAndContactGroup + 1; 
   
    cGroupDimensionsFound.push(cGroupDimensionsNotFound[i]);

    //Add the contact Groups
    //Note to change the name of this function to something like addObjectToRow
    addContactToRow(initialPositionoNewContactAndContactGroup, cGroupDimensionsFound);
    
    // if i = 0 --> sort this collumn

    //Create new contact Group at this position as well
    //ui.prompt("added new contact / object and its contact groups to roww number" + initialPositionoNewContactAndContactGroup);

    rowGroupPositionsToAdd.push(initialPositionoNewContactAndContactGroup + 1); 
  } 

  ui.prompt("now adding the full contact credentiasl themselves ");
  //Now also add the fullContactCredentials
  initialPositionoNewContactAndContactGroup = initialPositionoNewContactAndContactGroup + 1;
  // ui.prompt("initials ")
  addContactToRow(initialPositionoNewContactAndContactGroup, fullContactCredentials);

  ui.prompt("now creating the rowgroups");
  ui.prompt("rowpositions to add equals " + rowGroupPositionsToAdd);

  var numberOfRowsToGroup = rowGroupPositionsToAdd.length;
for (let i =0; i<numberOfRowsToGroup; i++){ 
  numberOfRowsToGroup = numberOfRowsToGroup - i;
  createNewRowGroup(rowGroupPositionsToAdd[i], numberOfRowsToGroup);  
}  
  }


  function newContactAndContactGroupContainer(){
    var fullContactCredentials = getCachedContactCredentialsInArray();

  // works furhter on this 
  }
  


// TODO
function alterinputCGroups(){

  var fullContactCredentials = getCachedFullContactCredentials();
  var contactGroupPositional = getCachedContactGroupNotFoundVars();

  var itertationNotFoundHere = userCache.get('wanhoop');
//    var lastFoundExtremes = SessionStorage.getItem("lastFoundExtremes_1")
  //ui.prompt("KOMOOOPPPPPPP, session storage iteration is " + checkCacheKey2);
}




function getCredentialsOfFormObject(formObject){  
  var fullContactCredentials = ([
                formObject.cGroup_1,  
                formObject.cGroup_2,
                formObject.cGroup_3,
                formObject.cGroup_4, 
                formObject.first_name,
                formObject.last_name,                
                formObject.phone_number,
                formObject.email                 
                ]);

  //Put the phone number in between "" to ensure that the spreadsheet keep the original layout of the input
  fullContactCredentials[6] = "'" + fullContactCredentials[7];
  

 // const fullContactCredentials = Object.values(formObject);
  //ui.prompt ("within the getcredentialsofforn function, the full contact credentials array is equal to " + fullContactCredentials);
  cacheFullContactCredentials(fullContactCredentials); 
  return fullContactCredentials;
}


//This function gets called by the user response on the modal with two button: create new Cgroup  vs alter input Cgroups
function cGroupNotFoundModalDialog(buttonid){
  if (buttonid == "create-new-cGroups"){
    //ui.prompt("Create new contact groups")
    //It's working now !! SO what do we do now ?
    createNewContactGroups();
  }
  else if (buttonid =="alter-input-Cgoups"){
    //ui.prompt("alter inpjut of contact groups")
    alterinputCGroups();
  }
}

  // Given the starting row of a grouped range, find it's properties
  // Note that with this function, we do use the fact that it's a grouped range in order to find its properties
  // Return: groupdepth, GroupLength
function propertiesGroupedRange(startIndexGroupedRow) {             
  // Get the groupDepth
  var groupedRangeDepth = sheet.getRowGroupDepth(startIndexGroupedRow);
  Logger.log("grouped range depth is " + groupedRangeDepth);
  // Get the entire rowgroup
  var groupedRange = sheet.getRowGroup(startIndexGroupedRow,groupedRangeDepth);
  Logger.log("Grouped range is " + groupedRange)
  //Get the range of the rowgroup
  var rangeOfGroupedRange = groupedRange.getRange();
  Logger.log("range of grouped range is " + rangeOfGroupedRange)
  //Get the length (=numrows) of the rowgroup       
  return [groupedRangeDepth, rangeOfGroupedRange];
}    
  
function findRangeOfInterestProperties(rangeOfInterest){
  var startRowOfROI = rangeOfInterest.getRow();
  Logger.log("Range of interest starts at " + startRowOfROI);
  // and more properties 
  var numRowsOfRoI = rangeOfInterest.getNumRows();  
  Logger.log("Number of rows in ROI is equal to" +  numRowsOfRoI);

  var valuesOfROI = rangeOfInterest.getValues();
  var propertiesROI = [startRowOfROI, numRowsOfRoI, valuesOfROI];
  return propertiesROI;
  }



function propertiesOfRowGroup(nameOfRange){

  // var nameOfRange = "NRC";
  var rangeOfInterest = findRangeOfInterest(nameOfRange);
  var propertiesROG = findRangeOfInterestProperties(rangeOfInterest);
  var startRowOfROG = propertiesROG[0];
  Logger.log("Starting row of Row group is " + startRowOfROG);
  var startIndexOfROG = parseInt(startRowOfROG) + 1;
  Logger.log("Index of row group is " + startIndexOfROG);
  var numRowsOfROG = propertiesROG[1];
  Logger.log("num Rows of Row group is " + numRowsOfROG);
  var valuesOfROG = propertiesROG[2];
  Logger.log("Values of Row group is " + valuesOfROG);
  var rowGroupDepth = sheet.getRowGroupDepth(startIndexOfROG);
  Logger.log("Depth of Row Group is " + rowGroupDepth);
  var rowGroupDefinition = sheet.getRowGroup(startIndexOfROG,rowGroupDepth);
  Logger.log("Row group definition is " + rowGroupDefinition);

  var rowGroupProperties = [startRowOfROG, startIndexOfROG, numRowsOfROG, valuesOfROG, rowGroupDepth, rowGroupDefinition];
  return rowGroupProperties;
}



//Note: now you just remove the rowgroup only !!!
function removeRowGroup(nameOfRange, rowGroupDepth){

  var nameOfRange = "NRC"   
  var propertiesROG = propertiesOfRowGroup(nameOfRange);
  var rowGroup = propertiesROG[5];
  Logger.log("We are gonna remove rowgroup " + rowGroup);    
  }

function expandRowGroup(nameOfRange){
  var propertiesROG = propertiesOfRowGroup(nameOfRange);
  var rowGroup = propertiesROG[5];
  Logger.log("We are gonna remove rowgroup " + rowGroup);   

  var startRowOfROI = propertiesROI[0];
  var numRowsOfRoI = propertiesROI[1];
  // expand the given ROWGROUP here
  }

function moveROItoNewPosition(nameOfRange){
  var rangeOfInterest = findRangeOfInterest(nameOfRange);    
  var propertiesROI = findRangeOfInterestProperties(rangeOfInterest);
  var valuesOfROI = propertiesROI[2];
  // Delete old ROI
  // Create ROI on new Position
  }





// Get tags from sheet to use in the autosuggestion of the contact creds form
function getAvailableTags(tagColumn) {
  var data = sheet.getDataRange().getValues();
  var headers = 2; // number of header rows to skip at top
  ; // column # (0-based) containing tag

  var availableTags = [];

  for (var row=headers; row < data.length; row++) {
    availableTags.push(data[row][tagColumn]);
  }

  return( availableTags );
}

//INCLUDE HTML PARTS, EG. JAVASCRIPT, CSS, OTHER HTML FILES
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


//OPEN THE FORM IN SIDEBAR 
function addContactFormInput() {      
  var form = HtmlService.createTemplateFromFile('Index-add-contact.html').evaluate().setTitle('Contact Details');
  SpreadsheetApp.getUi().showSidebar(form);
}

function contactGroupNotFoundModalDialog() {      
  var dialog = HtmlService.createTemplateFromFile('Index-contact-groups-not-found.html').evaluate();
  SpreadsheetApp.getUi().showModelessDialog(dialog, "Missing contact groups");
}


function guiAlterContactGroups() {

  //Submenu 1: add a new contact group
  // NOTE: this only means the contact group is    added to the spreadsheet self, NOT to the Google contacts  (this only happens when updating contacts)
   var subMenuCreateContactGroup = ui.createMenu("Add a contact group")
     .addItem("Create new contact group", 'newContactGroupPrompt')


     ui.createMenu('Alter contact groups')
       //Reference submenu
     .addSubMenu(subMenuCreateContactGroup)
     //  .addSeparator()
     //  .addSubMenu(subMenuclear)  // Call submenu for updaten here
     .addToUi()
}


function gUIimportcontacts() {
  //Declaring submenus:
  //Submenu 1: import all contacts
   var subMenuImportContacts = ui.createMenu("Update Google contacts")
    .addItem("Import all contacts to Google Contacts", 'importContacts')
      // Submenu 2: update contacts (so delete the deleted, update the updates and add new contacts

      //Function yet to be created !

    ui.createMenu('Import contacts')
    //Reference submenu
    .addSubMenu(subMenuImportContacts)
  //  .addSeparator()
  //  .addSubMenu(subMenuclear)  // Call submenu for updaten here
    .addToUi()
}


//creeer totaal menu en zet de submenu's er in
function setAllGUIs() {
  //Submenu 2: Alter contact group. That is, alter name, function etc etc
  //Submenu 3: Delete an existing contact group
  // GuiAlterContacts()
  // guiAlterContacts()
  //  guiAlterContactGroups()
   
   guiDialog()
   guiTest()
   gUIimportcontacts()
}

function guiDialog() {

 //Submenu 1: add a new contact group
 // NOTE: this only means the contact group is    added to the spreadsheet self, NOT to the Google contacts  (this only happens when updating contacts)
  var subMenuShowDialogSidebar = ui.createMenu("Add contact")
    .addItem("Add new contact", 'addContactFormInput')
    ui.createMenu('Contacts')
      //Reference submenu
    .addSubMenu(subMenuShowDialogSidebar)
    //  .addSeparator()
    //  .addSubMenu(subMenuclear)  // Call submenu for updaten here
    .addToUi()
}

function onOpen(e) {

  setAllGUIs()

}





function test(){
  const test1 = "Naam1";
  const test2 = "Naam2";
  const test3 = "Naam3";
  const test4 = "Naam4";

  const testarray = ["testarray1", "testarray2", "testarray3", "testarray4"];


}


function guiTest(){
var testThisFunction = ui.createMenu('Testing')
  .addItem("testing", 'test')
  .addToUi()
}