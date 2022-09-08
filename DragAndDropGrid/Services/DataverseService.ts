import { arrayBufferToBase64, readFileAsync } from '../Utils/Utils';
import { IInputs } from '../generated/ManifestTypes';
import JSZip = require('jszip');
import saveAs = require('file-saver');

export let _context: ComponentFramework.Context<IInputs>;
export let _targetEntityType: string;

export default {
  setContext(context: ComponentFramework.Context<IInputs>, targetEntityType: string) {
    _context = context;
    _targetEntityType = targetEntityType;
  },

  async getRecordRelatedNotes(targetEntityId: string) {
    let fetchXml: string = `
    <fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="false">
      <entity name="annotation">
        <attribute name="subject" />
        <attribute name="notetext" />
        <attribute name="filename" />
        <attribute name="documentbody" />
        <attribute name="mimetype" />
        <attribute name="annotationid" />
        <order attribute="subject" descending="false" />
        <link-entity name="${_targetEntityType}" from="${_targetEntityType}id"
        to="objectid" link-type="inner" alias="ac">
          <filter type="and">
            <condition attribute="${_targetEntityType}id" operator="eq" value="${targetEntityId}" />
          </filter>
        </link-entity>
      </entity>
    </fetch>`;

    fetchXml = `?fetchXml=${encodeURIComponent(fetchXml)}`;
    const recordRelatedNotes = await _context.webAPI.retrieveMultipleRecords('annotation',
      fetchXml);

    return recordRelatedNotes;
  },
  async getTargetEntityDisplayName() {
    const entityMetadata = await _context.utils.getEntityMetadata(_targetEntityType);
    const targetEntityDisplayName = entityMetadata._displayName;
    return targetEntityDisplayName;
  },

  async uploadFiles(files: FileList | undefined, targetEntityId: string): Promise<void> {
    const entityMetadata = await _context.utils.getEntityMetadata(_targetEntityType);
    if (files !== undefined) {
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        const buffer: ArrayBuffer = await readFileAsync(file);
        const body: string = arrayBufferToBase64(buffer);

        const note: any = {
          filename: file.name,
          subject: '',
          documentbody: body,
          mimetype: file.type,
        };

        note[`objectid_${_targetEntityType}@odata.bind`] =
        `/${entityMetadata._entitySetName}(${targetEntityId})`;
        _context.webAPI.createRecord('annotation', note);
      }
    }
  },

  async deleteSelectedNotes(noteIds: string[]): Promise<void> {
    try {
      for (const id of noteIds) {
        await _context.webAPI.deleteRecord('annotation', id);
      }
    }
    catch (e) {
      console.log(e);
    }
  },

  downloadSelectedNotes(selectedRecords: any[]) {
    const zip: JSZip = new JSZip();
    selectedRecords.forEach((file: any) => {
      zip.file(file.name, file.documentbody, { base64: true });
    });
    zip.generateAsync({ type: 'blob' })
      .then(content => {
        saveAs(content, 'Files.zip');
      });
  },

  deleteSelectedRecords(recordIds: string[]): void {
    const targetEntityType: string = _context.parameters.dataset.getTargetEntityType();
    try {
      for (const id of recordIds) {
        _context.webAPI.deleteRecord(targetEntityType, id);
      }
    }
    catch (e) {
      console.log(e);
    }
  },

  openRecordCreateForm(): void {
    const entityFormOptions = {
      entityName: _targetEntityType,
    };
    _context.navigation.openForm(entityFormOptions).then(
      (success: any) => {
        console.log(success);
      },
      (error: any) => {
        console.log(error);
      });
  },

  async openRecordDeleteDialog(selectedRecordIds: string[]): Promise<void> {
    const entityMetadata = await _context.utils.getEntityMetadata(_targetEntityType);

    const confirmStrings = { text: `Do you want to delete this ${entityMetadata._displayName}?
     You can't undo this action.`, title: 'Confirm Deletion' };
    const confirmOptions = { height: 200, width: 450 };
    _context.navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
      success => {
        if (success.confirmed) {
          this.deleteSelectedRecords(selectedRecordIds);
          console.log('Dialog closed using OK button.');
        }
        else {
          console.log('Dialog closed using Cancel button or X.');
        }
      });

  },

  async openNoteDeleteDialog(noteIds: string[]): Promise<void> {
    const confirmStrings = { text: `Do you want to delete this Note?
     You can't undo this action.`, title: 'Confirm Deletion' };
    const confirmOptions = { height: 200, width: 450 };
    return _context.navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
      async success => {
        if (success.confirmed) {
          await this.deleteSelectedNotes(noteIds);
          console.log('Dialog closed using OK button.');
        }
        else {
          console.log('Dialog closed using Cancel button or X.');
        }
      });
  },

  onCalloutItemInvoked(item: any): void {
    const entityFormOptions = {
      entityName: 'annotation',
      entityId: item.key,
    };

    _context.navigation.openForm(entityFormOptions).then(
      (success: any) => {
        console.log(success);
      },
      (error: any) => {
        console.log(error);
      });
  },
};
