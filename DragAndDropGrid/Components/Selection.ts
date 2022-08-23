import * as React from 'react';
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import { Selection } from '@fluentui/react/lib/DetailsList';

export const useSelection = (dataset: DataSet) => {
  const [selectedCount, setSelectedCount] = React.useState<number>(0);
  const [selectedItems, setSelectedItems] = React.useState<any>([]);
  const [selectedRecordIds, setSelectedRecordIds] = React.useState<any>([]);
  const [selection, setSelection] = React.useState(new Selection({
    onSelectionChanged: () => {
      const recordIds = selection.getSelection().map((item :any) => item.key);
      dataset.setSelectedRecordIds(recordIds);
      setSelectedCount(recordIds.length);
      setSelectedItems(selection.getSelection());
      setSelectedRecordIds(recordIds);
    },
  }));

  const onItemInvoked = React.useCallback((item : any) : void => {
    const record = dataset.records[item.key];
    dataset.openDatasetItem(record.getNamedReference());
  }, [dataset]);
  return {
    selection,
    selectedCount,
    selectedItems,
    onItemInvoked,
    selectedRecordIds,
  };
};
