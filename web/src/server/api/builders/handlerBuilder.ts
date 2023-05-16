import { z } from "zod";

type HandlerBuilderDef = {
  inputs: z.Schema[];
};

type HandlerParams<TInputIn = unknown, TInputOut = unknown> = {
  _input_in: TInputIn;
  _input_out: TInputOut;
};

type Handler<T extends z.Schema[]> = (inputs: T) => void;

type HandlerBuilder<TParams extends z.Schema[]> = {
  def: HandlerBuilderDef;
  input: (schema: z.Schema) => HandlerBuilder<TParams>;
  handler: (handler: Handler<TParams>) => void;
};

function createHandler(_def: HandlerBuilderDef, handler: Handler) {}

function createNewHandlerBuilder(
  def1: HandlerBuilderDef,
  def2: Partial<HandlerBuilderDef>
) {
  return createHandlerBuilder({
    inputs: [...def1.inputs, ...(def2.inputs ?? [])],
  });
}

export function createHandlerBuilder(
  initDef: Partial<HandlerBuilderDef> = {}
): HandlerBuilder<z.Schema[]> {
  const _def = {
    inputs: [],
    ...initDef,
  } satisfies HandlerBuilderDef;

  return {
    def: _def,
    input(input) {
      return createNewHandlerBuilder(_def, {
        inputs: [input],
      });
    },
    handler(handler: Handler) {
      return;
    },
  };
}

const builder = createHandlerBuilder();
const a = builder.input(z.string());
const b = a.input(z.number());
