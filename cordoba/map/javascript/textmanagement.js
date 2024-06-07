function timeStampToDate(timestamp) {
    var date = new Date(timestamp);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    
    //am or pm
    //var ampm = hours >= 12 ? 'pm' : 'am';
    
    return day + '/' + month + '/' + year + ' - ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);// + ' ' + ampm;
}
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
// convert the timestamp from server time (CST) to eastern european time (CET)
function convertToCET(timestamp) {
  var date = new Date(timestamp);
  console.log(date);
  var offset = date.getTimezoneOffset();
  
  // Convert the timestamp to UTC by subtracting the offset
  var timestampUTC = date.getTime() + offset * 60000;
  
  // Add 6 hours (360 minutes) to the timestamp in UTC to convert to CET
  var timestampCET = timestampUTC + 6 * 60 * 60 * 1000;
  
  // Create a new Date object for the timestamp in CET
  var dateCET = new Date(timestampCET);
  
  return dateCET;
}

function RemoveHyphensAndTitleCase(tag){
  //posada-del-potro
  //remove the hyphens and title case besides del
  //Posada del Potro
      var tagArray = tag.split("-");
      var tagArrayLength = tagArray.length;
      var tagArrayNew = [];
      for (var i = 0; i < tagArrayLength; i++) {
          if (tagArray[i] === "del") {
              tagArrayNew.push(tagArray[i]);
          } else {
              tagArrayNew.push(toTitleCase(tagArray[i]));
          }
      }
      return tagArrayNew.join(" ");
  }