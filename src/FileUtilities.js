export default class FileUtilities  {
  readData(files, callback) {
    var XLSX = require('xlsx')
    var fr = new FileReader()
    var csvString, data;

    fr.readAsBinaryString(files[0]);

    fr.onload = e => {
        var dataString = fr.result;
        var workbook = XLSX.read(dataString, {
          type: 'binary'
        });
        
        workbook.SheetNames.forEach(function(sheetName){//TODO: Deal with multiple sheets
          csvString = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        })
        data = this.parseData(csvString)
        callback(data);
    }
  }

  parseData(csvString) {
    var numOfRows = 0;
    var numOfColumns = 1;
    var ch, i;
    //Count rows
    for(i = 0; i < csvString.length; i++){
      ch = csvString.charAt(i);
      if (ch === '\n'){
        numOfRows++;
      }
    }
     //Count columns
     ch = '';
     i = 0;
     while (ch !== '\n'){
       ch = csvString.charAt(i);
       if(ch === ','){
         numOfColumns++;
       }
       i++;
     }
     //Create 2D array to hold xlsx data
     this.data = new Array(numOfRows);
     for(i = 0; i < numOfRows; i++){
       this.data[i] = new Array(numOfColumns);
     }
     //Fill array
     for(i = 0; i  < this.data.length; i++){
       var rows = csvString.split("\n");
       this.data[i] = rows[i].split(",");
     }
     return this.data;
   }
}