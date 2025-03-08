import fs from "fs";
import { reducersTemplate, storeTemplate } from "./constants";
import { RequiredFiles, requiredFiles } from "../@types";
import src from "./src";

type CheckFilesProps = {
  autoCreate?: RequiredFiles[];
};
export default function checkFiles(props?: CheckFilesProps) {
  for (let f of requiredFiles) {
    const file = f as RequiredFiles;
    const exists = fs.existsSync(src(file));
    if (exists) continue;
    if (!exists) {
      if (props?.autoCreate?.includes(src(file) as RequiredFiles)) {
        if (src(file).includes(".ts")) {
          let contents = "";
          switch (src(file)) {
            case src("store/index.ts"):
              contents = storeTemplate;
              break;
            case src("store/reducers/index.ts"):
              contents = reducersTemplate;
              break;
          }
          fs.writeFileSync(src(file), contents);
        } else fs.mkdirSync(src(file));
        continue;
      }
      throw new Error(`${src(file)} does not exist.`);
    }
  }
}
