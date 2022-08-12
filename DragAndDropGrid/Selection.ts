import * as React from 'react';
type DataSet = ComponentFramework.PropertyTypes.DataSet;
import { Selection } from '@fluentui/react/lib/DetailsList';

export const useSelection = (dataset: DataSet) => {
  const [selectedCount, setSelectedCount] = React.useState<number>(0);
  const [selection, setSelection] = React.useState(new Selection({
    onSelectionChanged: () => {
      const ids = selection.getSelection().map((item :any) => item.key);
      console.log('ids');
      console.log(ids);
      dataset.setSelectedRecordIds(ids);
      setSelectedCount(ids.length);
    },
  }));

  const onItemInvoked = React.useCallback((item : any) : void => {
    const record = dataset.records[item.key];
    console.log('An item was invoked');
    dataset.openDatasetItem(record.getNamedReference());
  }, [dataset]);

  // const onFilter = React.useCallback((item: any) : void => {
  //   const filteredRecords = dataset.records.filter(i => i.name.toLowerCase().indexOf(text) > -1)
  // }, [dataset]);

  return {
    selection, selectedCount,
    onItemInvoked,
  };

};
