import * as React from "react";
import { Component, ComponentType } from "react";
import { actionsKey, Presenter, IPresenterOutput } from "./Presenter";

export type ComponentProvider = () => React.ComponentType<any>;

export interface IActions<T> {
  actions: T;
}

export const connect = <P extends Presenter<VM>, I, VM, C = {}>(
  presenter: P,
  initialState: VM,
  component: ComponentType<IActions<I> & VM & C>,
  mapPresenterToActions?: (presenter: P) => IActions<I>
): ComponentProvider => {
  class PresenterProvider extends Component implements IPresenterOutput<VM> {
    public state: VM = initialState;

    private readonly presenter: P;

    constructor(props: any) {
      super(props);

      this.presenter = presenter;
      presenter.setOutput(this);
    }

    public renderOutput(viewModel: Partial<VM>): void {
      this.setState(viewModel);
    }

    public render() {
      const actions = this.getActions();
      const props = { ...actions, ...(this.state as any), ...this.props };
      return React.createElement(component, props);
    }

    private getActions = () => {
      if (mapPresenterToActions) {
        return mapPresenterToActions(this.presenter);
      } else {
        return autoMapPresenterToActions(this.presenter);
      }
    }
  }

  return () => PresenterProvider;
};

const autoMapPresenterToActions = <P, A>(presenter: P): IActions<A> => {
  const map: IActions<any> = { actions: {} };

  const actionsKeys = (presenter as any)[actionsKey];
  if (actionsKeys) {
    for (const actionKey of actionsKeys) {
      const fn = (presenter as any)[actionKey];
      if (fn.bind) {
        map.actions[actionKey] = fn.bind(presenter);
      } else {
        map.actions[actionKey] = fn;
      }
    }
  }

  return map;
};
