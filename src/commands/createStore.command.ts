//$lf-ignore
import { Command } from "commander";
import fs from "fs";
import cp from "child_process";
import checkFiles from "../utils/fileChecker";
import { RequiredFiles, requiredFiles } from "../@types";
import chalk from "chalk";
import src from "@src/utils/src";

export default function createStoreCommand(program: Command) {
  program
    .command("create")
    .description("Creates the redux store")
    .action(async () => {
      if (fs.existsSync(src("store/index.ts")))
        throw new Error("Store already created");
      checkFiles({
        autoCreate: requiredFiles.map((rf) =>
          src(rf)
        ) as unknown as RequiredFiles[],
      });
      const packageJSON = fs.readFileSync("package.json", "utf-8");
      let hasRedux = false;
      let hasThunk = false;
      let isReact = true;
      let hasReactRedux = false;
      if (packageJSON.includes(`"redux"`)) hasRedux = true;
      if (packageJSON.includes(`"redux-thunk"`)) hasThunk = true;
      if (packageJSON.includes(`"react"`)) isReact = true;
      if (isReact && packageJSON.includes(`"react-redux"`))
        hasReactRedux = true;
      if (hasRedux && hasThunk && ((isReact && hasReactRedux) || !isReact))
        process.exit(0);
      if (isReact) {
        let exists = fs.existsSync(src("hooks"));
        if (!exists) fs.mkdirSync(src("hooks"));
        exists = fs.existsSync(src("hooks/useTypedSelector.ts"));
        if (!exists)
          fs.writeFileSync(
            src("hooks/useTypedSelector.ts"),
            `import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { State } from '../store/reducers';
        
export const useTypedSelector: TypedUseSelectorHook<State> = useSelector;
`,
            "utf-8"
          );
      }
      const isYarn = fs.existsSync("yarn.lock");
      const command = `${isYarn ? "yarn add" : "npm install"}${
        !hasRedux ? " redux" : ""
      }${!hasThunk ? " redux-thunk" : ""}${
        isReact && !hasReactRedux ? " react-redux" : ""
      }`;
      console.log(chalk.cyanBright(`Running command: ${command}`));
      cp.execSync(command, { encoding: "utf-8", stdio: "inherit" });
      process.exit(0);
    });
}
