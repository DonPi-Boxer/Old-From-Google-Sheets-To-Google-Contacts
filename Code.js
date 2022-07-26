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




//creeer totaal menu en zet de submenu's er in



function onOpen(e) {

  setAllGUIs()

}


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


// Declare all constants

var contactgroupIndex = 0;
var subgroupIndex = 1;
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


function doesContactGroupAlreadyExist(contactGroupName) {

  spreadsheet.toast("zit nu in goes group exist met group name" + contactGroupName);
  // Declare relevant variables
  // check if contact group already exists
  // Redclare datarange and data etc in case of multilation in between calling of script and opening of the sheet
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();
  var MaxRow = sheet.getLastRow();
  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues();     // Read all data
  data.splice(0,headerRows);            // Remove header rows
  
  var contactGroupExists = false;


  Logger.log("Input does exist is " + contactGroupName)
  for (var i in existingContactgroups) {
    

    // Note: maak onderstaande onafhankelijk van hoofdletters
    // If a team already exists with the given name; prompt this
    if (existingContactgroups[i] == contactGroupName) {
    spreadsheet.toast("This team already exists");

  contactGroupExists = true;
    break;
    // NOw put out a prompt: THIS CONTACT GROUP ALREADY EXISTS G
  }


  }
  spreadsheet.toast(contactGroupExists);
  return contactGroupExists;
}



function processForm(formObject){ 
   var sheet = SpreadsheetApp.getActiveSheet();
   sheet.appendRow([formObject.first_name,
                 formObject.last_name,
                 formObject.gender,
                 formObject.email
                 //Add your new field names here
                 ]);
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
      var subGroupName = credentials[6];

      var groupTypeNamestring = grouptypeName.toString();
      var contactGroupNamestring = contactGroupName.toString();
      var subGroupNameString = subGroupName.toString();

      Logger.log("Contact group is " + contactGroupName);
      
      var findGroupType = searchGroupedRange(contactGroupNamestring, 1);
      var foundContactGroup = findContactGroup[0];
      var contactGroupRow = findContactGroup[1];
    
        if (foundContactGroup === false){
          // Prompt here: no contact group existst with this name --> want to add one ? --> probably yess
        
        }
        else if (foundContactGroup === true && subGroupName != ""){
          Logger.log("Contact group found is " + foundContactGroup);
          Logger.log("the function found contact group row to be " + contactGroupRow);
          ///find subgroup in contact group function here
          var contactGroupPorepties = propertiesContactGroup(contactGroupRow);
          var contactGroupDepth = contactGroupPorepties[0];
          var rowGroupValuesMatrix = contactGroupPorepties[1];
          var contactGroupLength = contactGroupPorepties[2];

          Logger.log("Contact group depth is " + contactGroupDepth);
          Logger.log("rowgroup values matrix is " + rowGroupValuesMatrix);
          Logger.log("Ammount of contacts in the contact group is " + contactGroupLength);

          var subGroupInContactGroup = searchSubGroupWithinContactGroup(
          contactGroupRow, 
            contactGroupDepth, 
              rowGroupValuesMatrix, 
                contactGroupLength,   
                  subGroupNameString); 

          var subGroupFoundInContactGroup = subGroupInContactGroup[0];
          var rowSubGroupInContactGroup = subGroupInContactGroup[1];
          var rowOfNewContact = parseInt(rowSubGroupInContactGroup + 2);
          var subGroupDepth = subGroupInContactGroup[2];
          var subGroupValuesMatrix = subGroupInContactGroup[3];
          var subGroupLength = subGroupInContactGroup[4];

          // Also search if the given role already exists within the subgroup ...
          //           var roleInSubGroupContactGroup = searchSubGroupWithinContactGroup(
          // contactGroupRow, 
          //   contactGroupDepth, 
          //     rowGroupValuesMatrix, 
          //       contactGroupLength,   
          //         subGroupNameString); 

          Logger.log("Sub group found in contact group is " + subGroupFoundInContactGroup);
            
            // Add: and role is not found within the subgroup..
            if (subGroupFoundInContactGroup == true ){
              Logger.log("Will add a new contact in ConctactGroup " + contactGroupNamestring + 
              " In Subgroup " + subGroupNameString + " In row number " + rowOfNewContact);

              Logger.log("Sub group depth is " + subGroupDepth);
              Logger.log("Sub group values matrixx is " + subGroupValuesMatrix);
              Logger.log("Sub group length found in contact group is " + subGroupLength);

              expandSubGroup(subGroupNameString, rowOfNewContact);
              //addcontact(credentials, rowOfNewContact);
              }

              else if (subGroupFoundInContactGroup == false){
              Logger.log("Subgroup is not found within this contact group: what to do now ?")
              /// --> create new sub group within the contact group

              // Search Contact group within entire sheets
              }
            }   
        // else if (foundContactGroup === true && subGroupName == ""){
      
            // Prompt: are you sure you dont want to add a sub group ?
}


//// USe test function under this function to work further !!!!
//Generic function to test all created modules
function testsearch(){
  
  // For the first search, we want to start around the entire spreadsheet
  var startRowToSearch = 1;
  var numRowsToSearch = 100;
  var collumnToSearch = 1;

  var rangetosearch = sheet.getRange(startRowToSearch, collumnToSearch, numRowsToSearch)

  var groupedRangeHeaders = ["Politiek", "Volt", "Campagne", "Rol"]

  var collumns = [1,2,3]
  //Declare empty array to store the found range of the grouped rows in
  var groupedRanges = [];

  //Declare empty array to store the starting rows of each found named range in
  var startingRows = [];

  //Declare empty array to store the group dapth of each found named range in
  var groupdepths = [];

  //Declare zero iteration counter

  var iteration = 0;

  for (var i in groupedRangeHeaders) {

    groupedRangeHeader = groupedRangeHeaders[i]

    Logger.log("In this iteration the grouped range header is equal to " + groupedRangeHeader)
    //Search the grouped range for iteration ...
    var searchGroup = searchGroupedRange(groupedRangeHeader, rangetosearch);

    Logger.log("Search grouped range returns for iteration " + iteration + " that we did find the groupedrange ? " + searchGroup[0] + " With starting row number " +  searchGroup[1])

    var groupedRangeFound = searchGroup[0]
    
    //Als search grouped range is true
    if (groupedRangeFound == true)  {
      //We already know the starting row of the grouped row we found

      var startRowOfGroupedRange = searchGroup[1];
      startingRows.push(startingRows);

      //And now we want to search it's properties

      var groupedRowProperties = propertiesGroupedRange(startRowOfGroupedRange);
      Logger.log("Properties for iteration " + iteration + " for header " + groupedRangeHeader + " equals " + groupedRowProperties);

      var groupedRangeDepth = groupedRowProperties[0];
      groupdepths.push(groupedRangeDepth);

      var rangeOfgroupedRange = groupedRowProperties[1];
      groupedRanges.push(rangeOfgroupedRange);

  ////// WE BUG UNDERNEATH: TRY TO FIND A WORKAROUND FOR THIS !!    

      //The found range of the named range of this iteration than is the new range to search in the new iteration

    //  var collumnToSearchInNextIteration = collumns[i]
      var rangematrix = [rangeOfgroupedRange];

      // LET OP DAT HIERONDER DIE NUL DAN WSS VAN KOLOM NAAR KOLOM MOET GAAN
      var rangetosearch = rangematrix[0];

      rangetest = rangetosearch[0];
      Logger.log("range to search equals " + rangetosearch);
      Logger.log("Values in range to search are " + rangetosearch.getValues() )
     // Logger.log("range to search equals " + rangetosearch + " with values " + sheet.getRange(rangetosearch).getValues());
    }

    else if (groupedRangeFound == false){
      return;   
  }
   iteration = iteration + 1;
}

}


/// For testing puposes
//// This works now !!!!!! Work further on this test function to find the position etc we need !!

  function test() {
    var groupedRangeHeaderTest = "Krant";
    var firstRowPositionToTest = 1
    var lastRowPositionToTest = 100
    var collumnPositionToTest = 1

    var findGroupedRange = searchGroupedRange(groupedRangeHeaderTest, firstRowPositionToTest, lastRowPositionToTest, collumnPositionToTest);

    if (findGroupedRange != false){      
      var firstRowPositionGroupedRange = findGroupedRange[0];
      var lastRowPositionGroupedRange = findGroupedRange[1];
      Logger.log("First row position of grouped range is" + firstRowPositionGroupedRange);
      Logger.log("Lasr row position of grouped range is " + lastRowPositionGroupedRange);
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

  function searchGroupedRange(groupedRangeHeader, firstRowPositionToSearch, lastRowPositionToSearch, collumnPositionToSearch) {  
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
    var firstRowIndexGroupedHeader = rangeToSearchValues.indexOf(groupedRangeHeader);
    Logger.log("first row index grouped header equals " + firstRowIndexGroupedHeader);

    Logger.log("We are searching for the grouped range header" + groupedRangeHeader);
    //Confirm that the first index is found by checking that the query did NOT return -1

    if (firstRowIndexGroupedHeader != -1){
    //Then use lastindex to find the last index of the GroupedRangeHeader
    //Note that last index and first index can have the same value, if only one row with the header exists
    var lastRowIndexOfGroupedRangeHeader = rangeToSearchValues.lastIndexOf(groupedRangeHeader);

    //Convert both found indices to position by adding it to the starting position of the Rows used for the search range  
    var firstRowPositionOfHeader = firstRowIndexGroupedHeader + firstRowPositionToSearch;
    var lastRowPositionOfHeader = lastRowIndexOfGroupedRangeHeader + firstRowPositionToSearch;

    Logger.log("We found the grouped row !")
    return [firstRowPositionOfHeader, lastRowPositionOfHeader];
    }

    //If no first index of the header is found (and thus also no last index will be found)
    //Return false --> when calling this function, the return statement false will indicate that a new groupedrange has to be created
  
  else if (firstRowIndexGroupedHeader === -1) {

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



    // function getRangeList(){

    //  }


    

     // Note: make this into a generic function for findig a rowgroup within any rowgroup
    function searchSubGroupWithinContactGroup(contactGroupRow, contactGroupDepth, rowGroupValuesMatrix, contactGroupLength, subGroupNameString) {

      // Make sure the subGroupName is a string         
      var foundSubGroupInContactGroup = false;

    // var subGroupsInContactGroup = sheet.getRange()
    // var existingContactgroupsMatrix = [existingContactgroups.getValues()];
    // var existingContactGroupsArray = existingContactgroupsMatrix[0];

      // First: search if this SUbGroup already existst within the Given COntact group (if so --> append Contact here here)
      for (i=0 ; i < contactGroupLength; i++) {
        // Get the entire Row of the row in this iteration
        contactGroupRowValues = rowGroupValuesMatrix[i];
        // Get the values belonging to the index of the SubGroup
        var iterationSubGroupName = contactGroupRowValues[subgroupIndex];
          if (subGroupNameString === iterationSubGroupName) {
            foundSubGroupInContactGroup = true;
            Logger.log("true")
            var subGroupRowStart = parseInt(i) + contactGroupRow + 1;
            Logger.log("SubgroupRowStart is " + subGroupRowStart);    
            break               
            }  
             }

          if (foundSubGroupInContactGroup = true) {
            var subGroupDepth = sheet.getRowGroupDepth(subGroupRowStart);
            var rowGroupOfSubGroup = sheet.getRowGroup(subGroupRowStart,subGroupDepth); 
            Logger.log("row group of subgroup is " + rowGroupOfSubGroup);      
            var rowGroupOfSubGroupRange = rowGroupOfSubGroup.getRange();
            Logger.log("range is equal to " + rowGroupOfSubGroupRange);   
            var subGroupValues = rowGroupOfSubGroupRange.getValues();  
            Logger.log("SUbgroupvalues is equal to " + subGroupValues);
            var subGroupLength = subGroupValues.length;           
            Logger.log("Sub Group length is " + subGroupLength); 
            // Note this denotes the last row of the sub group (so this includes possible whitespaces)
            var subGroupRowEnd = subGroupRowStart + subGroupLength; 
            Logger.log("Sub Group Row end is " + subGroupRowEnd);
            
            return [foundSubGroupInContactGroup, subGroupRowStart, subGroupDepth, subGroupLength, subGroupRowEnd];
          }
        }
  


// If the subGroup can not be found within the specified contact group --> see if this contactgroup already exists within other contactGroups.
  function searchSubGroupInOtherContactGroups() {

  }

    // Finally, we can add the new contacts to the sheet
  function addNewContact(){
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




function addNewContactgroup(contactGroupName) {
  var MaxRow = sheet.getLastRow();
  // (include a white row between the new and the adjacent contact group)
  var rowNewContactgroup = MaxRow + 2;
  var newContactGroupAdd = sheet.getRange(rowNewContactgroup,contactgroupIndex+1).setValue(contactGroupName).setFontWeight("bold");
  // Create a range group for the new contact group. The Range which can inklappen we want underneath the title of this contact group (hece rownewcontactgroup +1)
  var rangeOfGroup = SpreadsheetApp.getActiveSheet().getRange(rowNewContactgroup+1,1,1);
  var group = rangeOfGroup.activate().shiftRowGroupDepth(1);
  addFirstContactToNewContactGroupPrompt(contactGroupName);
  var namedRange = spreadsheet.setNamedRange(contactGroupName, rangeOfGroup);
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



// Underneath is all about importing the contact to google contacts


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



//// Practising cards is underneath

// function theCard() {

// var textInput = CardService.newTextInput()
//     .setFieldName("text_input_form_input_key")
//     .setTitle("Text input title")
//     .setHint("Text input hint")


 
//  var cardsection = CardService.newCardSection()
//   .addWidget(textInput)

// var card = CardService.newCardBuilder()
//     .setName("Card name")
//     .setHeader(CardService.newCardHeader().setTitle("Card title"))
//     .addSection(cardsection)
//     .build();

// return card;
// }


// function guipracticeCard() {

//   //Submenu 1: add a new contact group
//   // NOTE: this only means the contact group is    added to the spreadsheet self, NOT to the Google contacts  (this only happens when updating contacts)
//    var subMenuCreateContact = ui.createMenu("Practice Cards")
//      .addItem("practice", 'practiceCard')


//      ui.createMenu('Practice')
//        //Reference submenu
//      .addSubMenu(subMenuCreateContact)
//      //  .addSeparator()
//      //  .addSubMenu(subMenuclear)  // Call submenu for updaten here
//      .addToUi()
// }



// function practiceCard() {

// var textInput = CardService.newTextInput()
//     .setFieldName("text_input_form_input_key")
//     .setTitle("Text input title")
//     .setHint("Text input hint");


//     return CardService
//      .newCardBuilder()
//      .addSection(
//     CardService.newCardSection()
//     .addWidget(textInput))
//       .build();
// }






// // Underneath is for testing purposes
// function creategroup() {

//   //Function here does: create a grou, starting at row number A, with a length of B row. Note: The first "1" is to specify the collumn number of the group (could be any number actually), the second one (shiftrowgroupdepth specifies the AMMOUNT of groups that is created. For this purpose, we only need one group (aka one company), so this will do !

//  // var pivotTable = SpreadsheetApp.getActiveSheet().getRange('A1').createDataSourcePivotTable();

//   var group = SpreadsheetApp.getActiveSheet().getRange(A,1,B).activate().shiftRowGroupDepth(1);

// }


// Hierboven nog toevoegen:
// Merge contact voor het geval een duplicats
// Add labels voor mensen met meerdere rollen / algemeen extra