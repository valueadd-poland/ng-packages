import { Observable, of as observableOf } from "rxjs";
import { last, map } from "rxjs/operators";
import {
  ExecutionOptions,
  Rule,
  SchematicContext,
} from "../../engine/interface";
import { MergeStrategy, Tree } from "../../tree/interface";
import { branch } from "../../tree/static";

/**
 * Run a schematic from a separate collection.
 *
 * @param collectionName The name of the collection that contains the schematic to run.
 * @param schematicName The name of the schematic to run.
 * @param options The options to pass as input to the RuleFactory.
 */
export function externalSchematic<OptionT extends any>(
  collectionName: string,
  schematicName: string,
  options: OptionT,
  executionOptions?: Partial<ExecutionOptions>
): Rule {
  return (input: Tree, context: SchematicContext): Observable<Tree> => {
    const collection = context.engine.createCollection(
      collectionName,
      context.schematic.collection
    );
    const schematic = collection.createSchematic(schematicName);

    return schematic
      .call(options, observableOf(branch(input)), context, executionOptions)
      .pipe(
        last(),
        map((x) => {
          input.merge(x, MergeStrategy.AllowOverwriteConflict);

          return input;
        })
      );
  };
}

/**
 * Run a schematic from the same collection.
 *
 * @param schematicName The name of the schematic to run.
 * @param options The options to pass as input to the RuleFactory.
 */
export function schematic<OptionT extends any>(
  schematicName: string,
  options: OptionT,
  executionOptions?: Partial<ExecutionOptions>
): Rule {
  return (input: Tree, context: SchematicContext): Observable<Tree> => {
    const collection = context.schematic.collection;
    const schematic = collection.createSchematic(schematicName, true);

    return schematic
      .call(options, observableOf(branch(input)), context, executionOptions)
      .pipe(
        last(),
        map((x) => {
          // We allow overwrite conflict here because they're the only merge conflict we particularly
          // don't want to deal with; the input tree might have an OVERWRITE which the sub
          input.merge(x, MergeStrategy.AllowOverwriteConflict);

          return input;
        })
      );
  };
}
