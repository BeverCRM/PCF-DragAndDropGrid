import * as React from 'react';
import { Callout, CommandBarButton, DefaultButton, DetailsList,
  FocusZone,
  FocusZoneTabbableElements, IColumn, IconButton,
  IDragDropEvents, PrimaryButton,
  Spinner, SpinnerSize, Stack } from '@fluentui/react';
import { GridFooter } from './Footer';
import { useSelection } from './Selection';
import { useBoolean } from '@fluentui/react-hooks';

import DataverseService from '../Services/DataverseService';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { settingsButtonStyles, settingsIcon, calloutStyles } from '../Styles/CalloutStyles';
import { dataSetStyles, stackStyles, addIcon,
  downloadIcon, refreshIcon, deleteIcon } from '../Styles/DataSetStyles';

type DataSet = ComponentFramework.PropertyTypes.DataSet;
type Entity = ComponentFramework.WebApi.Entity;

export interface IDataSetProps {
  dataset: DataSet;
}

function getDragDropEvents(): IDragDropEvents {
  return {
    canDrop: () => true,
    onDrop: (item?: any, event?: DragEvent) => {
      event?.preventDefault();
      const droppedFiles = event?.dataTransfer?.files;
      const targetEntityId = item.key;
      DataverseService.uploadFiles(droppedFiles, targetEntityId);
    },
  };
}

function downloadSelectedNotes(selectedRecords: any[]) {
  const zip: JSZip = new JSZip();
  selectedRecords.forEach((file: any) => {
    zip.file(file.name, file.documentbody, { base64: true });
  });

  zip.generateAsync({ type: 'blob' })
    .then(content => {
      saveAs(content, 'Files.zip');
    });
}

function refreshGrid(dataset: DataSet) {
  return dataset.refresh();
}

export const DataSetGrid = React.memo(({ dataset }: IDataSetProps) => {
  const [items, setItems] = React.useState<any>([]);
  const [columns, setColumns] = React.useState<any>([]);
  const dragDropEvents = getDragDropEvents();
  const { selection, selectedCount, selectedRecordIds, onItemInvoked } = useSelection(dataset);

  const notesColumn: IColumn[] = [
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
        const [isLoading, setIsLoading] = React.useState<boolean>(true);
        const [noteDeleted, { toggle: toggleNoteDeleted }] = useBoolean(false);
        const { selection, selectedItems, selectedRecordIds } = useSelection(dataset);
        const targetEntityId = item.key;

        React.useEffect(() => {
          if (isCalloutVisible) {
            setIsLoading(true);
            DataverseService.getRecordRelatedNotes(targetEntityId).then(data => {
              const finalNotes = data.entities.filter((entity: Entity) =>
                entity.filename !== undefined).map((entity: Entity) =>
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
              setIsLoading(false);
            });
          }
        }, [isCalloutVisible, noteDeleted]);

        return <>
          <IconButton
            id={targetEntityId}
            className={settingsButtonStyles}
            onClick={() => {
              toggleIsCalloutVisible();
            }}
            iconProps={settingsIcon}
            title="Settings"
            ariaLabel="Settings"
          />
          {
            (() => {
              if (isCalloutVisible) {
                return <Callout
                  setInitialFocus={true}
                  role="alertdialog"
                  className={calloutStyles.callout}
                  gapSpace={0}
                  onClick={() => { }}
                  target={`[id='${targetEntityId}']`}
                  onDismiss={toggleIsCalloutVisible}
                >
                  <div className={calloutStyles.title}>
                      Attachments
                  </div>
                  {
                    (() => {
                      if (!isLoading) {
                        if (noteItems.length !== 0) {
                          return <div><DetailsList
                            onItemInvoked = {DataverseService.onCalloutItemInvoked}
                            className={calloutStyles.detailsListContent}
                            items={noteItems}
                            selection={selection}
                          >
                          </DetailsList>
                          <FocusZone handleTabKey={FocusZoneTabbableElements.all}
                            isCircularNavigation>
                            <Stack className={calloutStyles.buttons} gap={8} horizontal>
                              <PrimaryButton
                                onClick={() => { downloadSelectedNotes(selectedItems); }}
                              >Download</PrimaryButton>
                              <PrimaryButton
                                onClick={ () => {
                                  setIsLoading(true);
                                  DataverseService.deleteSelectedNotes(selectedRecordIds)
                                    .then(() => {
                                      setIsLoading(false);
                                      toggleNoteDeleted();
                                    });

                                }}>Delete</PrimaryButton>
                              <DefaultButton onClick={toggleIsCalloutVisible}>Cancel</DefaultButton>
                            </Stack>
                          </FocusZone>
                          </div>;
                        }
                        return <div className={calloutStyles.detailsListContent}>
                        No related Notes. Drag and Drop
                        file(s) on a row to create Notes. </div>;
                      }
                      return <Spinner className={calloutStyles.spinner} size={SpinnerSize.large} />;
                    })()
                  }
                </Callout>;
              }
            })()
          }
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
                text="New Inventory Product" // get entityName
                onClick={() => { DataverseService.openRecordCreateForm(); }}
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
                onClick={() => { DataverseService.deleteSelectedRecords(selectedRecordIds); }}
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
            enableUpdateAnimations= {true} // how works
            // layoutMode={DetailsListLayoutMode.justified}
          >
          </DetailsList>
          <GridFooter dataset={dataset} selectedCount={selectedCount}></GridFooter>
        </div>
      </div>
    </>);
});

DataSetGrid.displayName = 'DataSetGrid';
