import * as React from 'react';
import {
  DetailsList, IColumn, Icon, IDetailsFooterProps, IDetailsListProps, IDragDropEvents,
  Link, Spinner, SpinnerSize, Stack,
} from '@fluentui/react';
import { GridFooter } from './Footer';
import { useSelection } from './Selection';
import DataverseService from '../services/dataverseService';
import { noteColumnStyles } from '../styles/modalStyles';
import { dataSetStyles, detailsHeaderStyles, dragEnterClass } from '../styles/dataSetStyles';
import { NotesDetailsList } from './NotesDetailsList';
import { CommandBar } from './CommandBar';
import ZipService from '../services/zipService';

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
  const [isDownloading, setIsDownloading] = React.useState<boolean>(false);
  const [items, setItems] = React.useState<any>([]);
  const [noteExists, setNoteExists] = React.useState<boolean>(true);
  const [entityName, setEntityName] = React.useState<string>();
  const [columns, setColumns] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [canUseLoading, setCanUseLoading] = React.useState(false);
  const { selection, selectedRecordIds, onItemInvoked } = useSelection(dataset);

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
            const wasSuccessful = await DataverseService.uploadFile(files[i], files.length,
              targetEntityId);
            wasSuccessful ? setImportedFilesCount(i) : undefined;
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

  const dragDropEvents = getDragDropEvents();
  React.useEffect(() => {
    DataverseService.getEntityMetadata().then(
      (entityMetadata: any) => {
        setNoteExists(entityMetadata.HasNotes);
        setEntityName(entityMetadata.DisplayName.UserLocalizedLabel.Label);
      },
      (error: any) => {
        console.log(error);
      });
  }, []);

  const refreshGrid = () => {
    setCanUseLoading(true);
    setIsLoading(true);
    dataset.refresh();
  };

  const downloadSelectedRecord = async (): Promise<void> => {
    if (selectedRecordIds.length !== 0) {
      setIsDownloading(true);
      await ZipService.downloadSelectedRecords(selectedRecordIds);
      setIsDownloading(false);
    }
  };

  const deleteSelectedRecord = async (): Promise<void> => {
    if (selectedRecordIds.length !== 0) {
      const isConfirmed = await DataverseService.openRecordDeleteDialog();
      if (isConfirmed) {
        setIsLoading(true);
        await DataverseService.deleteSelectedRecords(selectedRecordIds);
        dataset.refresh();
        setCanUseLoading(true);
      }
    }
  };

  React.useEffect(() => {
    const datasetColumns = dataset.columns.sort((column1, column2) =>
      column1.order - column2.order).filter(column => !column.isHidden).map(column => ({
      name: column.displayName,
      fieldName: column.name,
      styles: detailsHeaderStyles,
      minWidth: column.visualSizeFactor,
      key: column.name,
      isResizable: true,
      onRender: (item: any, index: number, currentColumn: any) => {
        const record = dataset.records[item.key];
        const fieldContent = item[currentColumn.fieldName];
        if (column['dataType'].includes('Lookup')) {
          return <Link onClick={() => {
            // @ts-ignore
            const lookupReferance = record._record.fields[currentColumn.fieldName].reference;
            dataset.openDatasetItem(lookupReferance);
          }} >{fieldContent} </Link>;
        }
        else if (record.getNamedReference().name === fieldContent) {
          return <Link onClick={() => dataset.openDatasetItem(record.getNamedReference())}>
            {fieldContent}</Link>;
        }
        return fieldContent;
      },
    } as IColumn));

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
            targetEntityId={targetEntityId}
          ></NotesDetailsList>;
        },
      },
    ];

    const mergedColumns = [...datasetColumns, ...notesColumn];
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
    if (canUseLoading) {
      setIsLoading(false);
      setCanUseLoading(false);
    }
  }, [dataset]);

  const rootContainerStyle: React.CSSProperties = React.useMemo(() => ({
    height,
    width,
  }), [width, height]);

  const _onRenderDetailsFooter: IDetailsListProps['onRenderDetailsFooter'] =
  (props: IDetailsFooterProps | undefined) => {
    if (props) {
      // eslint-disable-next-line react/prop-types
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

  if (!noteExists) {
    return (
      <div className='draganddropgrid'>
        <Icon className='errorIcone' iconName="error"></Icon>
        <p className='errorMessage'>
          Can&apos;t show control, because notes are not enabled for the {entityName} entity</p>
      </div>
    );
  }

  return (
    <div className='draganddropgrid'>
      {isImporting && <div className='dragloading'>
        <Spinner size={SpinnerSize.large} />
        <div>{`Imported ${importedFilesCount} of ${filesCount}`}</div>
      </div>}
      {isLoading ? <div className='dragloading'>
        <Spinner size={SpinnerSize.large} /></div> : isDownloading &&
      <div className='dragloading'>
        <Spinner size={SpinnerSize.large} /><p>Downloading ...</p></div>}
      <Stack >
        <Stack horizontal horizontalAlign="end" className={dataSetStyles.buttons}>
          <CommandBar
            isDisabled={isImporting}
            refreshGrid={refreshGrid}
            downloadSelectedRecords={downloadSelectedRecord}
            deleteSelectedRecords={deleteSelectedRecord}
          ></CommandBar>
        </Stack>
        <div className='datailsList'>
          <Stack style={rootContainerStyle}>
            <DetailsList
              items={items}
              columns={columns}
              dragDropEvents={dragDropEvents}
              onItemInvoked={onItemInvoked}
              styles={{ contentWrapper: { minHeight: dataset.paging.pageSize * 42 } }}
              selection={selection}
              onRenderRow={_onRenderRow}
              onRenderDetailsHeader={_onRenderDetailsHeader}
              onRenderDetailsFooter={_onRenderDetailsFooter}
            >
            </DetailsList>
          </Stack>
          {items.length === 0 && <span className='infoMessage'>No data available</span>}
        </div>
      </Stack>
    </div>);
});

DataSetGrid.displayName = 'DataSetGrid';
