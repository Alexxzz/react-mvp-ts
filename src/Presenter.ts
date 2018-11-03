export abstract class Presenter<T> {
  /** @internal */
  private output?: IPresenterOutput<T>;

  public renderToOutput(viewModel: Partial<T>): void {
    if (!this.output) {
      throw new Error(`Output is not set!: ${this}`);
    }
    this.output.renderOutput(viewModel);
  }

  /** @internal */
  public setOutput(output: IPresenterOutput<T>): void {
    this.output = output;
  }
}

/** @internal */
export interface IPresenterOutput<T> {
  renderOutput(viewModel: Partial<T>): void;
}

/** @internal */
export const actionsKey = Symbol('actions');

/** @internal */
export function action(proto: any, name: string) {
  if (proto.hasOwnProperty(actionsKey)) {
    proto[actionsKey].push(name);
  } else {
    Object.defineProperty(proto, actionsKey, { value: [name] });
  }
}
