import { CommandBarButton } from '@fluentui/react';
import * as React from 'react';
import DataverseService from '../Services/DataverseService';
import { addIcon, CommandBarButtonStyles, downloadIcon,
  refreshIcon, deleteIcon } from '../Styles/DataSetStyles';

export interface ICommandBarProps {
  refreshGrid: any;
  selectedRecordIds: string[];
}

export const CommandBar = ({ refreshGrid, selectedRecordIds } : ICommandBarProps) => {
  const [entityName, setEntityName] = React.useState<any>([]);

  React.useCallback(async () => {
    const targetEntityDisplayName = await DataverseService.getTargetEntityDisplayName();
    setEntityName(targetEntityDisplayName);
  }, [])();

  return <>
    <CommandBarButton
      iconProps={addIcon}
      styles={CommandBarButtonStyles}
      text={`New ${entityName}`}
      onClick={() => { DataverseService.openRecordCreateForm(); }}
    />
    <CommandBarButton
      iconProps={downloadIcon}
      styles={CommandBarButtonStyles}
      onClick={() => { }}
      text="Download"
    />
    <CommandBarButton
      iconProps={refreshIcon}
      styles={CommandBarButtonStyles}
      text="Refresh"
      onClick={refreshGrid}
    />
    <CommandBarButton
      iconProps={deleteIcon}
      styles={CommandBarButtonStyles}
      text="Delete"
      onClick={() => { DataverseService.openRecordDeleteDialog(selectedRecordIds); }}
    />
  </>;
};
