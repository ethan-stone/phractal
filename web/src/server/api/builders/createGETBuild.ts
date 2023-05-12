import { z } from "zod";

type GETHandlerBuilderDef = {
  inputs: z.Schema[];
};

type Handler<T extends z.Schema[]> = (inputs: T) => void;

type GETHandlerBuilder<TParams extends z.Schema[]> = {
  def: GETHandlerBuilderDef;
  input: (schema: z.Schema) => GETHandlerBuilder<TParams>;
  handler: (handler: Handler<TParams>) => void;
};

function createNewGetHandlerBuilder(
  def1: GETHandlerBuilderDef,
  def2: Partial<GETHandlerBuilderDef>
) {
  return createGETHandlerBuilder({
    inputs: [...def1.inputs, ...(def2.inputs ?? [])],
  });
}

export function createGETHandlerBuilder(
  initDef: Partial<GETHandlerBuilderDef> = {}
): GETHandlerBuilder<z.Schema[]> {
  const _def = {
    inputs: [],
    ...initDef,
  } satisfies GETHandlerBuilderDef;

  return {
    def: _def,
    input(input) {
      return createNewGetHandlerBuilder(_def, {
        inputs: [input],
      });
    },
    handler(handler: Handler) {
      return;
    },
  };
}

const builder = createGETHandlerBuilder();
const a = builder.input(z.string());
const b = a.input(z.number());
