import { IDetailsListProps, IDetailsHeaderStyles, CheckboxVisibility,
  IDetailsRowStyles, DetailsHeader, DetailsRow } from '@fluentui/react';
import React = require('react');

export function readFileAsync(file: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };
    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export const _onRenderDetailsHeader: IDetailsListProps['onRenderDetailsHeader'] = props => {
  const customStyles: Partial<IDetailsHeaderStyles> = {};
  if (props) {

    customStyles.root = {
      backgroundColor: 'white',
      fontSize: '12px',
      paddingTop: '0px',
      display: 'flex',
      borderTop: '1px solid rgb(215, 215, 215)',
    };

    props.checkboxVisibility = CheckboxVisibility.always;
    return <DetailsHeader {...props} styles={customStyles} />;
  }
  return null;
};

export const _onRenderRow: IDetailsListProps['onRenderRow'] = props => {
  const customStyles: Partial<IDetailsRowStyles> = {};
  if (props) {

    customStyles.root = {
      height: '42px',
      backgroundColor: 'white',
      fontSize: '14px',
      color: 'black',
      borderTop: '1px solid rgb(250, 250, 250)',
      borderBottom: '1px solid rgb(219 219 219)',
    };
    return <DetailsRow {...props} styles={customStyles} />;
  }
  return null;
};
