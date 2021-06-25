export interface TemplateTag<R = string> {
  // Any is the only way here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (template: TemplateStringsArray, ...substitutions: any[]): R;
}

export function oneLine(
  strings: TemplateStringsArray,
  ...values: any[]
): string {
  const endResult = String.raw(strings, ...values);

  return endResult.replace(/(?:\r?\n(?:\s*))+/gm, " ").trim();
}

export function indentBy(indentations: number): TemplateTag {
  let i = "";
  while (indentations--) {
    i += " ";
  }

  return (strings, ...values): string => {
    return i + stripIndent(strings, ...values).replace(/\n/g, "\n" + i);
  };
}

export function stripIndent(
  strings: TemplateStringsArray,
  ...values: any[]
): string {
  const endResult = String.raw(strings, ...values);

  // remove the shortest leading indentation from each line
  const match = endResult.match(/^[ \t]*(?=\S)/gm);

  // return early if there's nothing to strip
  if (match === null) {
    return endResult;
  }

  const indent = Math.min(...match.map((el) => el.length));
  const regexp = new RegExp("^[ \\t]{" + indent + "}", "gm");

  return (indent > 0 ? endResult.replace(regexp, "") : endResult).trim();
}

export function stripIndents(
  strings: TemplateStringsArray,
  ...values: any[]
): string {
  return String.raw(strings, ...values)
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

export function trimNewlines(
  strings: TemplateStringsArray,
  ...values: any[]
): string {
  const endResult = String.raw(strings, ...values);

  return (
    endResult
      // Remove the newline at the start.
      .replace(/^(?:\r?\n)+/, "")
      // Remove the newline at the end and following whitespace.
      .replace(/(?:\r?\n(?:\s*))$/, "")
  );
}
