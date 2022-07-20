import * as React from 'react';
import { Label } from '@fluentui/react';

export interface IHelloWorldProps {
  name?: string;
}

export interface IHelloWorldState {
  title: string;
}

export class HelloWorld extends React.Component<IHelloWorldProps, IHelloWorldState> {
  public render(): React.ReactNode {
    return (
      <Label>
        {this.props.name}
      </Label>
    )
  }
}
