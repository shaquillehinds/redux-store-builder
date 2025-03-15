import { InjectionPipeline } from "tscodeinject";
import checkFiles from "../../../utils/fileChecker";
import { templatePath } from "../../../utils/constants";
import src from "@src/utils/src";
import { RequiredFiles } from "@src/@types";

interface AddToStoreProps {
  state: string;
}

export default async function addStateToStore(props: AddToStoreProps) {
  checkFiles({
    autoCreate: [
      src("@types") as RequiredFiles,
      src("@types/state.d.ts") as RequiredFiles,
    ],
  });

  const stateTrimmed = props.state.trim();
  const State = stateTrimmed[0].toUpperCase() + stateTrimmed.slice(1);
  const state = stateTrimmed[0].toLowerCase() + stateTrimmed.slice(1);
  //@ts-ignore
  await new InjectionPipeline(src("@types/state.d.ts"))
    .injectStringTemplate({
      template: `
    interface ${State}State {}
    `,
    })
    .injectFileFromTemplate({
      newFilePath: src(`store/reducers/${state}.reducer.ts`),
      templatePath: templatePath("reducer"),
      replaceKeywords: [
        { keyword: "{{Name}}", replacement: State },
        { keyword: "{{name}}", replacement: state },
      ],
    })
    .parse(src("store/reducers/index.ts"))
    .injectImport({
      importName: `${state}Reducer`,
      source: `./${state}.reducer`,
      isDefault: true,
    })
    .injectProperty(
      { property: { key: state, value: `${state}Reducer@jcs.identifier` } },
      { name: "reducers" }
    )
    .injectFileFromTemplate({
      newFilePath: src(`store/actionTypes/${state}.actionTypes.ts`),
      templatePath: templatePath("actionTypes"),
      replaceKeywords: [{ keyword: "{{Name}}", replacement: State }],
    })
    .parse(src("store/actionTypes/index.ts"))
    .injectStringTemplate({
      template: `export * from "./${state}.actionTypes"`,
    })
    .parse(src("store/actions/index.ts"))
    .injectStringTemplate({
      template: `export * from "@store/actions/${state}.action"`,
    })
    .injectFileFromTemplate({
      newFilePath: src(`store/actions/${state}.action.ts`),
      templatePath: templatePath("action"),
      replaceKeywords: [{ keyword: "{{Name}}", replacement: State }],
    })
    .injectDirectory(src(`store/actionCreators/${state}`))
    .injectFileFromTemplate({
      newFilePath: src(`store/actionCreators/${state}/index.ts`),
      templatePath: templatePath("actionCreator.index"),
      replaceKeywords: [],
    })
    .parse(src("store/actionCreators/index.ts"))
    .injectStringTemplate({
      template: `export * from "./${state}"`,
    })
    .finish();
}
