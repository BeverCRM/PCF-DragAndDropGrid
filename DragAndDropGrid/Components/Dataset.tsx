import * as React from 'react';
import { DetailsList, IDetailsFooterProps, IDetailsListProps, IDragDropEvents,
  Spinner, SpinnerSize, Stack } from '@fluentui/react';
import { GridFooter } from './Footer';
import { useSelection } from './Selection';
import DataverseService from '../Services/DataverseService';
import { modalStyles, noteColumnStyles } from '../Styles/ModalStyles';
import { dataSetStyles, detailsHeaderStyles } from '../Styles/DataSetStyles';
import { _onRenderDetailsHeader, _onRenderRow } from '../Utils/Utils';
import { NotesDetailsList } from './NotesDetailsList';
import { CommandBar } from './CommandBar';

type DataSet = ComponentFramework.PropertyTypes.DataSet;
type Entity = ComponentFramework.WebApi.Entity;

export interface IDataSetProps {
  dataset: DataSet;
  width?: number;
  height?: number;
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

export const DataSetGrid = React.memo(({ dataset }: IDataSetProps) => {
  const [items, setItems] = React.useState<any>([]);
  const [columns, setColumns] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const dragDropEvents = getDragDropEvents();
  const { selection, selectedRecordIds, onItemInvoked } = useSelection(dataset);

  const refreshGrid = (dataset: DataSet) => {
    setIsLoading(true);
    return dataset.refresh();
  };

  React.useEffect(() => {
    setIsLoading(false);
  }, [isLoading]);

  React.useEffect(() => {
    const datasetColumns = [dataset.columns.sort((column1, column2) =>
      column1.order - column2.order).filter(column => !column.isHidden).map(column => ({
      name: column.displayName,
      fieldName: column.name,
      styles: detailsHeaderStyles,
      minWidth: column.visualSizeFactor,
      key: column.name,
      isResizable: true,
    }))];

    const notesColumn = [
      {
        name: 'Attachments',
        fieldName: 'Attachments',
        key: 'Attachments',
        isResizable: true,
        styles: noteColumnStyles,
        onRender: (item: Entity) => {
          const targetEntityId = item.key;
          return <NotesDetailsList
            dataset={dataset}
            targetEntityId = {targetEntityId}
          ></NotesDetailsList>;
        },
      },
    ];

    const mergedColumns = [ ...datasetColumns[0], ...notesColumn ];
    setColumns(mergedColumns);

    const datasetItems = dataset.sortedRecordIds.map(id => {
      const entityId = dataset.records[id];
      const attributes = dataset.columns.map(column => ({ [column.name]:
        entityId.getFormattedValue(column.name) }));
      return Object.assign({
        key: entityId.getRecordId(),
        raw: entityId,
      }, ...attributes);
    });

    setItems(datasetItems);
  }, [dataset]);

  const _onRenderDetailsFooter: IDetailsListProps['onRenderDetailsFooter'] =
  (props: IDetailsFooterProps | undefined) => {
    if (props) {
      return <GridFooter dataset={dataset} selectedCount={props.selection.count}></GridFooter>;
    }
    return null;
  };

  return (
    <>
      {
        (() => {
          if (!isLoading) {
            return <Stack >
              <Stack horizontal horizontalAlign="end" className={dataSetStyles.buttons}>
                <CommandBar
                  refreshGrid={refreshGrid}
                  selectedRecordIds={selectedRecordIds}
                ></CommandBar>
              </Stack>
              <Stack>
                <DetailsList
                  items = {items}
                  columns = {columns}
                  dragDropEvents = {dragDropEvents}
                  onItemInvoked = {onItemInvoked}
                  selection={selection}
                  onRenderRow={_onRenderRow}
                  onRenderDetailsHeader={_onRenderDetailsHeader}
                  onRenderDetailsFooter= {_onRenderDetailsFooter}
                >
                </DetailsList>
              </Stack>
            </Stack>;
          }
          return <Spinner className={modalStyles.spinner}
            size={SpinnerSize.large} />;
        })()
      }
    </>);
});

DataSetGrid.displayName = 'DataSetGrid';
