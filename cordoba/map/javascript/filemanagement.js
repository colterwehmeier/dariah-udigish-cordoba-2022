function reformatFileLink(fileName, id) {
  return 'typeform/Cordoba-2022-es/d2y5NYMY/' + id + '/' + fileName;
}
// function to check if a value is a file link and return the file name
function checkForFileLink(link) {
  if (typeof link === "string" && link.includes("https://api.typeform.com/responses/files")) {
    var linkArr = link.split("/");
    var filename = linkArr[linkArr.length - 1];
    //console.log(filename)
    return filename;
  }
  return null;
}

// function createMediaHTML(filePath) {
//   return fetch(filePath)
//       .then(response => response.blob())
//       .then(blob => {
//           var fileHTML = "";
//           //log blob.type
//           // console.log(blob.type);
//           switch (blob.type) {
//               //AUDIO
//               case "audio/mp3":
//               case "audio/wav":
//               case "audio/m4a":
//               case "audio/ogg":
//               case "audio/aac":
//               case "audio/mp4":
//               case "audio/mpeg":
//               case "audio/x-wav":
//                   fileHTML = '<audio controls><source src="' + filePath + '" type="' + blob.type + '"><a href='+filePath+'>Download</a></audio>';
//                   break;
//               //VIDEO
//               case "video/quicktime":
//                 fileHTML = '<video width="320" height="240" controls><source src="' + filePath + '" type=video/mp4"' + '"><a href='+filePath+'>Download</a></video>';
//                 break;
//               case "video/mp4":
//               case "video/avi":
//               case "video/m4a":
//               case "video/mpeg":
//                   fileHTML = '<video width="320" height="240" controls><source src="' + filePath + '" type="' + blob.type + '"><a href='+filePath+'>Download</a></video>';
//                 break;
//               //IMAGE
//                 case "image/jpeg":
//               case "image/png":
//                 case "image/heic":
//                   fileHTML = '<a href="' + filePath + '" target="_blank"><img src="' + filePath + '" alt="image"></a>';
//                   break;
//               default:
//                   fileHTML = '<p>' + filePath + '</p>';
//           }
//           return fileHTML;
//       });
// }

function createMediaHTML(filePath) {
  
  const extension = filePath.match(/\.([^.]+)$/)?.[1]?.toLowerCase();
  // console.log(extension);
  var fileHTML = "";
  switch (extension) {
    //AUDIO
    case "mp3":
    case "wav":
    case "ogg":
    case "aac":
      var mimetype = "audio/" + extension;
      fileHTML = '<audio controls><source src="' + filePath + '" type="' + mimetype + '"><a href=' + filePath + '>Download</a></audio>';
      break;
    case "m4a":
      var mimetype = "audio/mp4";
      fileHTML = '<audio controls><source src="' + filePath + '" type="' + mimetype + '"><a href=' + filePath + '>Download</a></audio>';
      break;
    //VIDEO
    case "mov":
      var mimetype = "video/quicktime";
      fileHTML = '<video width="320" height="320" controls><source src="' + filePath + '" type="' + mimetype + '"><a href=' + filePath + '>Download</a></video>';
      break;
    case "mp4":
    case "avi":
    case "m4a":
    case "mpeg":
      var mimetype = "video/" + extension;
      fileHTML = '<video width="320" height="320" controls><source src="' + filePath + '" type="' + mimetype + '"><a href=' + filePath + '>Download</a></video>';
      break;
    //IMAGE
    case "jpeg":
    case "jpg":
    case "png":
    case "heic":
      var mimetype = "image/" + extension;
      fileHTML = '<a href="' + filePath + '" target="_blank"><img src="' + filePath + '" alt="image"></a>';
      break;
    default:
      fileHTML = '<p>' + filePath + '</p>';
  }
  
  
  return fileHTML;
}