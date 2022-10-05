import { CommandBarButton } from '@fluentui/react';
import * as React from 'react';
import DataverseService from '../Services/DataverseService';
import { addIcon, CommandBarButtonStyles, downloadIcon,
  refreshIcon, deleteIcon } from '../Styles/DataSetStyles';

export interface ICommandBarProps {
  isDisabled: boolean;
  refreshGrid: () => void;
  selectedRecordIds: string[];
}

export const CommandBar = ({ isDisabled, refreshGrid, selectedRecordIds } : ICommandBarProps) => {
  const [entityName, setEntityName] = React.useState<any>([]);

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
      onClick={() => { }}
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
