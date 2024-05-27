import { Command } from "commander";
import addToState from "./pipelines/addToState.injection.pipeline";
import prompts from "./state.prompts";

export default function stateCommand(program: Command) {
  program
    .command("state <name>")
    .description("Modifies a redux state")
    // dash syntax resolves to camel case --first-name=firstName except for --no-<something> which resolves to the word after no
    .option("-a --add <string>", "Adds a property to the redux state")
    // if an argument is NOT specified in the option signature then it defaults to a boolean value
    // if the option is passed when the command called then the default of the option will be false
    // adding --no-<something> will change the default of an unused option to be true
    .option(
      "-R --no-reducer",
      "Disables adding the reducer and action creators"
    )
    .action(async (state, opts) => {
      console.log(opts);
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
          addReducer: opts.reducer,
        });
      }
      process.exit(0);
    });
}
