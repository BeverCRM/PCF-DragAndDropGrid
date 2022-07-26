import { IIconProps } from '@fluentui/react/lib/components/Icon/Icon.types';
import { ILayerProps, ILayerStyles } from '@fluentui/react/lib/components/Layer/Layer.types';
import { FontWeights, getTheme, mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';

const theme = getTheme();

export const notesIcon: IIconProps = { iconName: 'EditNote' };
export const cancelIcon: IIconProps = { iconName: 'Cancel' };

export const notesButtonStyles = mergeStyles({

  backgroundColor: 'transparent',
  color: 'black',
  paddingBottom: '10px',
});

export const noteColumnStyles = mergeStyleSets({
  buttons: {
    backgroundColor: 'transparent',
  },
  cellName: {
    fontSize: '12px',
  },
  root: {
    textAlign: 'center',
  },

});

export const modalRootStyles: Partial<ILayerStyles> = {
  root: {
    zIndex: 0,
  },
};

export const modalLayerProps: ILayerProps = {
  styles: modalRootStyles,
};

export const modalStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    maxHeight: '600px',
  },
  header: [
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semilight,
      padding: '12px 12px 14px 24px',
    },
  ],
  body: {
    flex: '4 4 auto',
    padding: '0 33px 33px 33px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
  spinner: {
    height: 250,
  },
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
  dataList: {
    paddingBottom: '75px',
  },
});

export const iconButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};
