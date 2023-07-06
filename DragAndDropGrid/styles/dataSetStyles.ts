import { IButtonStyles } from '@fluentui/react/lib/components/Button/Button.types';
import { IDetailsColumnStyles } from
  '@fluentui/react/lib/components/DetailsList/DetailsColumn.types';
import { IIconProps } from '@fluentui/react/lib/components/Icon/Icon.types';
import { IStackStyles } from '@fluentui/react/lib/components/Stack/Stack.types';
import { mergeStyleSets, mergeStyles } from '@fluentui/react/lib/Styling';

export const stackStyles: Partial<IStackStyles> = { root: { height: 44, marginLeft: 100 } };
export const deleteIcon: IIconProps = { iconName: 'Delete' };
export const downloadIcon: IIconProps = { iconName: 'Download' };
export const refreshIcon: IIconProps = { iconName: 'Refresh' };
export const addIcon: IIconProps = { iconName: 'Add' };

export const dataSetStyles = mergeStyleSets({
  content: {
    width: '100%',
    display: 'inline-block',
    position: 'relative',
    height: '40px',
  },
  buttons: {
    height: '44px',
    paddingRight: '20px',
  },
  detailsList: {
    paddingTop: '0px',
  },
  commandBarButton: {
    root: {
      color: 'black',
    },
    icon: {
      color: 'black',
    },
  },
});

export const dragEnterClass = mergeStyles({
  'border': 'solid 2px rgba(93, 104, 105, 0.62) !important',
  'transition': 'background-color .0s, padding .100s !important',
  '-webkit-transition': 'background-color .100s, padding .0s, font-size .40s !important',
  '-moz-transition': 'background-color .100s, padding .0s, font-size .10s !important',
  '-o-transition': 'background-color .100s, padding .0s, font-size .10s !important',
  'background-color': '#6666664a !important',
});

export const CommandBarButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: 'black',
  },
  icon: {
    color: 'black',
  },
};

export const detailsHeaderStyles: Partial<IDetailsColumnStyles> = {
  cellName: {
    fontSize: '12px',
  },
};
