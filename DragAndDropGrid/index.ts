import { IInputs, IOutputs } from './generated/ManifestTypes';
import { DataSetGrid, IDataSetProps } from './components/Dataset';
import * as React from 'react';
import DataverseService from './services/DataverseService';

export class DragAndDropGrid implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;

    constructor() { }

    public init(
      context: ComponentFramework.Context<IInputs>,
      notifyOutputChanged: () => void,
    ): void {
      this.notifyOutputChanged = notifyOutputChanged;
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
      DataverseService.setContext(context);

      const props: IDataSetProps = {
        dataset: context.parameters.dataset,
      };
      return React.createElement(DataSetGrid, props);
    }

    public getOutputs(): IOutputs { return { }; }

    public destroy(): void { }
}
