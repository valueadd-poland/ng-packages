import { FileEntry } from "./interface";
import { Path } from "../virtual-fs";

export class SimpleFileEntry implements FileEntry {
  constructor(private _path: Path, private _content: Buffer) {}

  get path(): Path {
    return this._path;
  }
  get content(): Buffer {
    return this._content;
  }
}

export class LazyFileEntry implements FileEntry {
  private _content: Buffer | null = null;

  constructor(private _path: Path, private _load: (path?: Path) => Buffer) {}

  get path(): Path {
    return this._path;
  }
  get content(): Buffer {
    return this._content || (this._content = this._load(this._path));
  }
}
