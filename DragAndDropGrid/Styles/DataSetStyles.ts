import { IIconProps } from '@fluentui/react/lib/components/Icon/Icon.types';
import { IStackStyles } from '@fluentui/react/lib/components/Stack/Stack.types';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';

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
    display: 'flex',
    position: 'relative',
    flexDirection: 'row',
    left: '100%',
    transform: 'translateX(-100%)',
    maxWidth: '600px',
  },
  detailsList: {
    paddingTop: '0px',
  },
});
