import { IIconProps, IStackStyles } from '@fluentui/react';
import { FontWeights, mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';

export const settingsIcon: IIconProps = { iconName: 'Settings' };
export const deleteIcon: IIconProps = { iconName: 'Delete' };
export const stackStyles: Partial<IStackStyles> = { root: { height: 44, marginLeft: 100 } };
export const downloadIcon: IIconProps = { iconName: 'Download' };
export const refreshIcon: IIconProps = { iconName: 'Refresh' };
export const addIcon: IIconProps = { iconName: 'Add' };

export const settingsButtonStyles = mergeStyles({

  backgroundColor: 'transparent',
});

export const calloutStyles = mergeStyleSets({
  callout: {
    width: 320,
    padding: '20px 24px',
  },
  detailsListContent: {
    width: 270,
    maxHeight: 325,
    fontWeight: FontWeights.regular,
  },
  title: {
    marginBottom: 12,
    fontWeight: FontWeights.semilight,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});

export const footerStyles = mergeStyleSets({
  content: {
    height: '32px',
    width: '100%',
    paddingTop: '10px',
    color: '#333',
    fontSize: '14px',
    borderTop: '1px solid #edebe9',
  },
  footer: {
    display: 'flex',
    fontFamily: 'Segoe UI',
  },
  icon: {
    backgroundColor: 'transparent',
    fontSize: '14px',
    cursor: 'pointer',
    height: '0px',
  },
  left: {
    width: '100%',
    textAlign: 'left',
    marginLeft: '10px',
  },
  right: {
    width: '100%',
    textAlign: 'right',
    marginRight: '10px',
  },
});

export const dataSetStyles = mergeStyleSets({
  content: {
    width: '100%',
    display: 'inline-block',
    position: 'relative',
    height: '40px',
  },
  buttons: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    left: '100%',
    transform: 'translateX(-100%)',
    maxWidth: '500px',
  },
  detailsList: {
    paddingTop: '0px',
  },
});

export const noteColumnStyles = mergeStyleSets({
  buttons: {
    backgroundColor: 'transparent',
  },
});
