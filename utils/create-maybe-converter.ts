type CreateMaybeConvertResult<A, Z> = (a: A | undefined) => Z | undefined;

export function createMaybeConverter<A, Z>(
  cb: (a: A) => Z
): CreateMaybeConvertResult<A, Z> {
  return (a: A | undefined) => {
    if (a) return cb(a);
    else return undefined;
  };
}
