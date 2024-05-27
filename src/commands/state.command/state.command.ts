import { Command } from "commander";
import addToState from "./pipelines/addToState.injection.pipeline";
import prompts from "./state.prompts";

export default function stateCommand(program: Command) {
  program
    .command("state <name>")
    .description("Modifies a redux state")
    // dash syntax resolves to camel case --first-name=firstName
    .option("-a --add <string>", "Adds a property to the redux state")
    .action(async (state, opts) => {
      if (!opts || !opts.add) {
        const stateAction = await prompts.stateAction();
        if (stateAction === "add") opts.add = await prompts.propertyName();
      }
      if (opts.add) {
        const propertyType = await prompts.type();
        const defaultValue = await prompts.defaultValue();
        await addToState({
          state,
          property: opts.add,
          propertyType,
          defaultValue,
        });
      }
      process.exit(0);
    });
}
