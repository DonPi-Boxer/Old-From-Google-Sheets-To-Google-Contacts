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



// Note dat onderstaande functies op dit moment NIET gebruikt worden

function guiAlterContacts() {

  //Submenu 1: add a new contact group
  // NOTE: this only means the contact group is    added to the spreadsheet self, NOT to the Google contacts  (this only happens when updating contacts)
   var subMenuCreateContactGroup = ui.createMenu("Create new contact")
     .addItem("Create contact", 'newContactSearchContactGroupPrompt')


     ui.createMenu('Alter contacts')
       //Reference submenu
     .addSubMenu(subMenuCreateContactGroup)
     //  .addSeparator()
     //  .addSubMenu(subMenuclear)  // Call submenu for updaten here
     .addToUi()
}


function newContactSearchContactGroupPrompt(contactGroupExists){
  var contactGroupofNewContact =  ui.prompt("To which contact group do you want to add the contact ?").getResponseText();
  spreadsheet.toast(contactGroupofNewContact);
    
  var contactGroupExists = doesContactGroupAlreadyExist(contactGroupofNewContact);

  spreadsheet.toast(contactGroupExists); 


    if (contactGroupExists == false) {

    var runAgain = false;
    while (runAgain == false) {
 
     var response = ui.alert('Create new contact group ?','There is no contact group with the given name. Do you want to create a new contact group with this name (Yes) or try again to type the correct name (No) ?', ui.ButtonSet.YES_NO_CANCEL); 
    

    if (response == ui.Button.YES) {
      runAgain = true;
      addNewContactgroup(contactGroupofNewContact);
      // Now the new contact group is created --> add the first credentials into there (this is already incorporated inside the function over there   (will do this later))
} else if (response == ui.Button.NO) {

  
  // run this prompt again
  Logger.log('Try again');
}

  else if (response == ui.Button.CANCEL) {
    runAgain = true;
    break;
  }

  

    else if (contactGroupExists == true){
      // Prompt with name and contact info of contact
  }
    }
} 
}

// function processForm(formObject){ 
//   var sheet = SpreadsheetApp.getActiveSheet();
//   sheet.appendRow([formObject.first_name,
//                 formObject.last_name,
//                 formObject.gender,
//                 formObject.email
//                 //Add your new field names here
//                 ]);
// }

function addContact(formObject){
  // var credentials = ([formObject.first_name,
  //               formObject.last_name,
  //               formObject.email,
  //               formObject.phone_number,
  //               formObject.contact_group,
  //               formObject.sub_group,
  //               formObject.role,
  //               formObject.contact_group,
  //               ]);
  //   var contactGroup = credentials[4];

      var contactGroupName = "NRC";
      var subGroupName = "Criminaliteit";

      var contactGroupNamestring = contactGroupName.toString();
      var subGroupNameString = subGroupName.toString();

      Logger.log("COntact group is " + contactGroupName);
      var findContactGroup = searchContactGroup(contactGroupNamestring);
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


//// Search for the contact Group: if found --> return [true, row index]. If false, return [false]
    function  searchContactGroup(contactGroupNamestring) {
    Logger.log(iterationContactGroupName);
    var existingContactgroups= sheet.getRange(headerRows, 1, MaxRow);
    var existingContactgroupsMatrix = [existingContactgroups.getValues()];
    var existingContactGroupsArray = existingContactgroupsMatrix[0];
    // Logger.log("Range is " + rangeExistingContactGroups);    
    // Logger.log("Existingcontactgroupsname is " + existingContactgroupsname);
   
    var foundContactGroup = false;

    for (var row in existingContactGroupsArray) {
      var iterationContactGroupName = existingContactGroupsArray[row].toString();
      
      if (contactGroupNamestring === iterationContactGroupName) {    
        
        var rowofContactGroup = parseInt(row) + headerRows;
        var indexofContactGroup = rowofContactGroup + 1;             
        /// Create contact function here --> input : rowofcontactgroup
        foundContactGroup = true;
        return [foundContactGroup, indexofContactGroup];
        }
    }
        if (foundContactGroup === false)
        return [foundContactGroup];
}


    // Find the properties of the ContactGroup to define in another function --> [SubGroupNameString, contactGroupDepth, ]
    function propertiesContactGroup(contactGroupRow) {             
      // Find the Group Depth of the Contact Group (note that this should actually be one, as the contact group is the header, thus has no bigger    depth than one)
      var contactGroupDepth = sheet.getRowGroupDepth(contactGroupRow);
      // Find the entire rowGroup of this contact Group --> get ists values inside a mtrix
      var rowGroupOfContactGroup = sheet.getRowGroup(contactGroupRow,contactGroupDepth);
      var rowGroupRange = rowGroupOfContactGroup.getRange();
      var rowGroupValuesMatrix = rowGroupRange.getValues();
      var contactGroupLength = parseInt(rowGroupValuesMatrix.length);
      // The ammount of contact entries within the contact Group (-1 because of the white space at the end of a contact Group)
        
      return [contactGroupDepth, rowGroupValuesMatrix, contactGroupLength];
  }    
     

     // Note sure if understanding function will be handy or not !!
     function findNamedRangeProperties(nameOfRange) {
      var nameOfRange = "NRCSociologie";
      var rangeOfInterest = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(nameOfRange);
      Logger.log("Range of interest is " + rangeOfInterest);
      var numRowsOfRoI = rangeOfInterest.getNumRows();
      Logger.log("Number of rows in " + nameOfRange + " is equal to " + numRowsOfRoI);
      var numColsOfRoI = rangeOfInterest.getNumColumns();
      Logger.log("Number of collumn in " + nameOfRange + " is equal to " + numColsOfRoI);
      var namedRangeValues = rangeOfInterest.getValues();
      Logger.log("Values in named range " + nameOfRange + " are equal to " + namedRangeValues);
      // below here is a test function: delete this one !
      var testest = expandNamedRange(nameOfRange, numRowsOfRoI, rangeOfInterest, 1);
     }

     function findRangeOfInterest(nameOfRange){
      var rangeOfInterest = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(nameOfRange);
      Logger.log("Range of interest is " + rangeOfInterest);
      return rangeOfInterest;
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

  

    function deleteNamedRange(nameOfRange){
    var deleteNamedrange = ss.removeNamedRange(nameOfRange);        
    Logger.log("Deleted named range " + nameOfRange);
    }



      function createNamedRange(nameOfRange, rangeOfNamedRange){
        var newNamedRange = ss.setNamedRange(nameOfRange, rangeOfNamedRange);
        Logger.log("Created named Range " + nameOfRange + " with a range of " + rangeOfNamedRange);
      }

          function createRowGroup(nameOfRange, contacttGroupProperties){      
    }
    
      /// We do this by first deleting the orginal named range and then recreate him with an extra number of numRowsToExpand
     function expandNamedRange(nameOfRange, numRowsToExpand) {
      var nameOfRange = "NRC";
      var numRowsToExpand = 1; 

      var rangeOfInterest = findRangeOfInterest(nameOfRange);

      var propertiesROI = findRangeOfInterestProperties(rangeOfInterest);

      var startRowOfROI = propertiesROI[0];
      var numRowsOfRoI = propertiesROI[1];
      
      var newNumRowOfRoi = numRowsOfRoI + numRowsToExpand;
      Logger.log("Number of rows in " + nameOfRange + " will become " + numRowsOfRoI);
      var lastRowOfnewROI = startRowOfROI + newNumRowOfRoi;
      Logger.log("The new last row of the named range " + nameOfRange + " will thus become" + lastRowOfnewROI);
      var newRangeOfNameRange = sheet.getRange(startRowOfROI, startColContacts, newNumRowOfRoi, numColsContacts);
      deleteNamedRange(nameOfRange);
      createNamedRange(nameOfRange,newRangeOfNameRange);   
     }



    // NOte: now you delete all cells within the rowgroup !!
    function deleteRowGroup(nameOfRange){    
    var rangeOfInterest = findRangeOfInterest(nameOfRange);       
    var deleteROI = rangeOfInterest.deleteCells();    
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



function newContactGroupPrompt(contactGroupExists){
  var contactGroupName =  ui.prompt("Please enter the contact group name").getResponseText();
  spreadsheet.toast(contactGroupName);
    
  var contactGroupExists = doesContactGroupAlreadyExist(contactGroupName);

  spreadsheet.toast(contactGroupExists);
    if (contactGroupExists == false) {
    
      addNewContactgroup(contactGroupName);  
  }

    else if (contactGroupExists == true){
  var teamalreadyexists = ui.alert('Contact group already exists', 'There already exists a contact group with the given name; try to add relevant contacts to the already existing contact group', ui.ButtonSet.OK);
  }
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

function addFirstContactToNewContactGroupPrompt(contactGroupName) {
  var addNewContact = ui.alert("Add first contact ?", "New contactgroup with name " + contactGroupName + " is created. Do you want to add a first contact to this contact group ?", ui.ButtonSet.YES_NO);

  if (addNewContact == ui.Button.YES) {
  var firstContactInContactGroupRowNumber = MaxRow + 3;
  addContactForm();
  }

  else if (addNewContact == ui.Button.NO) {
    ui.alert("Are you sure ?", "You're about to create a new contact group which is empty. It is adviced to add a new contact now immediately, otherwise there wil be a whiteline underneath this contact group when a new contact is added.", ui.ButtonSet.YES_NO);
     
     if (ui.ButtonSet == ui.Button.YES){
       ui.alert("Ok have a nice, Voltey day", ui.Button.OK);
       return;
     }
    else if (ui.ButtonSet == ui.Button.NO){
      var firstContactInContactGroupRowNumber = MaxRow + 3;
      addContactForm();
      
    }    
  }
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