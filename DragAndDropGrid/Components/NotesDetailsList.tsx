import { DefaultButton, DetailsList, IconButton, Modal,
  PrimaryButton, Spinner, SpinnerSize, Stack } from '@fluentui/react';
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

export const NotesDetailsList = ({ dataset, targetEntityId } : INotesDetailsListProps) => {
  const {
    selection,
    selectedItems,
    selectedRecordIds,
  } = useSelection(dataset);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [noteItems, setNoteItems] = React.useState<any>([]);
  const [noteDeleted, setNoteDeleted] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (isModalOpen) {
     setIsLoading(true);
     const finalNotes = DataverseService.getRecordRelatedNotes(targetEntityId);
     finalNotes.then(data => {
          setNoteItems(data);
          setIsLoading(false);
     })
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
    <div className={modalStyles.header}>
      <span> Attachments</span>
      <IconButton
        styles={iconButtonStyles}
        iconProps={cancelIcon}
        onClick={() => setIsModalOpen(false)}
      />
    </div>
    {
      (() => {
        if (!isLoading) {
          if (noteItems.length !== 0) {
            return <div className={modalStyles.body}>
              <DetailsList
              onItemInvoked={DataverseService.onCalloutItemInvoked}
              items={noteItems}
              selection={selection}
              columns={[{key: 'name', fieldName: 'name', name: 'Name', minWidth: 50, }]}
            />
            <Stack className={modalStyles.buttons} gap={8} horizontal>
              <PrimaryButton
                onClick={() => {
                 selectedItems.length !== 0 ? downloadSelectedNotes(selectedItems) : null }}
              >Download</PrimaryButton>
              <PrimaryButton
                onClick={ () => {
                  DataverseService.openNoteDeleteDialog(selectedRecordIds).then(
                    () => {
                      setNoteDeleted(!noteDeleted);
                    },
                  );
                }}>Delete</PrimaryButton>
              <DefaultButton onClick={() => {
                setIsModalOpen(false);
              }}>Cancel</DefaultButton>
            </Stack>
            </div>;
          }
          return <div className={modalStyles.body}>
              No related Notes. Drag and Drop
              file(s) on a row to create Notes. </div>;
        }
        return <Spinner className={modalStyles.spinner}
          size={SpinnerSize.large} />;
      })()
    }
  </Modal></>;
};
