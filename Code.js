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





// Declare all constants

var contactgroupIndex = 0;
var contactGroupIndex = 1;
var positionIndex = 2;
var firstNameIndex = 3;
var lastNameIndex = 4;
var emailIndex = 5;
var mobileIndex = 6;
var statusIndex = 7;
var headerRows = 2;

var ui =  SpreadsheetApp.getUi();

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

// Indices of collum numbers of the input

function test() {
    // Contact groups array for testing puposes now: get here the array of the contact groups of the credentials of new contact
    var contactGroupsArray = ["Krant", "NRC", "Sociale zaken", "lead"];
    Logger.log("contact groups array is " + contactGroupsArray);

    // Array consisting of the length of the number of contact groups defined in the sheet
    var collumnPositionToTestArray = [1,2,3,4];

    // For the 1st dimenstion, we want to search through the entire sheet
    var firstRowPositionToSearch = 1;
    var lastRowPositionToSearch = ss.getLastRow();
    

    for (var i=0; i < contactGroupsArray.length; i++){

    Logger.log("In iteration " + i + " for finding row position of new contact")

    var contactGroupDimensionToSearch = contactGroupsArray[i];
    var collumnPositionToSearch = collumnPositionToTestArray[i];
    
    Logger.log("Searching in contact group dimension " + contactGroupDimensionToSearch + " at collumn position " + collumnPositionToSearch);
    Logger.log("First row to search is " + firstRowPositionToSearch + " last row position to search is " + lastRowPositionToSearch);

    var rowRangeFoundcontactGroup = findPositionOfNewContact(contactGroupDimensionToSearch, firstRowPositionToSearch, lastRowPositionToSearch, collumnPositionToSearch);
    
    Logger.log(rowRangeFoundGroup);

    //Update the first and last row position to search for the next iteration

    firstRowPositionToSearch = rowRangeFoundcontactGroup[0];
    lastRowPositionToSearch = rowRangeFoundcontactGroup[1];
    }
  }

  function findPositionOfNewContact(contactgroupDimension, firstRowPositionToSearch, lastRowPositionToSearch, collumnPositionToSearch) {
  

    var contactGroupRange = searchContactGroupRange(contactgroupDimension, firstRowPositionToSearch, lastRowPositionToSearch, collumnPositionToSearch);

    if (findGroupedRange != false){      
      var firstRowPositionGroupedRange = contactGroupRange[0];
      var lastRowPositionGroupedRange = contactGroupRange[1];
      Logger.log("First row position of grouped range dimension" + contactgroupDimension + " is " + firstRowPositionGroupedRange);
      Logger.log("Last row position of grouped range dimension  is " + lastRowPositionGroupedRange);
      Logger.log("Find grouped range equals" + findGroupedRange);
      return [firstRowPositionGroupedRange, lastRowPositionGroupedRange]
    }

    else if (findGroupedRange == false){
      //Als grouped range niet gevonden is --> maak een nieuwe
      Logger.log("group header not found --> inser new group ?");
      Logger.log("findgrouped range equals" + findGroupedRange);
    }
  } 


      //// Search the (grouped) range that has hadder name "GroupedRangeHeader", within the range startRow, numrows, collumn
      //// Note that in this function, we do not yet use the fact that the range is grouped to find the group
      //// Return it's starting row number if found, return false if not found.
      //Ensure that the groupedRangeHeader is a string !!!

  function searchcontactGroupRange(contactGroupHeader, firstRowPositionToSearch, lastRowPositionToSearch, collumnPositionToSearch) {  
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
    Logger.log("Range values Matrix equals " + rangeToSearchValuesArrays);

    //Range to search values Arrays contains of arrays of arrays (depicting the string we search)
    // We wnat an array of strings to use the indexOf and lastindex of functions
    //--> force the array of string arrays into one long array
    //Then split it into one array of strings, at every "," in the entire arrays of the arrays of arrays
    //(Bullshit workaround but it works :))))))

    var rangeToSearchValues = String(rangeToSearchValuesArrays).split(",");
    Logger.log("The Values of the Range in which we will search are " + rangeToSearchValues);
  
    //Use indexOf to find the first index of the GroupedRangeHeader
    var firstRowIndexcontactGroupDimension = rangeToSearchValues.indexOf(contactGroupHeader);
    Logger.log("first row index grouped header equals " + firstRowIndexcontactGroupDimension);

    Logger.log("We are searching for the grouped range header" + contactGroupHeader);
    //Confirm that the first index is found by checking that the query did NOT return -1

    if (firstRowIndexcontactGroupDimension != -1){
    //Then use lastindex to find the last index of the GroupedRangeHeader
    //Note that last index and first index can have the same value, if only one row with the header exists
    var lastRowIndexOfGroupedRangeHeader = rangeToSearchValues.lastIndexOf(Header);

    //Convert both found indices to position by adding it to the starting position of the Rows used for the search range  
    var firstRowPositionOfHeader = firstRowIndexcontactGroupDimension + firstRowPositionToSearch;
    var lastRowPositionOfHeader = lastRowIndexOfGroupedRangeHeader + firstRowPositionToSearch;

    Logger.log("We found the grouped row !")
    return [firstRowPositionOfHeader, lastRowPositionOfHeader];
    }

    //If no first index of the header is found (and thus also no last index will be found)
    //Return false --> when calling this function, the return statement false will indicate that a new contactGroup has to be created
  
  else if (firstRowIndexcontactGroupDimension === -1) {

    Logger.log("we did not find the grouped row :(")
    return false;
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





function addNewContactgroup(contactGroupName) {
  var MaxRow = sheet.getLastRow();
  // (include a white row between the new and the adjacent contact group
  var rowNewContactgroup = MaxRow + 2;
  var newContactGroupAdd = sheet.getRange(rowNewContactgroup,contactgroupIndex+1).setValue(contactGroupName).setFontWeight("bold");
  // Create a range group for the new contact group. The Range which can inklappen we want underneath the title of this contact group (hece rownewcontactgroup +1)
  var rangeOfGroup = SpreadsheetApp.getActiveSheet().getRange(rowNewContactgroup+1,1,1);
  var group = rangeOfGroup.activate().shiftRowGroupDepth(1);
  addFirstContactToNewContactGroupPrompt(contactGroupName);
  var namedRange = spreadsheet.setNamedRange(contactGroupName, rangeOfGroup);
}



function addContact(formObject){
  var credentials = (
                [formObject.first_name,
                formObject.last_name,
                formObject.email,
                formObject.phone_number,
                formObject.group_type,
                formObject.contact_group,
                formObject.sub_group,
                formObject.role,
                formObject.contact_group,
                 ]);
     
     
      var grouptypeName = credentials[4];
      var contactGroupName = credentials[5];
      var contactGroupName = credentials[6];

      var groupTypeNamestring = grouptypeName.toString();
      var contactGroupNamestring = contactGroupName.toString();
      var contactGroupNameString = contactGroupName.toString();

      Logger.log("Contact group is " + contactGroupName);
      
      var findGroupType = searchGroupedRange(contactGroupNamestring, 1);
      var foundContactGroup = findContactGroup[0];
      var contactGroupRow = findContactGroup[1];
    
        if (foundContactGroup === false){
          // Prompt here: no contact group existst with this name --> want to add one ? --> probably yess
        
        }
        else if (foundContactGroup === true && contactGroupName != ""){
          Logger.log("Contact group found is " + foundContactGroup);
          Logger.log("the function found contact group row to be " + contactGroupRow);
          ///find contactGroup in contact group function here
          var contactGroupPorepties = propertiesContactGroup(contactGroupRow);
          var contactGroupDepth = contactGroupPorepties[0];
          var rowGroupValuesMatrix = contactGroupPorepties[1];
          var contactGroupLength = contactGroupPorepties[2];

          Logger.log("Contact group depth is " + contactGroupDepth);
          Logger.log("rowgroup values matrix is " + rowGroupValuesMatrix);
          Logger.log("Ammount of contacts in the contact group is " + contactGroupLength);

          var contactGroupInContactGroup = searchcontactGroupWithinContactGroup(
          contactGroupRow, 
            contactGroupDepth, 
              rowGroupValuesMatrix, 
                contactGroupLength,   
                  contactGroupNameString); 

          var contactGroupFoundInContactGroup = contactGroupInContactGroup[0];
          var rowcontactGroupInContactGroup = contactGroupInContactGroup[1];
          var rowOfNewContact = parseInt(rowcontactGroupInContactGroup + 2);
          var contactGroupDepth = contactGroupInContactGroup[2];
          var contactGroupValuesMatrix = contactGroupInContactGroup[3];
          var contactGroupLength = contactGroupInContactGroup[4];

          // Also search if the given role already exists within the contactGroup ...
          //           var roleIncontactGroupContactGroup = searchcontactGroupWithinContactGroup(
          // contactGroupRow, 
          //   contactGroupDepth, 
          //     rowGroupValuesMatrix, 
          //       contactGroupLength,   
          //         contactGroupNameString); 

          Logger.log("Sub group found in contact group is " + contactGroupFoundInContactGroup);
            
            // Add: and role is not found within the contactGroup..
            if (contactGroupFoundInContactGroup == true ){
              Logger.log("Will add a new contact in ConctactGroup " + contactGroupNamestring + 
              " In contactGroup " + contactGroupNameString + " In row number " + rowOfNewContact);

              Logger.log("Sub group depth is " + contactGroupDepth);
              Logger.log("Sub group values matrixx is " + contactGroupValuesMatrix);
              Logger.log("Sub group length found in contact group is " + contactGroupLength);

              expandcontactGroup(contactGroupNameString, rowOfNewContact);
              //addcontact(credentials, rowOfNewContact);
              }

              else if (contactGroupFoundInContactGroup == false){
              Logger.log("contactGroup is not found within this contact group: what to do now ?")
              /// --> create new sub group within the contact group

              // Search Contact group within entire sheets
              }
            }   
        // else if (foundContactGroup === true && contactGroupName == ""){
      
            // Prompt: are you sure you dont want to add a sub group ?
}






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




// function addNewContact(){
//   //PROCESS FORM: get the contact information from the dialog

//     var sheet = SpreadsheetApp.getActiveSheet();
//     var credentials = ["First_Name", "Last_Name", "Email", "Phone_Number", "form_object", "sub_group", "role" ];

//     // // Check in which of the contactsgroup we want to add this new contact
//     // for (var i = 0; i < data.length; i++) {
//     // }
      
//     sheet.appendRow(credentials);
//   }




// function addNewContact(contactGroupName) {
//   // (include a white row between the new and the adjacent contact group)
//   var rowNewContactgroup = MaxRow + 2;
//   var newContactGroupAdd = sheet.getRange(rowNewContactgroup,contactgroupIndex+1).setValue(contactGroupName).setFontWeight("bold");

//   // Create a range group for the new contact group. The Range which can inklappen we want underneath the title of this contact group (hece rownewcontactgroup +1)
//   var group = SpreadsheetApp.getActiveSheet().getRange(rowNewContactgroup+1,1,1).activate().shiftRowGroupDepth(1);
  
// }



//creeer totaal menu en zet de submenu's er in






function setAllGUIs() {
   //Submenu 2: Alter contact group. That is, alter name, function etc etc
   //Submenu 3: Delete an existing contact group
   // GuiAlterContacts()
   // guiAlterContacts()
    // guiTestWidget()
    guiDialog()
    guiAlterContactGroups()
    gUIimportcontacts()

}



function guiDialog() {

  //Submenu 1: add a new contact group
  // NOTE: this only means the contact group is    added to the spreadsheet self, NOT to the Google contacts  (this only happens when updating contacts)
   var subMenuShowDialogSidebar = ui.createMenu("Add contact")
     .addItem("Add new contact", 'addContactForm')
     ui.createMenu('Contacts')
       //Reference submenu
     .addSubMenu(subMenuShowDialogSidebar)
     //  .addSeparator()
     //  .addSubMenu(subMenuclear)  // Call submenu for updaten here
     .addToUi()
}


//OPEN THE FORM IN SIDEBAR 
function addContactForm() {      
  var form = HtmlService.createTemplateFromFile('Index').evaluate().setTitle('Contact Details');
  SpreadsheetApp.getUi().showSidebar(form);
}



//INCLUDE HTML PARTS, EG. JAVASCRIPT, CSS, OTHER HTML FILES
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
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




function onOpen(e) {

  setAllGUIs()

}
// Underneath is all about importing the contact to google contacts


// Process the filled in formobject aka get credentials of the new contact
function getCredentialsOfForm(formObject){ 

  var fullContactCredentials = ([
                formObject.cGroup_1,  
                formObject.cGroup_2,
                formObject.cGroup_3,
                formObject.cGroup_4,
                formObject.first_name,
                formObject.last_name,
                formObject.email,
                formObject.phone_number     
                ]);

 // var contactGroupDimensionNames = fullContactCredentials.slice(0,3);

  SpreadsheetApp.getActive().toast(fullContactCredentials);
  Logger.log(fullContactCredentials);
  return [fullContactCredentials];
}


// Get tags from sheet
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




// // Underneath can probably be deleted
// function addNewContactToContactgroup(rowOfNewContact){
//   // create function to add a new contact to an existing contact group here
    
//     var contactFirstName = credentialsPrompt();

//     if (contactFirstName === "") {
//       return
//     }

//     else {
//     spreadsheet.toast("Name is " + contactFirstName); 
//    // spreadsheet.toast("row of new contact 2 is " + rowOfNewContact);
//     sheet.getRange(rowOfNewContact,firstNameIndex+1).setValue(contactFirstName);

//     // Add a whiteline underneath the newly created contact for overview between the different contact groups --> do we want this ?
//     var group = SpreadsheetApp.getActiveSheet().getRange(rowOfNewContact+1,1,1).activate().shiftRowGroupDepth(1);
//     }
// }


// Note: tru to make this a generic function, which places the contact in a row X. (So addFirstContactGroup(Rownumber))


// Underneath function can probably be deleted
// function credentialsPrompt(){  
 
//   var namePopUp = ui.prompt("Name ?", ui.ButtonSet.OK_CANCEL);
//   var namePopUpButton = namePopUp.getSelectedButton();
  
//    if (namePopUpButton == ui.Button.OK){   
//       var contactFirstName = namePopUp.getResponseText();
//       return contactFirstName;
//   }
//     else if (namePopUpButton== ui.Button.CANCEL){
//       /// Note: I think return here will give an error, as it only stops this function --> say iff THIS FUNCTION EMPTY --> return in the function that call this function. 
//       return;
//       }
// }