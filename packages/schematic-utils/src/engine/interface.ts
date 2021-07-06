import { analytics, logging } from "@angular-devkit/core";
import { Observable } from "rxjs";
import { Url } from "url";
import { FileEntry, MergeStrategy, Tree } from "../tree/interface";
import { Workflow } from "../workflow/interface";

export interface TaskConfiguration<T = any> {
  name: string;
  dependencies?: Array<TaskId>;
  options?: T;
}

export interface TaskConfigurationGenerator<T = any> {
  toConfiguration(): TaskConfiguration<T>;
}

export type TaskExecutor<T = any> = (
  options: T | undefined,
  context: SchematicContext
) => Promise<void> | Observable<void>;

export interface TaskExecutorFactory<T> {
  readonly name: string;
  create(options?: T): Promise<TaskExecutor> | Observable<TaskExecutor>;
}

export interface TaskId {
  readonly id: number;
}

export interface TaskInfo {
  readonly id: number;
  readonly priority: number;
  readonly configuration: TaskConfiguration;
  readonly context: SchematicContext;
}

export interface ExecutionOptions {
  scope: string;
  interactive: boolean;
}

/**
 * The description (metadata) of a collection. This type contains every information the engine
 * needs to run. The CollectionMetadataT type parameter contains additional metadata that you
 * want to store while remaining type-safe.
 */
export type CollectionDescription<CollectionMetadataT> = CollectionMetadataT & {
  readonly name: string;
  readonly extends?: string[];
};

/**
 * The description (metadata) of a schematic. This type contains every information the engine
 * needs to run. The SchematicMetadataT and CollectionMetadataT type parameters contain additional
 * metadata that you want to store while remaining type-safe.
 */
export type SchematicDescription<
  CollectionMetadataT,
  SchematicMetadataT
> = SchematicMetadataT & {
  readonly collection: CollectionDescription<CollectionMetadataT>;
  readonly name: string;
  readonly private?: boolean;
  readonly hidden?: boolean;
};

/**
 * The Host for the Engine. Specifically, the piece of the tooling responsible for resolving
 * collections and schematics descriptions. The SchematicMetadataT and CollectionMetadataT type
 * parameters contain additional metadata that you want to store while remaining type-safe.
 */
export interface EngineHost<
  CollectionMetadataT extends any,
  SchematicMetadataT extends any
> {
  createCollectionDescription(
    name: string,
    requester?: CollectionDescription<CollectionMetadataT>
  ): CollectionDescription<CollectionMetadataT>;
  listSchematicNames(
    collection: CollectionDescription<CollectionMetadataT>
  ): string[];

  createSchematicDescription(
    name: string,
    collection: CollectionDescription<CollectionMetadataT>
  ): SchematicDescription<CollectionMetadataT, SchematicMetadataT> | null;
  getSchematicRuleFactory<OptionT extends any>(
    schematic: SchematicDescription<CollectionMetadataT, SchematicMetadataT>,
    collection: CollectionDescription<CollectionMetadataT>
  ): RuleFactory<OptionT>;
  createSourceFromUrl(
    url: Url,
    context: TypedSchematicContext<CollectionMetadataT, SchematicMetadataT>
  ): Source | null;
  transformOptions<OptionT, ResultT>(
    schematic: SchematicDescription<CollectionMetadataT, SchematicMetadataT>,
    options: OptionT,
    context?: TypedSchematicContext<CollectionMetadataT, SchematicMetadataT>
  ): Observable<ResultT>;
  transformContext(
    context: TypedSchematicContext<CollectionMetadataT, SchematicMetadataT>
  ): TypedSchematicContext<CollectionMetadataT, SchematicMetadataT> | void;
  createTaskExecutor(name: string): Observable<TaskExecutor>;
  hasTaskExecutor(name: string): boolean;

  readonly defaultMergeStrategy?: MergeStrategy;
}

/**
 * The root Engine for creating and running schematics and collections. Everything related to
 * a schematic execution starts from this interface.ts.
 *
 * CollectionMetadataT is, by default, a generic Collection metadata type. This is used throughout
 * the engine typings so that you can use a type that's merged into descriptions, while being
 * type-safe.
 *
 * SchematicMetadataT is a type that contains additional typing for the Schematic Description.
 */
export interface Engine<
  CollectionMetadataT extends any,
  SchematicMetadataT extends any
> {
  createCollection(
    name: string,
    requester?: Collection<CollectionMetadataT, SchematicMetadataT>
  ): Collection<CollectionMetadataT, SchematicMetadataT>;
  createContext(
    schematic: Schematic<CollectionMetadataT, SchematicMetadataT>,
    parent?: Partial<
      TypedSchematicContext<CollectionMetadataT, SchematicMetadataT>
    >,
    executionOptions?: Partial<ExecutionOptions>
  ): TypedSchematicContext<CollectionMetadataT, SchematicMetadataT>;
  createSchematic(
    name: string,
    collection: Collection<CollectionMetadataT, SchematicMetadataT>
  ): Schematic<CollectionMetadataT, SchematicMetadataT>;
  createSourceFromUrl(
    url: Url,
    context: TypedSchematicContext<CollectionMetadataT, SchematicMetadataT>
  ): Source;
  transformOptions<OptionT extends any, ResultT extends any>(
    schematic: Schematic<CollectionMetadataT, SchematicMetadataT>,
    options: OptionT,
    context?: TypedSchematicContext<CollectionMetadataT, SchematicMetadataT>
  ): Observable<ResultT>;
  executePostTasks(): Observable<void>;

  readonly defaultMergeStrategy: MergeStrategy;
  readonly workflow: Workflow | null;
}

/**
 * A Collection as created by the Engine. This should be used by the tool to create schematics,
 * or by rules to create other schematics as well.
 */
export interface Collection<
  CollectionMetadataT extends any,
  SchematicMetadataT extends any
> {
  readonly description: CollectionDescription<CollectionMetadataT>;
  readonly baseDescriptions?: Array<CollectionDescription<CollectionMetadataT>>;

  createSchematic(
    name: string,
    allowPrivate?: boolean
  ): Schematic<CollectionMetadataT, SchematicMetadataT>;
  listSchematicNames(): string[];
}

/**
 * A Schematic as created by the Engine. This should be used by the tool to execute the main
 * schematics, or by rules to execute other schematics as well.
 */
export interface Schematic<
  CollectionMetadataT extends any,
  SchematicMetadataT extends any
> {
  readonly description: SchematicDescription<
    CollectionMetadataT,
    SchematicMetadataT
  >;
  readonly collection: Collection<CollectionMetadataT, SchematicMetadataT>;

  call<OptionT extends any>(
    options: OptionT,
    host: Observable<Tree>,
    parentContext?: Partial<
      TypedSchematicContext<CollectionMetadataT, SchematicMetadataT>
    >,
    executionOptions?: Partial<ExecutionOptions>
  ): Observable<Tree>;
}

/**
 * A SchematicContext. Contains information necessary for Schematics to execute some rules, for
 * example when using another schematics, as we need the engine and collection.
 */
export interface TypedSchematicContext<
  CollectionMetadataT extends any,
  SchematicMetadataT extends any
> {
  readonly debug: boolean;
  readonly engine: Engine<CollectionMetadataT, SchematicMetadataT>;
  readonly logger: logging.LoggerApi;
  readonly schematic: Schematic<CollectionMetadataT, SchematicMetadataT>;
  readonly strategy: MergeStrategy;
  readonly interactive: boolean;
  addTask<T>(
    task: TaskConfigurationGenerator<T>,
    dependencies?: Array<TaskId>
  ): TaskId;

  // This might be undefined if the feature is unsupported.
  /** @deprecated since version 11 - as it's unused. */
  readonly analytics?: analytics.Analytics;
}

/**
 * This is used by the Schematics implementations in order to avoid needing to have typing from
 * the tooling. Schematics are not specific to a tool.
 */
export type SchematicContext = TypedSchematicContext<any, any>;

/**
 * A rule factory, which is normally the way schematics are implemented. Returned by the tooling
 * after loading a schematic description.
 */
export type RuleFactory<T extends any> = (options: T) => Rule;

/**
 * A FileOperator applies changes synchronously to a FileEntry. An async operator returns
 * asynchronously. We separate them so that the type system can catch early errors.
 */
export type FileOperator = (entry: FileEntry) => FileEntry | null;
export type AsyncFileOperator = (
  tree: FileEntry
) => Observable<FileEntry | null>;

/**
 * A source is a function that generates a Tree from a specific context. A rule transforms a tree
 * into another tree from a specific context. In both cases, an Observable can be returned if
 * the source or the rule are asynchronous. Only the last Tree generated in the observable will
 * be used though.
 *
 * We obfuscate the context of Source and Rule because the schematic implementation should not
 * know which types is the schematic or collection metadata, as they are both tooling specific.
 */
export type Source = (context: SchematicContext) => Tree | Observable<Tree>;
export type Rule = (
  tree: Tree,
  context: SchematicContext
) => Tree | Observable<Tree> | Rule | Promise<void | Rule> | void;
