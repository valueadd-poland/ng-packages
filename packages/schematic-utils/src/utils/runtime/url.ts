import { parse } from "url";
import { SchematicContext, Source } from "../../engine/interface";

export function url(urlString: string): Source {
  const url = parse(urlString);

  return (context: SchematicContext): any =>
    context.engine.createSourceFromUrl(url, context)(context);
}
