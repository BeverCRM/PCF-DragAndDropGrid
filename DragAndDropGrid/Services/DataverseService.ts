import { getEntityPluralName, readFileAsync } from '../Utils/Utils';
import { IInputs } from '../generated/ManifestTypes';

// type DataSet = ComponentFramework.PropertyTypes.DataSet;
let _context: ComponentFramework.Context<IInputs>;

export default {

  setContext(context: ComponentFramework.Context<IInputs>) {
    _context = context;
  },

  async getRecordRelatedNotes(item: any) {

    const targetEntityType = _context.parameters.dataset.getTargetEntityType();
    let fetchXml = `<fetch version="1.0" output-format="xml-platform"
mapping="logical" distinct="false">
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
        <condition attribute="${targetEntityType}id" operator="eq" value="${item.id}" />
      </filter>
    </link-entity>
  </entity>
</fetch>`;

    fetchXml = `?fetchXml=${encodeURIComponent(fetchXml)}`;
    const recordRelatedNotes = await _context.webAPI.retrieveMultipleRecords('annotation',
      fetchXml);

    return recordRelatedNotes;
  },

  async uploadFiles(files: any, item: any) {

    const targetEntityType = _context.parameters.dataset?.getTargetEntityType();
    const entityPluralName = getEntityPluralName(targetEntityType);

    Array.from(files).forEach(async (file: any) => {
      if (file.size / 1024 > 5000) {
        _context.navigation.openErrorDialog({ message: 'File size is too big.' });
        return;
      }
      const newFile = new File([file], file.name, { type: file.type });
      let body: any = await readFileAsync(file);

      body = body.toString('base64');

      const note: any = {
        filename: newFile.name,
        subject: '',
        documentbody: body,
        mimetype: file.type,
      };

      note[`objectid_${targetEntityType}@odata.bind`] = `/${entityPluralName}(${item.key})`;

      _context.webAPI.createRecord('annotation', note);
    });
  },

  deleteSelectedNotes(noteIds: string[]): void {
    try {
      noteIds.forEach(id => {
        _context.webAPI.deleteRecord('annotation', id);
      });
    }
    catch (e) {
      console.log(e);
    }
  },

  deleteSelectedRecords(records: any): void {
    const targetEntityType = _context.parameters.dataset.getTargetEntityType();
    try {
      records.forEach((item: any) => {
        _context.webAPI.deleteRecord(targetEntityType, item.key);
      });
    }
    catch (e) {
      console.log(e);
    }
  },

  openRecordCreateForm(): void {
    const targetEntityType = _context.parameters.dataset.getTargetEntityType();
    const entityFormOptions: any = {};
    entityFormOptions['entityName'] = `${targetEntityType}`;
    const formParameters = {};
    _context.navigation.openForm(entityFormOptions, formParameters).then(
      (success: any) => {
        console.log(success);
      },
      (error: any) => {
        console.log(error);
      });

  },

  onCalloutItemInvoked(item: any): void {
    const entityFormOptions: any = {};
    entityFormOptions['entityName'] = 'annotation';
    entityFormOptions['entityId'] = `${item.key}`;

    _context.navigation.openForm(entityFormOptions).then(
      (success: any) => {
        console.log(success);
      },
      (error: any) => {
        console.log(error);
      });
  },
};
