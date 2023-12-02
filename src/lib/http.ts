import {z} from 'zod';

type fetchArgs = Parameters<typeof fetch>;

export async function fetchJSON<T extends z.ZodTypeAny>(
  schema: T,
  ...args: fetchArgs
): Promise<z.infer<T>> {
  const res = await fetch(...args);
  const json = await res.json();

  return schema.parse(json);
}
