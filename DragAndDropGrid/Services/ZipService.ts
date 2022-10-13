import JSZip = require('jszip');
import saveAs = require('file-saver');

export function downloadSelectedNotes(selectedRecords: any[]) {
  const zip: JSZip = new JSZip();
  selectedRecords.forEach((file: any) => {
    zip.file(file.name, file.documentbody, { base64: true });
  });
  zip.generateAsync({ type: 'blob' })
    .then(content => {
      saveAs(content, 'Files.zip');
    });
}
