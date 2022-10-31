import JSZip = require('jszip');
import saveAs = require('file-saver');
import DataverseService from './DataverseService';

export async function downloadSelectedNotes(selectedRecords: any[]): Promise<void> {
  const zip: JSZip = new JSZip();
  const dublicateFilesCount: {[key: string]: number} = {};

  selectedRecords.forEach((file: any) => {
    const mimeType: string = file.mimetype.split('/')[1];
    const fileName: string = file.name.split(`.${mimeType}`)[0];
    dublicateFilesCount[fileName] = (dublicateFilesCount[fileName] || 0) + 1;
  });

  const keys: string[] = Object.keys(dublicateFilesCount);
  const values: number[] = Object.values(dublicateFilesCount);
  const numberedFileNames: string[] = [];

  for (let i = 0; i < selectedRecords.length; i++) {
    const mimeType = selectedRecords[i].mimetype.split('/')[1];
    if (values[i] !== 1) {
      for (let j = 0; j < values[i]; j++) {
        j !== 0 ? numberedFileNames.push(`${keys[i]}(${j}).${mimeType}`)
          : numberedFileNames.push(`${keys[i]}.${mimeType}`);
      }
    }
    else {
      numberedFileNames.push(`${keys[i]}.${mimeType}`);
    }
    zip.file(numberedFileNames[i], selectedRecords[i].documentbody, { base64: true });
  }
  zip.generateAsync({ type: 'blob' })
    .then(content => {
      saveAs(content, 'Files.zip');
    });
}

export async function downloadSelectedRecords(selectedRecordIds: string[]) {
  const allRecords = [];
  for (const selectedRecordId of selectedRecordIds) {
    const finalNotes = await DataverseService.getRecordRelatedNotes(selectedRecordId);
    for (const record of finalNotes) allRecords.push(record);
  }
  downloadSelectedNotes(allRecords);
}
