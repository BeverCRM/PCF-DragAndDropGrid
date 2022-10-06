import * as React from 'react';
import { DetailsList, IDetailsFooterProps, IDetailsListProps, IDragDropEvents,
  Spinner, SpinnerSize, Stack } from '@fluentui/react';
import { GridFooter } from './Footer';
import { useSelection } from './Selection';
import DataverseService from '../Services/DataverseService';
import { noteColumnStyles } from '../Styles/ModalStyles';
import { dataSetStyles, detailsHeaderStyles, dragEnterClass } from '../Styles/DataSetStyles';
import { NotesDetailsList } from './NotesDetailsList';
import { CommandBar } from './CommandBar';

import { IDetailsHeaderStyles, CheckboxVisibility,
  IDetailsRowStyles, DetailsHeader, DetailsRow } from '@fluentui/react';

type DataSet = ComponentFramework.PropertyTypes.DataSet;
type Entity = ComponentFramework.WebApi.Entity;

export interface IDataSetProps {
  dataset: DataSet;
  width?: number;
  height?: number;
}

export const DataSetGrid = React.memo(({ dataset, height, width }: IDataSetProps) => {

  const [isImporting, setIsImporting] = React.useState<boolean>(false);
  const [importedFilesCount, setImportedFilesCount] = React.useState<number>(0);
  const [filesCount, setFilesCount] = React.useState<number>(0);

  function getDragDropEvents(): IDragDropEvents {
    return {
      canDrop: () => true,
      onDrop: async (item?: any, event?: DragEvent) => {
        event?.preventDefault();
        const files = event?.dataTransfer?.files;
        if (files) {
          const targetEntityId = item.key;
          setIsImporting(true);
          setFilesCount(files.length);
          for (let i = 0; i < files.length; i++) {
            setImportedFilesCount(i);
            await DataverseService.uploadFile(files[i], files.length, targetEntityId);
          }
        }
        DataverseService.showNotificationPopup();
        setIsImporting(false);
        setFilesCount(0);
        setImportedFilesCount(0);
      },
      onDragEnter: () => dragEnterClass,
    };
  }
  const [items, setItems] = React.useState<any>([]);
  const [columns, setColumns] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const dragDropEvents = getDragDropEvents();
  const { selection, selectedRecordIds, onItemInvoked } = useSelection(dataset);

  const refreshGrid = () => {
    setIsLoading(true);
    dataset.refresh();
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

  const rootContainerStyle: React.CSSProperties = React.useMemo(() => ({
    height,
    width,
  }), [width, height]);

  const _onRenderDetailsFooter: IDetailsListProps['onRenderDetailsFooter'] =
  (props: IDetailsFooterProps | undefined) => {
    if (props) {
      return <GridFooter dataset={dataset} selectedCount={props.selection.count}></GridFooter>;
    }
    return null;
  };

  const _onRenderDetailsHeader: IDetailsListProps['onRenderDetailsHeader'] = props => {
    const customStyles: Partial<IDetailsHeaderStyles> = {};
    if (props) {

      customStyles.root = {
        backgroundColor: 'white',
        fontSize: '12px',
        paddingTop: '0px',
        display: 'flex',
        borderTop: '1px solid rgb(215, 215, 215)',
      };

      props.checkboxVisibility = CheckboxVisibility.always;
      return <DetailsHeader {...props} styles={customStyles} />;
    }
    return null;
  };

  const _onRenderRow: IDetailsListProps['onRenderRow'] = props => {
    const customStyles: Partial<IDetailsRowStyles> = {};
    if (props) {

      customStyles.root = {
        height: '42px',
        backgroundColor: 'white',
        fontSize: '14px',
        color: 'black',
        borderTop: '1px solid rgb(250, 250, 250)',
        borderBottom: '1px solid rgb(219 219 219)',
      };
      return <DetailsRow {...props} styles={customStyles} />;
    }
    return null;
  };

  return (
    <div className='draganddropgrid'>
      {isImporting && <div className='dragloading'>
        <Spinner size={ SpinnerSize.large }/>
        <div>{`Imported ${importedFilesCount} of ${filesCount}`}</div>
      </div>}
      <Stack >
        <Stack horizontal horizontalAlign="end" className={dataSetStyles.buttons}>
          <CommandBar
            isDisabled={isImporting}
            refreshGrid={refreshGrid}
            selectedRecordIds={selectedRecordIds}
          ></CommandBar>
        </Stack>
        <Stack style={rootContainerStyle}>
          <DetailsList
            items={items}
            columns={columns}
            dragDropEvents={dragDropEvents}
            onItemInvoked={onItemInvoked}
            selection={selection}
            onRenderRow={_onRenderRow}
            onRenderDetailsHeader={_onRenderDetailsHeader}
            onRenderDetailsFooter={_onRenderDetailsFooter}
          >
          </DetailsList>
        </Stack>
      </Stack>
    </div>);

});

DataSetGrid.displayName = 'DataSetGrid';
