import { CommandBarButton, trProperties } from '@fluentui/react';
import * as React from 'react';
import DataverseService from '../Services/DataverseService';
import { downloadSelectedNotes } from '../Services/ZipService';
import { addIcon, CommandBarButtonStyles, downloadIcon,
  refreshIcon, deleteIcon } from '../Styles/DataSetStyles';

export interface ICommandBarProps {
  isDisabled: boolean;
  refreshGrid: () => void;
  selectedRecordIds: string[];
}

export const CommandBar = ({ isDisabled, refreshGrid, selectedRecordIds } : ICommandBarProps) => {
  const [entityName, setEntityName] = React.useState<any>([]);

  async function downloadSelectedRecords(selectedRecordIds: string[]){
    for ( const selectedRecordId of selectedRecordIds ){
      const finalNotes = await DataverseService.getRecordRelatedNotes(selectedRecordId)
      downloadSelectedNotes(finalNotes)
     }
  }

  React.useCallback(async () => {
    const targetEntityDisplayName = await DataverseService.getTargetEntityDisplayName();
    setEntityName(targetEntityDisplayName);
  }, [])();

  return <>
    <CommandBarButton
      disabled = { isDisabled }
      iconProps={addIcon}
      styles={CommandBarButtonStyles}
      text={`New ${entityName}`}
      onClick={() => { DataverseService.openRecordCreateForm(); }}
    />
    <CommandBarButton
      disabled = { isDisabled }
      iconProps={downloadIcon}
      styles={CommandBarButtonStyles}
      onClick={() => { downloadSelectedRecords(selectedRecordIds); }}
      text="Download"
    />
    <CommandBarButton
      disabled = { isDisabled }
      iconProps={refreshIcon}
      styles={CommandBarButtonStyles}
      text="Refresh"
      onClick={refreshGrid}
    />
    <CommandBarButton
      disabled = { isDisabled }
      iconProps={deleteIcon}
      styles={CommandBarButtonStyles}
      text="Delete"
      onClick={() => { DataverseService.openRecordDeleteDialog(selectedRecordIds); }}
    />
  </>;
};
