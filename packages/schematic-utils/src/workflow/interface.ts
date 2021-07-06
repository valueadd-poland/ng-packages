import { Observable } from "rxjs";
import { logging } from "@angular-devkit/core";

export interface RequiredWorkflowExecutionContext {
  collection: string;
  schematic: string;
  options: any;
}

export interface WorkflowExecutionContext
  extends RequiredWorkflowExecutionContext {
  debug: boolean;
  logger: logging.Logger;
  parentContext?: Readonly<WorkflowExecutionContext>;
  allowPrivate?: boolean;
}

export interface Workflow {
  readonly context: Readonly<WorkflowExecutionContext>;

  execute(
    options: Partial<WorkflowExecutionContext> &
      RequiredWorkflowExecutionContext
  ): Observable<void>;
}
