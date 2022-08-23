import * as React from 'react';
import { Callout, CommandBarButton, DefaultButton, DetailsList,
  DetailsListLayoutMode, FocusZone,
  FocusZoneTabbableElements, IconButton,
  IContextualMenuProps,
  IDragDropEvents, PrimaryButton, Stack } from '@fluentui/react';
import { GridFooter } from './Footer';
import { useSelection } from './Selection';
import { useBoolean } from '@fluentui/react-hooks';
import { addIcon, calloutStyles, dataSetStyles, deleteIcon,
  downloadIcon, refreshIcon, settingsButtonStyles,
  settingsIcon, stackStyles } from '../Styles/styles';
import DataverseService from '../Services/DataverseService';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface IDataSetProps {
  dataset: DataSet;
}

function getDragDropEvents(): IDragDropEvents {
  return {
    canDrop: () => true,
    onDrop: (item?: any, event?: DragEvent) => {
      event?.preventDefault();
      const files = event?.dataTransfer?.files;
      DataverseService.uploadFiles(files, item);
    },
  };
}

function downloadSelectedNotes(selectedRecords: any) {
  const zip = new JSZip();
  selectedRecords.forEach((file: any) => {
    zip.file(file.name, file.documentbody, { base64: true });
  });

  zip.generateAsync({ type: 'blob' })
    .then(content => {
      saveAs(content, 'Files.zip');
    });
}

export function refreshGrid(dataset: DataSet) {
  return dataset.refresh();
}

const DataSetGrid = ({ dataset }: IDataSetProps) : JSX.Element => {
  const [items, setItems] = React.useState<any>([]);
  const [columns, setColumns] = React.useState<any>([]);
  const dragDropEvents = getDragDropEvents();
  const { selection, selectedCount, selectedItems, onItemInvoked } = useSelection(dataset);

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'inventoryProduct',
        text: 'Inventory Product',
        iconProps: { iconName: 'Product' },
        onClick: () => { DataverseService.openRecordCreateForm(); },
      },
    ],
  };

  const notesColumn = [
    {
      name: '',
      fieldName: 'Delete',
      key: 'Delete',
      minWidth: 50,
      maxWidth: 50,
      isResizable: true,
      onRender: (item: any) => {
        const [noteItems, setNoteItems] = React.useState<any>([]);
        const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);
        const { selection, selectedItems, selectedRecordIds } = useSelection(dataset);
        const namedReference = dataset.records[item.key].getNamedReference();
        const uniqueButtonId = item.key;

        React.useEffect(() => {
          if (isCalloutVisible) {
            DataverseService.getRecordRelatedNotes(namedReference).then(data => {
              const finalNotes = data.entities.filter((entity: any) =>
                entity.filename !== undefined).map((entity: any) =>
                ({
                  name: entity.filename,
                  fieldName: entity.filename,
                  key: entity.annotationid,
                  mimetype: entity.mimetype,
                  documentbody: entity.documentbody,
                }),
              );
              if (finalNotes.length !== 0) {
                setNoteItems(finalNotes);
              }
            });
          }
        }, [isCalloutVisible]);

        return <>
          <IconButton
            id={uniqueButtonId}
            className={settingsButtonStyles}
            onClick={() => {
              toggleIsCalloutVisible();
            }}
            iconProps={settingsIcon}
            title="Settings"
            ariaLabel="Settings"
          />
          {isCalloutVisible
            ? <Callout
              setInitialFocus={true}
              role="alertdialog"
              className={calloutStyles.callout}
              gapSpace={0}
              onClick={() => { }}
              target={`[id='${uniqueButtonId}']`}
              onDismiss={toggleIsCalloutVisible}
            >
              <div className={calloutStyles.title}>
                Related Notes
              </div>
              {noteItems.length !== 0 ? <div><DetailsList
                onItemInvoked = {DataverseService.onCalloutItemInvoked}
                className={calloutStyles.detailsListContent}
                items={noteItems}
                selection={selection}
              >
              </DetailsList>
              <FocusZone handleTabKey={FocusZoneTabbableElements.all} isCircularNavigation>
                <Stack className={calloutStyles.buttons} gap={8} horizontal>
                  <PrimaryButton
                    onClick={() => { downloadSelectedNotes(selectedItems); }}
                  >Download</PrimaryButton>
                  <PrimaryButton
                    onClick={ () => {
                      DataverseService.deleteSelectedNotes(selectedRecordIds);
                    }}>Delete</PrimaryButton>
                  <DefaultButton onClick={toggleIsCalloutVisible}>Cancel</DefaultButton>
                </Stack>
              </FocusZone>
              </div> : <div className={calloutStyles.detailsListContent}>
                        No related Notes. Drag and Drop
                        file(s) on a row to create Notes. </div> }
            </Callout>
            : null}
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
      isResizable: true,
    }))];

    const mergedColumns = [ ...mainColumns[0], ...notesColumn ];
    setColumns(mergedColumns);

    const myItems = dataset.sortedRecordIds.map(id => {
      const entityId = dataset.records[id];
      const attributes = dataset.columns.map(column => ({ [column.name]:
        entityId.getFormattedValue(column.name) }));

      return Object.assign({
        key: entityId.getRecordId(),
        raw: entityId,
      }, ...attributes);
    });

    setItems(myItems);
  }, [dataset]);

  return (
    <>
      <div style={{ width: '100%' }}>
        <div className={dataSetStyles.content}>
          <div className={dataSetStyles.buttons}>
            <Stack styles={stackStyles} horizontal >

              <CommandBarButton
                iconProps={addIcon}
                text="New"
                menuProps={menuProps}
              />
              <CommandBarButton
                iconProps={downloadIcon}
                onClick={() => { }}
                text="Download"
              />
              <CommandBarButton
                iconProps={refreshIcon}
                text="Refresh"
                onClick={() => { refreshGrid(dataset); }}
              />
              <CommandBarButton
                iconProps={deleteIcon}
                text="Delete"
                onClick={() => { DataverseService.deleteSelectedRecords(selectedItems); }}
              />
            </Stack>
          </div>
        </div>
        <div>
          <DetailsList
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
};

export default React.memo(DataSetGrid);
