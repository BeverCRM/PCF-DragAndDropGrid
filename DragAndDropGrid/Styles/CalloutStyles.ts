import { IIconProps } from '@fluentui/react/lib/components/Icon/Icon.types';
import { FontWeights, mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';

export const settingsIcon: IIconProps = { iconName: 'EditNote' };
export const settingsButtonStyles = mergeStyles({

  backgroundColor: 'transparent',
});

export const noteColumnStyles = mergeStyleSets({
  buttons: {
    backgroundColor: 'transparent',
  },
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
  spinner: {
    height: 250,
  },
});
