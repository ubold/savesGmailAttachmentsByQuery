function getAttachmentsFromGmail() {
  
  // CHANGE THIS to your specific needs
  var query = "has:attachment label:starred";
  
  // Find starred messages with subject IMPORTANT and return second batch of 10.
  // Assumes there are at least 11 of them, otherwise this will return an empty array.
  
  // google scripts has execution limit for free account, do ~40 emails at a time to be safe
  // CHANGE THIS - change second number to number if emails to retrieve. 
  // increment the page per run   
  var pageNumber = 1; 
  var pageSize = 40;
  var starredThreads = GmailApp.search(query, pageNumber, pageSize);
  
  
  // just a counter
  var attachmentNumber = 0;
  var threadLimit = 4; 
  
  // CHANGE THIS
  var folderName = "title contains 'AttachmentFolder'";
  var folderSearch = DriveApp.searchFolders(folderName);
  var attachmentFolder; 
  
  if(folderSearch.hasNext()==true){
    attachmentFolder = folderSearch.next();
  }
  else{
    attachmentFolder = DriveApp.createFolder(folderName);
  }
   
  // iterate over the starred threads found
  for (var i = 0; i < threadLimit; i++) {
    var messages = starredThreads[i].getMessages();
    
    // iterate over messages - sometimes a thread can be mulitiple back and forth emails. 
    for (var j = 0; j < messages.length; j++) {
      var attachments = messages[j].getAttachments();
      
      // iterate over attachments per message - in case a message has several attachments
      for (var k = 0; k < attachments.length; k++) {
        var newAttachment = attachments[k].copyBlob();
        
        // some arbitrary name to help find it easier later
        var filename = messages[j].getSubject() + "_attachment_" + attachmentNumber++ + "_" + newAttachment.getName();
        newAttachment.setName(filename);
        
        var file = DriveApp.createFile(newAttachment);
        attachmentFolder.addFile(file);
      }
    }
  }
}