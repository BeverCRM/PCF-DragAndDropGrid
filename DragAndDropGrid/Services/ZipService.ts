import JSZip = require('jszip');
import saveAs = require('file-saver');
import DataverseService from './DataverseService';

export async function downloadSelectedNotes(selectedRecords: any[]): Promise<void> {
  const zip: JSZip = new JSZip();
  const dublicateFilesCount: {[key: string]: number} = {};

  selectedRecords.forEach((file: any) => {
    const namee = file.name;
    dublicateFilesCount[`${namee}`] =
     (dublicateFilesCount[`${namee}`] || 0) + 1;
  });

  const keys: string[] = Object.keys(dublicateFilesCount);
  const values: number[] = Object.values(dublicateFilesCount);
  const numberedFileNames: string[] = [];

  for (let i = 0; i < keys.length; i++) {
    const splitFileName: any = keys[i].split('.');
    const fileMimtype = splitFileName[splitFileName.length - 1];
    const fileName = keys[i].split(`.${fileMimtype}`)[0];

    if (values[i] !== 1) {
      for (let j = 0; j < values[i]; j++) {
        j !== 0 ? numberedFileNames.push(`${fileName} (${j}).${fileMimtype}`)
          : numberedFileNames.push(`${fileName}.${fileMimtype}`);
      }
    }
    else {
      numberedFileNames.push(`${fileName}.${fileMimtype}`);
    }
  }

  for (let i = 0; i < numberedFileNames.length; i++) {
    zip.file(numberedFileNames[i], selectedRecords[i].documentbody, { base64: true });
  }

  zip.generateAsync({ type: 'blob' })
    .then(content => {
      saveAs(content, 'Files.zip');
    });
}

export async function downloadSelectedRecords(selectedRecordIds: string[]) {
  const SelectedRecords = [];
  for (const selectedRecordId of selectedRecordIds) {
    const finalNotes = await DataverseService.getRecordRelatedNotes(selectedRecordId, true);
    for (const record of finalNotes) SelectedRecords.push(record);
  }
  downloadSelectedNotes(SelectedRecords);
}
