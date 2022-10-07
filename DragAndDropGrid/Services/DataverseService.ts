import { arrayBufferToBase64, readFileAsync } from '../Utils/Utils';
import { IInputs } from '../generated/ManifestTypes';

let _context: ComponentFramework.Context<IInputs>;
let _targetEntityType: string;

const notificationOptions = {
  errorsCount: 0,
  importedSucsessCount: 0,
  filesCount: 0,
  details: '',
  message: '',
};

export default {
  setContext(context: ComponentFramework.Context<IInputs>) {
    _context = context;
    _targetEntityType = _context.parameters.dataset.getTargetEntityType();
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
    return entityMetadata._displayName;
  },

  async getEntitySetName(entityTypeName: string) {
    const entityMetadata = await _context.utils.getEntityMetadata(entityTypeName);
    return entityMetadata.EntitySetName;
  },

  async uploadFile(file: File, filesCount:number, targetEntityId: any): Promise<void> {
    try {
      notificationOptions.filesCount = filesCount;
      const buffer: ArrayBuffer = await readFileAsync(file);
      const body: string = arrayBufferToBase64(buffer);

      const data: any = {
        filename: file.name,
        subject: '',
        documentbody: body,
        mimetype: file.type,
      };

      const entityMetadata = await _context.utils.getEntityMetadata(_targetEntityType);
      data[`objectid_${_targetEntityType}@odata.bind`] =
      `/${entityMetadata._entitySetName}(${targetEntityId})`;

      await _context.webAPI.createRecord('annotation', data);
      notificationOptions.importedSucsessCount += 1;
    }
    catch (ex: any) {
      console.error(ex.message);
      notificationOptions.details += `File Name ${file.name} Error message ${ex.message}`;
      notificationOptions.errorsCount += 1;
    }
  },

  showNotificationPopup() {
    if (notificationOptions.errorsCount === 0) {
      const message = notificationOptions.importedSucsessCount > 1
        ? `${notificationOptions.importedSucsessCount} 
        of ${notificationOptions.filesCount} files imported successfully`
        : `${notificationOptions.importedSucsessCount} 
        of ${notificationOptions.filesCount} file imported successfully`;

      _context.navigation.openAlertDialog({ text: message });
      notificationOptions.importedSucsessCount = 0;
    }
    else {
      notificationOptions.message = notificationOptions.errorsCount > 1
        ? `${notificationOptions.errorsCount} 
        of ${notificationOptions.filesCount} files errored during import`
        : `${notificationOptions.errorsCount} 
        of ${notificationOptions.filesCount} file errored during import`;

      _context.navigation.openErrorDialog(notificationOptions);
      notificationOptions.errorsCount = 0, notificationOptions.importedSucsessCount = 0;
      notificationOptions.details = '';
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
    try {
      for (const id of recordIds) {
        _context.webAPI.deleteRecord(_targetEntityType, id);
      }
    }
    catch (e) {
      console.log(e);
    }
  },

  async getFieldSchemaName(entityName: string): Promise<string> {
    // @ts-ignore
    const contextPage = _context.page;

    const response = await fetch(`${contextPage.getClientUrl()}/api/data/v8.2/EntityDefinitions` +
    `(LogicalName='${contextPage.entityTypeName}')/OneToManyRelationships?$filter=` +
     `ReferencingEntity eq '${entityName}'&$select=ReferencingAttribute`);

    const data = await response.json();
    return data.value[0].ReferencingAttribute;
  },

  async openRecordCreateForm(): Promise<void> {
    const { contextInfo }: any = _context.mode;
    const entityFormOptions: {entityName: string} = {
      entityName: _targetEntityType,
    };

    const lookup: {id: string, name: string, entityType: string} = {
      id: contextInfo.entityId,
      name: contextInfo.entityRecordName,
      entityType: contextInfo.entityTypeName,
    };

    const lookupFieldName: string = await this.getFieldSchemaName(entityFormOptions.entityName);

    const formParameters: any = {
      [lookupFieldName]: lookup,
    };

    _context.navigation.openForm(entityFormOptions, formParameters).then(
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
