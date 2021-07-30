import {
  basename,
  dirname,
  join,
  normalize,
  Path,
} from "../../virtual-fs/path";

export interface Location {
  name: string;
  path: Path;
}

export function parseName(path: string, name: string): Location {
  const nameWithoutPath = basename(normalize(name));
  const namePath = dirname(join(normalize(path), name));

  return {
    name: nameWithoutPath,
    path: normalize("/" + namePath),
  };
}
