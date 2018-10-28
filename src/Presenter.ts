export abstract class Presenter<T> {
  private output?: IPresenterOutput<T>;

  public renderToOutput(viewModel: Partial<T>): void {
    if (!this.output) {
      throw new Error(`Output is not set!: ${this}`);
    }
    this.output.renderOutput(viewModel);
  }

  public setOutput(output: IPresenterOutput<T>): void {
    this.output = output;
  }
}

export interface IPresenterOutput<T> {
  renderOutput(viewModel: Partial<T>): void;
}

export const actionsKey = Symbol('actions');

export function action(proto: any, name: string) {
  if (proto.hasOwnProperty(actionsKey)) {
    proto[actionsKey].push(name);
  } else {
    Object.defineProperty(proto, actionsKey, { value: [name] });
  }
}
