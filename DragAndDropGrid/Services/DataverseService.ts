import { arrayBufferToBase64, readFileAsync } from '../Utils/Utils';
import { IInputs } from '../generated/ManifestTypes';

let _context: ComponentFramework.Context<IInputs>;

export default {
  setContext(context: ComponentFramework.Context<IInputs>) {
    _context = context;
  },

  async getRecordRelatedNotes(targetEntityId: string) {
    const targetEntityType: string = _context.parameters.dataset.getTargetEntityType();
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
        <link-entity name="${targetEntityType}" from="${targetEntityType}id"
        to="objectid" link-type="inner" alias="ac">
          <filter type="and">
            <condition attribute="${targetEntityType}id" operator="eq" value="${targetEntityId}" />
          </filter>
        </link-entity>
      </entity>
    </fetch>`;

    fetchXml = `?fetchXml=${encodeURIComponent(fetchXml)}`;
    const recordRelatedNotes = await _context.webAPI.retrieveMultipleRecords('annotation',
      fetchXml);

    return recordRelatedNotes;
  },

  async uploadFiles(files: FileList | undefined, targetEntityId: string): Promise<void> {
    const targetEntityType: string = _context.parameters.dataset?.getTargetEntityType();
    const entityMetadata = await _context.utils.getEntityMetadata(targetEntityType);

    if (files !== undefined) {
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        const newFile = new File([file], file.name, { type: file.type });
        const buffer: ArrayBuffer = await readFileAsync(file);
        const body: string = arrayBufferToBase64(buffer);

        const note: any = {
          filename: newFile.name,
          subject: '',
          documentbody: body,
          mimetype: file.type,
        };

        note[`objectid_${targetEntityType}@odata.bind`] =
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
    const targetEntityType: string = _context.parameters.dataset.getTargetEntityType();
    const entityFormOptions = {
      entityName: targetEntityType,
    };
    _context.navigation.openForm(entityFormOptions).then(
      (success: any) => {
        console.log(success);
      },
      (error: any) => {
        console.log(error);
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
