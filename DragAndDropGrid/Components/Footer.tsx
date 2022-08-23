import * as React from 'react';
import { IconButton } from '@fluentui/react/lib/Button';
import { usePagination } from './Pagination';
import { footerStyles } from '../Styles/styles';

type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface IGridFooterProps {
    dataset: DataSet;
    selectedCount: number;
}

export const GridFooter = ({ dataset, selectedCount } : IGridFooterProps) => {
  const {
    currentPage,
    firstItemNumber,
    lastItemNumber,
    totalRecords,
    moveToFirst,
    movePrevious,
    moveNext,
  } = usePagination(dataset);

  const selected = `${firstItemNumber} - ${lastItemNumber}
  of ${totalRecords} (${selectedCount} selected)`;
  const page = `Page ${currentPage}`;

  return <div>
    <div className={footerStyles.content}>
      <div className={footerStyles.footer}>
        <div className={footerStyles.left}> {selected} </div>
        <div className={footerStyles.right}>
          <IconButton className={footerStyles.icon} iconProps={{ iconName: 'Previous' }}
            onClick={moveToFirst} disabled={!dataset.paging.hasPreviousPage}/>
          <IconButton className={footerStyles.icon} iconProps={{ iconName: 'Back' }}
            onClick={movePrevious} disabled={!dataset.paging.hasPreviousPage}/>
          <span> {page} </span>
          <IconButton className={footerStyles.icon} iconProps={{ iconName: 'Forward' }}
            onClick={moveNext} disabled={!dataset.paging.hasNextPage}/>
        </div>
      </div>
    </div>
  </div>;
};
