import * as React from 'react';
import { Callout, CommandBar, DefaultButton, DetailsList,
  DetailsListLayoutMode, FocusTrapCallout, FocusZone,
  FocusZoneTabbableElements, FontWeights, IconButton,
  IDetailsListProps, IDetailsRowProps, IDragDropContext,
  IDragDropEvents, IIconProps, initializeIcons, Link, mergeStyles, mergeStyleSets,
  PrimaryButton, SearchBox, Spinner, SpinnerSize, Stack } from '@fluentui/react';
import {
  CommandBarAndSearchBoxStyles,
  CommandBarFarItems,
  CommandBarItems,
  CommandBarOverflowProps,
  CommandBarStyles,
  DetailsListStyles,
  MainDivStyles,
  SearchBoxStyles,
} from './CommandBarConfig';
import { GridFooter } from './Footer';
import { useSelection } from './Selection';
import { cloneElement, useCallback } from 'react';
import { useBoolean, useId } from '@fluentui/react-hooks';
import { arrayBufferToBase64, readFileAsync } from './Utils';

initializeIcons();

type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface IDataSetProps {
  dataset: DataSet;
  context: any;
  onXButtonClick: (e: any) => void, // not implemeted yet
  // notes: any[]
}

async function uploadFile(context: any, files: any, dataset: any, item: any) {
  console.log('In UploadFile function');
  Array.from(files).forEach(async (file: any) => {
    const newFile = new File([file], file.name, { type: file.type });
    let body: any = await readFileAsync(file);
    console.log(context);
    const targetEntityName = context.parameters.dataset?.getTargetEntityType();
    body = arrayBufferToBase64(body);

    console.log(`base64 string = ${body.toString('base64')}`);
    const data: any = {
      filename: newFile.name,
      subject: '',
      documentbody: body,
    };
    data[`objectid_${targetEntityName}@odata.bind`] = `/${targetEntityName}s(${item.key})`; // consider the case where entityName ends with S!
    context.webAPI.createRecord('annotation', data);
    console.log(data);
  });
  // const newFileName: string = overrideFileName(record, file.name);
  
}

function getDragDropEvents(dataset: any, context: any): IDragDropEvents {
  return {
    canDrop: (dropContext?: IDragDropContext, dragContext?: IDragDropContext) => true,
    // canDrag: (item?: any) => true,
    // onDragEnter: (item?: any, event?: DragEvent) =>
    // return string is the css classes that will be added to the entering element.
    // dragEnterClass,
    onDragLeave: (item?: any, event?: DragEvent) => console.log('1'),

    onDrop: (item?: any, event?: DragEvent) => {
      event?.preventDefault();
      console.log(item);
      console.log('OnDrop');
      console.log(event?.dataTransfer?.files);
      const files = event?.dataTransfer?.files;
      uploadFile(context, files, dataset, item);

      // let spinner =
      // console.log(spinner);
      // spinner.style.display = 'flex';
      // (document.getElementById('spinner') as HTMLInputElement).hidden = false; !Spinner
      // set timeout for spinner testing
      // spinner.style.display = 'none';
    },
    onDragStart: (item?: any, itemIndex?: number, selectedItems?: any[], event?: MouseEvent) => {},
    onDragEnd: (item?: any, event?: DragEvent) => {},

  };
}

export function refreshGrid(dataset: any) {
  return dataset.refresh();
}
// .filter(i => { console.log(i); })

function search(newValue: any, dataset: DataSet, items: any, setItems: any) {
  console.log(dataset);
  console.log(dataset.sortedRecordIds);
  console.log('New Value is:');
  console.log(newValue);

  console.log('items');
  console.log(items);

  const myItems = dataset.sortedRecordIds.map(id => {
    const entityId = dataset.records[id];
    const attributes = dataset.columns.map(column => ({ [column.name]:
    entityId.getFormattedValue(column.name) }));
    console.log('attrs');
    // eslint-disable-next-line max-len
    const filtered = dataset.columns.filter(column => { column.name.toLowerCase().indexOf(newValue) > -1; });
    const attributesfiltered = dataset.columns.map(column => ({ [column.name]:
      entityId.getFormattedValue(column.name) }));
    console.log('filtered');
    console.log(attributesfiltered);
    return Object.assign({
      key: entityId.getRecordId(),
      raw: entityId,
    },
    ...attributes);
  });
  setItems(myItems);
}

const calloutStyles = mergeStyleSets({ // export all components styles to a file
  callout: {
    width: 320,
    padding: '20px 24px',
  },
  title: {
    marginBottom: 12,
    fontWeight: FontWeights.semilight,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});

async function getRecordRelatedNotes(context: any, item: any, targetEntityType: any) {

  let fetchXml = `<fetch version="1.0" output-format="xml-platform"
       mapping="logical" distinct="false">
  <entity name="annotation">
    <attribute name="subject" />
    <attribute name="notetext" />
    <attribute name="filename" />
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
  const recordRelatedNotes = await context.webAPI.retrieveMultipleRecords('annotation', fetchXml);
  return recordRelatedNotes;
}

async function getAllRelatedNotes(context: any, item: any, targetEntityType: any){

}

function deleteNotes(context: any, noteIds: any[]) {
  try {
    noteIds.forEach(id => {
      context.webAPI.deleteRecord('annotation', id);
    });
  }
  catch (e) {
    console.log(e); // opening Error modal dialog?
  }
}


// eslint-disable-next-line react/display-name
export const DataSetGrid = React.memo(({
  dataset,
  context,
  onXButtonClick }: IDataSetProps) : JSX.Element => {
  const [items, setItems] = React.useState<any>([]);
  const [columns, setColumns] = React.useState<any>([]);
  const dragDropEvents = getDragDropEvents(dataset, context);

  const { selection, selectedCount, onItemInvoked } = useSelection(dataset);

  console.log('Dataset Items');
  console.log(items);
  console.log('ok');

  const deleteButtonStyles = mergeStyles({

    backgroundColor: 'transparent',
  });
  const deleteIcon: IIconProps = { iconName: 'Settings' };
  const deleteButtonId = useId('delete-button');

  const notesColumn = [
    {
      name: '',
      fieldName: 'Delete',
      key: 'Delete',
      minWidth: 50,
      maxWidth: 50,
      isResizable: false,
      onClick: (item: any) => { console.log('The item is:'); console.log(item); },
      onRender: (item: any) => {
        const [noteItems, setNoteItems] = React.useState<any>([]);

        const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
        console.log('Item On Render');
        console.log(items);
        console.log('item');
        console.log(item);
        const namedReference = dataset.records[item.key].getNamedReference();
        const targetEntityType = context.parameters.dataset.getTargetEntityType();

        const retrieveNotes = React.useEffect(() => {
          getRecordRelatedNotes(context, namedReference,
            targetEntityType).then(data => {
            console.log('data entities');
            console.log('not ok');
            // console.log(data.entities);
            const finalNotes = data.entities.map((entity: any) => ({
              name: entity.filename,
              fieldName: entity.filename !== null ? entity.filename : entity.subject,
              key: entity.annotationid,
            }));
            if (finalNotes.length !== 0) {
              setNoteItems(finalNotes);
            }
          });
        }, []);
        const onCalloutItemInvoked = (item: any): void => {
          alert(`Item invoked: ${JSON.stringify(item)}`);
        };

        const onCalloutRenderRow = useCallback((row, defaultRender) =>
          cloneElement(defaultRender(row), { onClick: () => console.log(item) }),
        [ onCalloutItemInvoked ]);

        const _onActiveItemChanged = (item: any): void => {
          console.log(`Item invoked: ${JSON.stringify(item)}`);
        };
        const { selection, selectedCount,
          onItemInvoked } = useSelection(dataset);

        // console.log('Selection');
        // console.log(selection);
        
        return <>
          <IconButton
            id={deleteButtonId}
            className={deleteButtonStyles}
            onClick={() => {
              toggleIsCalloutVisible();
              onXButtonClick(item);
            }}
            iconProps={deleteIcon}
            title="Delete"
            ariaLabel="Delete"
          />
          {isCalloutVisible ? (
            <Callout


              role="alertdialog"
              className={calloutStyles.callout}
              gapSpace={0}
              // onClick={() => {
              //   console.log('RELATED IN ONCLICK'); // SEPERATE ALL THIS IN ONCLICK INTO FUNCTIONS
              //   console.log(item);
              // }}
              target={`#${deleteButtonId}`}
              onDismiss={toggleIsCalloutVisible}

            >
              <div className={calloutStyles.title}>
                Related Notes
              </div>
              <div>
                Here should be the list of related Notes, with the feature to delete them.
                {noteItems.length}

                <DetailsList
                  items={noteItems}
                  selection={selection}
                  // onRenderRow = {onCalloutRenderRow}
                  // onActiveItemChanged = {_onActiveItemChanged}
                >
                </DetailsList>

              </div>
              <FocusZone handleTabKey={FocusZoneTabbableElements.all} isCircularNavigation>
                <Stack className={calloutStyles.buttons} gap={8} horizontal>
                  <PrimaryButton
                    onClick={ev => {
                      console.log(' get selection');
                      const [, forceUpdate] = React.useReducer(x => x + 1, 0);
                      const noteIds = selection.getSelection().map((item : any) => item.key);
                      console.log('Note ITEMS BEFORE DELETE');
                      console.log(noteItems);
                      deleteNotes(context, noteIds);
                      // { retrieveNotes; }
                      // onXButtonClick(ev);
                      // forceUpdate();
                      console.log('Note ITEMS AFTER DELETE');
                      console.log(noteItems);
                      console.log('Successfully deleted');
                    }}>Delete</PrimaryButton>
                  <DefaultButton onClick={toggleIsCalloutVisible}>Cancel</DefaultButton>
                </Stack>
              </FocusZone>
            </Callout>
          ) : null}
        </>;
      },
    },
  ];

  React.useEffect(() => {
    const mainColumns = [dataset.columns.sort((column1, column2) =>
      column1.order - column2.order).map(column => ({
      name: column.displayName,
      fieldName: column.name,
      minWidth: column.visualSizeFactor,
      key: column.name,
    }))];

    const merge = (acc: any, [ k, v ]: any) => {
      if (k in acc) {
        acc[k] = [acc[k]].flat().concat(v);
      }
      else {
        acc[k] = v;
      }
      return acc;
    };

    const merged = Object.entries(notesColumn).reduce(merge, mainColumns);
    setColumns(merged[0]);

    const myItems = dataset.sortedRecordIds.map(id => {
      const entityId = dataset.records[id];
      const attributes = dataset.columns.map(column => ({ [column.name]:
        entityId.getFormattedValue(column.name) }));
      return Object.assign({
        key: entityId.getRecordId(), // key OR id in entire file???
        raw: entityId,
      }, ...attributes);
    });
    // console.log('myitems before set');
    setItems(myItems);
  }, [dataset]);

  return (
    <>
      <div style={{ width: '100%' }}>
        <div className={MainDivStyles}>
          <div className={CommandBarAndSearchBoxStyles}>
            <div className={SearchBoxStyles}>
              <SearchBox placeholder='Search...'
                // onSearch={newValue => search(newValue, dataset, items, setItems)}
                // onChange= {(_, newValue) => search(newValue, dataset, items, setItems)}
              ></SearchBox>
            </div>
            <div className={CommandBarStyles}>
              <CommandBar
                overflowButtonProps={CommandBarOverflowProps}
                items={CommandBarItems}
                farItems={CommandBarFarItems}
              />
            </div>
          </div>
        </div>
        <div>
          <DetailsList
          // edit detailslist header (remove padding-top)
            items = {items}
            columns = {columns}
            dragDropEvents = {dragDropEvents}
            onItemInvoked = {onItemInvoked}
            selection={selection}
            layoutMode={DetailsListLayoutMode.justified}
          >
          </DetailsList>
          <GridFooter dataset={dataset} selectedCount={selectedCount}></GridFooter>
        </div>
      </div>
    </>);
});
