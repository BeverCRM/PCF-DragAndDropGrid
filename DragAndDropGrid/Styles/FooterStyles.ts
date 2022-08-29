import { mergeStyleSets } from '@fluentui/react/lib/Styling';

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
