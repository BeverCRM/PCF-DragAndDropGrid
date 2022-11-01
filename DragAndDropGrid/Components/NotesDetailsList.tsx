import {
  DefaultButton, DetailsList, IconButton, Modal,
  PrimaryButton, Spinner, SpinnerSize, Stack,
} from '@fluentui/react';
import * as React from 'react';
import DataverseService from '../Services/DataverseService';
import { downloadSelectedNotes } from '../Services/ZipService';
import { modalStyles, cancelIcon,
  iconButtonStyles, notesButtonStyles, notesIcon, modalLayerProps } from '../Styles/ModalStyles';
import { useSelection } from './Selection';

type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface INotesDetailsListProps {
  dataset: DataSet;
  targetEntityId: string;
}

export const NotesDetailsList = ({ dataset, targetEntityId }: INotesDetailsListProps) => {
  const {
    selection,
    selectedItems,
    selectedRecordIds,
  } = useSelection(dataset);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [noteItems, setNoteItems] = React.useState<any>([]);
  const [noteDeleted, setNoteDeleted] = React.useState<boolean>(false);
  const [download, setDownload] = React.useState<boolean>(false);

  async function openNoteDeleteDialog(): Promise<void> {
    const isConfirmed: boolean = await DataverseService.openNoteDeleteDialog();
    if (isConfirmed) {
      setIsLoading(true);
      await DataverseService.deleteSelectedNotes(selectedRecordIds);
      setNoteDeleted(!noteDeleted);
    }
  }

  React.useEffect(() => {
    if (isModalOpen) {
      setIsLoading(true);
      DataverseService.getRecordRelatedNotes(targetEntityId, false).then(data => {
        setNoteItems(data);
        setIsLoading(false);
      });
    }
  }, [isModalOpen, noteDeleted]);

  return <> <IconButton
    id={targetEntityId}
    className={notesButtonStyles}
    onClick={() => setIsModalOpen(true)}
    iconProps={notesIcon}
    title="Attachments"
    ariaLabel="Attachments"
  />
  <Modal
    isOpen={isModalOpen}
    onDismiss={() => setIsModalOpen(true)}
    isBlocking={true}
    layerProps={modalLayerProps}
    containerClassName={modalStyles.container}
  >
    <div className='navBarHeader'>
      <div className={modalStyles.header}>
        <span> Attachments</span>
        <IconButton
          styles={iconButtonStyles}
          iconProps={cancelIcon}
          onClick={() => setIsModalOpen(false)}
        />
      </div>
    </div>
    {
      (() => {
        if (!isLoading) {
          if (noteItems.length !== 0) {
            if (download) {
              return <div className='downloadContainer'>
                <Spinner size={SpinnerSize.large} />
                <p className='downloadText'>Downloading ...</p>
              </div>;
            }
            return <div className={modalStyles.body}>
              <DetailsList
                onItemInvoked={DataverseService.onCalloutItemInvoked}
                items={noteItems}
                selection={selection}
                className={modalStyles.dataList}
                columns={[{
                  key: 'name', fieldName: 'name',
                  name: 'Name', minWidth: 100, isMultiline: true,
                }]}
              />
              <Stack className={modalStyles.buttons} gap={8} horizontal>
                <PrimaryButton
                  onClick={async () => {
                    if (selectedItems.length !== 0) {
                      setDownload(true);
                      const notes =
                      await DataverseService.getSelectedNotes(selectedRecordIds);
                      await downloadSelectedNotes(notes);
                      setDownload(false);
                    }
                  }}
                >Download</PrimaryButton>
                <PrimaryButton
                  onClick={() => {
                    if (selectedItems.length !== 0) {
                      openNoteDeleteDialog();
                    }
                  }}
                >Delete</PrimaryButton>
                <DefaultButton onClick={() => {
                  setIsModalOpen(false);
                }}>Cancel</DefaultButton>
              </Stack>
            </div>;
          }
          return <div className={modalStyles.body}>
              No related file attachments are found.  </div>;
        }
        return <Spinner className={modalStyles.spinner}
          size={SpinnerSize.large} />;
      })()
    }
  </Modal></>;
};
