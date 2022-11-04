import * as JSZip from 'jszip';
import * as saveAs from 'file-saver';
import DataverseService from './DataverseService';

export default {
  duplicateFileNames(selectedRecords: any[]) {
    const duplicateFilesCount: {[key: string]: number} = {};

    selectedRecords.forEach((file: any) => {
      const fileName = file.name;
      duplicateFilesCount[`${fileName}`] =
       (duplicateFilesCount[`${fileName}`] || 0) + 1;
    });

    const keys: string[] = Object.keys(duplicateFilesCount);
    const values: number[] = Object.values(duplicateFilesCount);
    const numberedFileNames: string[] = [];

    for (let i = 0; i < keys.length; i++) {
      const splitFileName = keys[i].split('.');
      const fileMimtype = splitFileName[splitFileName.length - 1];
      const fileName = keys[i].split(`.${fileMimtype}`)[0];

      if (values[i] !== 1) {
        for (let sameValueIndex = 0; sameValueIndex < values[i]; sameValueIndex++) {
          if (sameValueIndex === 0) {
            numberedFileNames.push(`${fileName}.${fileMimtype}`);
          }
          else {
            numberedFileNames.push(`${fileName} (${sameValueIndex}).${fileMimtype}`);
          }
        }
      }
      else {
        numberedFileNames.push(`${fileName}.${fileMimtype}`);
      }
    }
    return numberedFileNames;
  },

  async  downloadSelectedNotes(selectedRecords: any[]): Promise<void> {
    const zip: JSZip = new JSZip();
    const numberedFileNames = this.duplicateFileNames(selectedRecords);

    for (let i = 0; i < numberedFileNames.length; i++) {
      zip.file(numberedFileNames[i], selectedRecords[i].documentbody, { base64: true });
    }

    zip.generateAsync({ type: 'blob' })
      .then(content => {
        saveAs(content, 'Files.zip');
      });
  },

  async downloadSelectedRecords(selectedRecordIds: string[]) {
    const selectedRecords = [];
    for (const selectedRecordId of selectedRecordIds) {
      const notes = await DataverseService.getRecordRelatedNotes(selectedRecordId, true);
      for (const note of notes) {
        selectedRecords.push(note);
      }
    }
    this.downloadSelectedNotes(selectedRecords);
  },
};
