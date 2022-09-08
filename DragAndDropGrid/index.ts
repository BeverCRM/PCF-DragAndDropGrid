import { IInputs, IOutputs } from './generated/ManifestTypes';
import { DataSetGrid, IDataSetProps } from './Components/Dataset';
import * as React from 'react';
import DataverseService from './Services/DataverseService';

export class DragAndDropGrid implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;

    private notifyOutputChanged: () => void;

    context: ComponentFramework.Context<IInputs>;

    constructor() { }

    public init(
      context: ComponentFramework.Context<IInputs>,
      notifyOutputChanged: () => void,
    ): void {
      this.notifyOutputChanged = notifyOutputChanged;
      this.context = context;
      this.context.mode.trackContainerResize(true);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
      const targetEntityType: string = context.parameters.dataset.getTargetEntityType();

      DataverseService.setContext(context, targetEntityType);

      const props: IDataSetProps = {
        dataset: context.parameters.dataset,
      };
      return React.createElement(DataSetGrid, props);
    }

    public getOutputs(): IOutputs { return { }; }

    public destroy(): void { }
}
