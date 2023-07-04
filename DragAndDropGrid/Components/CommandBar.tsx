import { CommandBarButton } from '@fluentui/react';
import * as React from 'react';
import DataverseService from '../services/dataverseService';
import { addIcon, CommandBarButtonStyles, downloadIcon,
  refreshIcon, deleteIcon } from '../styles/dataSetStyles';

export interface ICommandBarProps {
  isDisabled: boolean;
  refreshGrid: () => void;
  downloadSelectedRecords: () => Promise<void>;
  deleteSelectedRecords: () => Promise<void>;
}

export const CommandBar = (commandBarProps: ICommandBarProps) => {
  const {
    isDisabled,
    refreshGrid,
    downloadSelectedRecords,
    deleteSelectedRecords,
  } = commandBarProps;

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
      onClick={downloadSelectedRecords}
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
      onClick={deleteSelectedRecords}
    />
  </>;
};
