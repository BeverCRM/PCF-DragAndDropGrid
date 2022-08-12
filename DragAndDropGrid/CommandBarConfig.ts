//  import { concatStyleSets, DirectionalHint, getTheme, IButtonProps, IButtonStyles, ICommandBarItemProps, IContextualMenuItemProps, IContextualMenuItemStyles, IContextualMenuStyles, memoizeFunction, setVirtualParent } from '@fluentui/react';
import { ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { IButtonProps, IButtonStyles } from '@fluentui/react/lib/Button';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import {
  IContextualMenuItemStyles,
  IContextualMenuStyles,
} from '@fluentui/react/lib/ContextualMenu';
import { getTheme, concatStyleSets, mergeStyles } from '@fluentui/react/lib/Styling';
import { memoizeFunction, setVirtualParent } from '@fluentui/react/lib/Utilities';
import * as React from 'react';
import {DragAndDropGrid} from './index';
import { refreshGrid } from './Dataset';

const theme = getTheme();

export const MainDivStyles = mergeStyles({
  width: '100%',
  display: 'inline-block',
  position: 'relative',
  height: '40px',

});
export const CommandBarAndSearchBoxStyles = mergeStyles({
  display: 'flex',
  position: 'relative',
  flexDirection: 'row',
  // float: 'right',
  left: '100%',
  transform: 'translateX(-100%)',
  maxWidth: '600px',

});

export const CommandBarStyles = mergeStyles({
  // maxWidth: '600px',
  // float: 'right',
  flex: 2,
  minWidth: '120px',
  maxWidth: '400px',

});

export const DetailsListStyles = mergeStyles({
  paddingTop: '0px',
  // width: '3px',
});

export const SearchBoxStyles = mergeStyles({
  // display: 'flex',

  flex: 1,
  minWidth: '100px',
  maxWidth: '200px',
  marginTop: '6px',
  // float: 'right',

});

const itemStyles: Partial<IContextualMenuItemStyles> = {
  label: { fontSize: 18 },
  root: { marginLeft: -3 },
  icon: { color: theme.palette.red },
  iconHovered: { color: theme.palette.redDark },
};

const menuStyles: Partial<IContextualMenuStyles> = {
  subComponentStyles: { menuItem: itemStyles, callout: {} },
  list: { itemStyles },
  container: { itemStyles },
};

const getCommandBarButtonStyles = memoizeFunction(
  (originalStyles: IButtonStyles | undefined): Partial<IContextualMenuItemStyles> => {
    if (!originalStyles) {
      return menuStyles;
    }

    return concatStyleSets(originalStyles, itemStyles);
  },
);

export const CommandBarOverflowProps: IButtonProps = {
  ariaLabel: 'More commands',
  menuProps: {
    // Styles are passed through to menu items here
    // styles: menuStyles,
    items: [], // CommandBar will determine items rendered in overflow
    isBeakVisible: true,
    beakWidth: 20,
    gapSpace: 10,
    directionalHint: DirectionalHint.topCenter,
  },
};

// const CustomButton: React.FunctionComponent<IButtonProps> = props => {
//   const buttonOnMouseClick = () => alert(`${props.text} clicked`);
//   // eslint-disable-next-line react/jsx-no-bind
//   return <CommandBarButton {...props} onClick={buttonOnMouseClick} styles={getCommandBarButtonStyles(props.styles)} />;
// };

export const CommandBarItems: ICommandBarItemProps[] = [

  {
    key: 'newItem',
    text: 'New',
    // items: menuStyles,
    cacheKey: 'myCacheKey', // changing this key will invalidate this item's cache
    iconProps: { iconName: 'Add' },
    subMenuProps: {
      items: [
        {
          key: 'emailMessage',
          text: 'Inventory Product', // changed
          iconProps: { iconName: 'Mail' },
          'data-automation-id': 'newEmailButton', // optional
        },

      ],
    },
  },
 
  {
    key: 'download',
    text: 'Download',
    iconProps: { iconName: 'Download' },
    onClick: () => {
      console.log('Download');
      

    },
  },
  {
    key: 'refresh',
    text: 'Refresh',
    iconProps: { iconName: 'Refresh' },
    onClick: (ev?: React.MouseEvent<HTMLElement, MouseEvent> |
                React.KeyboardEvent<HTMLElement> | undefined) => {
      console.log(ev);
    },
  },
];

export const CommandBarFarItems: ICommandBarItemProps[] = [
  {
    key: 'info',
    text: 'Info',
    // This needs an ariaLabel since it's icon-only
    ariaLabel: 'Info',
    iconOnly: true,
    iconProps: { iconName: 'Info' },
    onClick: () => console.log('Info'),
  },
];
