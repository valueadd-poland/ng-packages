/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Analytics } from "./api";

/**
 * Analytics implementation that does nothing.
 */
export class NoopAnalytics implements Analytics {
  event() {}
  screenview() {}
  pageview() {}
  timing() {}
  flush(): Promise<void> {
    return Promise.resolve();
  }
}
