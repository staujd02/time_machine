const processXLSXIntoCSV = (xlsxFile: File, onComplete: onCompleteCallback) => {
  var reader = new FileReader();
  reader.readAsBinaryString(xlsxFile);
  reader.onload = () => {
    let result = reader.result;
    var csvSheetStrings = transformXLXSIntoCsvStrings(result as ArrayBuffer);
    onComplete(parseSingleCSV(csvSheetStrings[0]));
  }
}

// TODO: Rename this to process JSON text file
const processPlotsData = (jsonTextFile: File, onComplete: onCompleteCallback) => {
  var reader = new FileReader();
  reader.readAsText(jsonTextFile);
  reader.onload = () => {
    let text = reader.result;
    if (typeof text === "string")
      onComplete(JSON.parse(text));
  }
}

const transformXLXSIntoCsvStrings = (binaryContents: ArrayBuffer) => {
  const XLSX = require('xlsx');
  const binaryType = {
    type: 'binary'
  };
  var csvStrings = new Array<String>();
  var workbook = XLSX.read(binaryContents, binaryType);
  workbook.SheetNames.forEach((name: string) => {
    csvStrings.push(XLSX.utils.sheet_to_csv(workbook.Sheets[name]));
  });

  return csvStrings;
}

// TODO: Separate the concerns of loading in the data, and which data to ignore/process
const parseSingleCSV = (csvString: string) => {
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
  let data = new Array<Array<string>>(numOfRows);
  for (i = 0; i < numOfRows; i++) {
    data[i] = new Array<string>(numOfColumns);
  }
  //Fill array
  for (i = 0; i < data.length; i++) {
    var rows = csvString.split("\n");
    data[i] = rows[i].split(",");
  }
  //Remove multiple label rows, starting at 1 (after first label row)
  for (i = 1; i < data.length; i++) {
    if ((data[i][0] === "t") || (data[i][1] === "-")) {
      data.splice(i, 1);
    }
  }
  return data;
}

type onCompleteCallback = (dataString: string) => string;

export {
  processXLSXIntoCSV,
  processPlotsData 
};