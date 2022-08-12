import { IIconProps } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import { FontWeights, mergeStyleSets } from '@fluentui/react/lib/Styling';

export const settingsIcon: IIconProps = { iconName: 'CalculatorMultiply' }; // CalculatorMultiply
export const settingsButtonId = useId('delete-button');

export const calloutStyles = mergeStyleSets({
  callout: {
    width: 320,
    padding: '20px 24px',
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

const footerStyles = mergeStyleSets({
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
  commandBarAndSearchBox: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    left: '100%',
    transform: 'translateX(-100%)',
    maxWidth: '600px',
  },
  commandBar: {
    flex: 2,
    minWidth: '120px',
    maxWidth: '400px',
  },
  searchBox: {
    flex: 1,
    minWidth: '100px',
    maxWidth: '200px',
    marginTop: '6px',
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
