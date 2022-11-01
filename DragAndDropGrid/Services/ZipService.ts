import JSZip = require('jszip');
import saveAs = require('file-saver');
import DataverseService from './DataverseService';

export async function downloadSelectedNotes(selectedRecords: any[]): Promise<void> {
  const zip: JSZip = new JSZip();
  const dublicateFilesCount: {[key: string]: number} = {};
  const dublicateMimtypes: {[key: string]: number} = {};

  selectedRecords.forEach((file: any) => {
    const mimeType: string = file.mimetype.split('/')[1];
    const fileName: string = file.name.split(`.${mimeType}`)[0];
    dublicateFilesCount[fileName] = (dublicateFilesCount[fileName] || 0) + 1;
    dublicateMimtypes[mimeType] = (dublicateMimtypes[mimeType] || 0) + 1;
  });

  const keys: string[] = Object.keys(dublicateFilesCount);
  const values: number[] = Object.values(dublicateFilesCount);
  const keysMimtype = Object.keys(dublicateMimtypes);
  const numberedFileNames: string[] = [];

  for (let i = 0; i < keys.length; i++) {
    if (values[i] !== 1) {
      for (let j = 0; j < values[i]; j++) {
        j !== 0 ? numberedFileNames.push(`${keys[i]} (${j}).${keysMimtype[i]}`)
          : numberedFileNames.push(`${keys[i]}.${keysMimtype[i]}`);
      }
    }
    else {
      numberedFileNames.push(`${keys[i]}.${keysMimtype[i]}`);
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
