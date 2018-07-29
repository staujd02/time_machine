export default class FileUtilities {

  processXLSXIntoCSV(xlsxFile, onComplete) {
    var reader = new FileReader();
    reader.readAsBinaryString(xlsxFile);
    reader.onload = () => {
      var csvSheetStrings = this.transformXLXSIntoCsvStrings(reader.result);
      onComplete(this.parseSingleCSV(csvSheetStrings[0]));
    }
  }

  transformXLXSIntoCsvStrings(binaryContents) {
    const XLSX = require('xlsx')
    const binaryType = {
      type: 'binary'
    };
    var csvStrings = [];
    var workbook = XLSX.read(binaryContents, binaryType);
    workbook.SheetNames.forEach(name => {
      csvStrings.push(XLSX.utils.sheet_to_csv(workbook.Sheets[name]));
    });

    return csvStrings;
  }

  parseSingleCSV(csvString) {
    var numOfRows = 0;
    var numOfColumns = 1;
    var ch, i;
    //Count rows
    for (i = 0; i < csvString.length; i++) {
      ch = csvString.charAt(i);
      if (ch === '\n') {
        numOfRows++
      }
    }
    //Count columns
    ch = '';
    i = 0;
    while (ch !== '\n') {
      ch = csvString.charAt(i);
      if (ch === ',') {
        numOfColumns++;
      }
      i++;
    }
    //Create 2D array to hold xlsx data
    this.data = new Array(numOfRows);
    for (i = 0; i < numOfRows; i++) {
      this.data[i] = new Array(numOfColumns);
    }
    //Fill array
    for (i = 0; i < this.data.length; i++) {
      var rows = csvString.split("\n");
      this.data[i] = rows[i].split(",");
    }
    return this.data;
  }
}