import fs from "fs";
import { reducersTemplate, storeTemplate } from "./constants";
import { RequiredFiles, requiredFiles } from "../@types";

type CheckFilesProps = {
  autoCreate?: RequiredFiles[];
};
export default function checkFiles(props?: CheckFilesProps) {
  for (let f of requiredFiles) {
    const file = f as RequiredFiles;
    const exists = fs.existsSync(file);
    if (exists) continue;
    if (!exists) {
      if (props?.autoCreate?.includes(file)) {
        if (file.includes(".ts")) {
          let contents = "";
          switch (file) {
            case "src/store/index.ts":
              contents = storeTemplate;
              break;
            case "src/store/reducers/index.ts":
              contents = reducersTemplate;
              break;
          }
          fs.writeFileSync(file, contents);
        } else fs.mkdirSync(file);
        continue;
      }
      throw new Error(`${file} does not exist.`);
    }
  }
}
