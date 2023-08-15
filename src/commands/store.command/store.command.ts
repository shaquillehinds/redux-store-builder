import { Command } from "commander";
import addStateToStore from "./pipelines/addStateToStore.injection.pipeline";
import prompts from "./store.prompts";

export default function storeCommand(program: Command) {
  program
    .command("store <add|remove> <nameOfState>")
    .description("Modifies the redux store")
    // dash syntax resolves to camel case --first-name=firstName
    // .option("-s --state <string>", "Name of redux state")
    .action(async (type, state) => {
      console.log(state);
      if (type === "add") {
        if (state) {
          await addStateToStore({ state });
        }
      } else if (type === "remove") {
      }

      process.exit(0);
    });
}
