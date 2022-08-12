import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { IconButton } from '@fluentui/react/lib/Button';
import { usePaging } from './Paging';
import { mergeStyles } from '@fluentui/react/lib/Styling';

type DataSet = ComponentFramework.PropertyTypes.DataSet;

export interface IGridFooterProps {
    dataset: DataSet;
    selectedCount: number;
}

export const FooterButtonStyles = mergeStyles({ // Import from .styles

  backgroundColor: 'transparent',

});
export const FooterMainStyles = mergeStyles({
  height: '32px',
  width: '100%',
  paddingTop: '10px',
  color: '#333',
  fontSize: '14px',
  borderTop: '1px solid #edebe9',

});
const footerStyles = mergeStyles({
  display: 'flex',
  fontFamily: 'Segoe UI',
});

const footerLeftStyles = mergeStyles({
  width: '100%',
  textAlign: 'left',
  marginLeft: '10px',
});

const footerRightStyles = mergeStyles({
  width: '100%',
  textAlign: 'right',
  marginRight: '10px',
});

const footerIconStyles = mergeStyles({
  backgroundColor: 'transparent',
  fontSize: '14px',
  cursor: 'pointer',
  height: '0px',
});

export const GridFooter = ({ dataset, selectedCount } : IGridFooterProps) => {
  const {
    currentPage,
    firstItemNumber,
    lastItemNumber,
    totalRecords,
    moveToFirst,
    movePrevious,
    moveNext,
  } = usePaging(dataset);

  const selected = `${firstItemNumber} - ${lastItemNumber}
  of ${totalRecords} (${selectedCount} selected)`;
  const page = `Page ${currentPage}`;

  return <div>
    <div className={FooterMainStyles}>
      <div className={footerStyles}>
        <div className={footerLeftStyles}> {selected} </div>
        <div className={footerRightStyles}>
          <IconButton className={footerIconStyles} iconProps={{ iconName: 'Previous' }} onClick={moveToFirst} disabled={!dataset.paging.hasPreviousPage}/>
          <IconButton className={footerIconStyles} iconProps={{ iconName: 'Back' }} onClick={movePrevious} disabled={!dataset.paging.hasPreviousPage}/>
          <span> {page} </span>
          <IconButton className={footerIconStyles} iconProps={{ iconName: 'Forward' }} onClick={moveNext} disabled={!dataset.paging.hasNextPage}/>
        </div>
      </div>
    </div>
  </div>;
};
