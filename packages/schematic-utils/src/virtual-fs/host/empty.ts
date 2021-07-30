/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Observable, of, throwError } from "rxjs";
import { Path, PathFragment } from "../path";
import { FileBuffer, HostCapabilities, ReadonlyHost, Stats } from "./interface";
import { FileDoesNotExistException } from "../../exceptions/exception";

export class Empty implements ReadonlyHost {
  readonly capabilities: HostCapabilities = {
    synchronous: true,
  };

  read(path: Path): Observable<FileBuffer> {
    return throwError(new FileDoesNotExistException(path));
  }

  // @ts-ignore
  list(path: Path): Observable<PathFragment[]> {
    return of([]);
  }

  // @ts-ignore
  exists(path: Path): Observable<boolean> {
    return of(false);
  }

  // @ts-ignore
  isDirectory(path: Path): Observable<boolean> {
    return of(false);
  }

  // @ts-ignore
  isFile(path: Path): Observable<boolean> {
    return of(false);
  }

  // @ts-ignore
  stat(path: Path): Observable<Stats<{}> | null> {
    // We support stat() but have no file.
    return of(null);
  }
}
