import React from 'react';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FileUtilities from '../lib/utilities/FileUtilities';

const FileInput = ({ title, accept, isPlot, onDone }: FileInputProps) => {

  const DEFAULT_FILE_NAME = "Upload file";
  const renderedTitle = title || DEFAULT_FILE_NAME;

  const thereIsAtLeastOneFile = (files: FileArray) => files.length > 0;

  const processUpload = (files: FileArray) => {
    if (thereIsAtLeastOneFile(files))
      processFileInput(files);
  }

  const processFileInput = (files: FileArray) => {
    let fileUtil = new FileUtilities();
    isPlot
      ? fileUtil.processPlotsData(files[0], onDone)
      : fileUtil.processXLSXIntoCSV(files[0], onDone);
  }

  return (
    <FormGroup>
      <ControlLabel htmlFor={renderedTitle} style={{ cursor: "pointer" }}>
        {renderedTitle}
        <FormControl id={renderedTitle}
          type="file"
          accept={accept}
          onChange={e => processUpload((e.target as any).files)}
          style={{ display: "none" }} />
      </ControlLabel>
    </FormGroup>
  );
}

type FileArray = Array<File>;
type FileInputProps = {
  title: string;
  accept: string;
  isPlot: boolean;
  onDone: (dataString: string) => void
}

export default FileInput;
