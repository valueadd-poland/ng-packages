import { normalize } from "@angular-devkit/core";
import { forEach } from "./base";
import { FilePredicate } from "../../tree/interface";
import { Rule } from "../../engine/interface";

export function rename(
  match: FilePredicate<boolean>,
  to: FilePredicate<string>
): Rule {
  return forEach((entry) => {
    if (match(entry.path, entry)) {
      return {
        content: entry.content,
        path: normalize(to(entry.path, entry)),
      };
    } else {
      return entry;
    }
  });
}
