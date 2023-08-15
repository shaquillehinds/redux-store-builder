import InjectionPipeline, { statements } from "tscodeinject";
import checkFiles from "../../../utils/fileChecker";
import { templatePath } from "../../../utils/constants";

interface AddToStateProps {
  state: string;
  property: string;
  propertyType: string;
  isPropertyTypeString?: boolean;
  defaultValue: any;
}

export function camelToUpperSnake(str: string) {
  return str
    .replace(/[A-Z]/g, (letter) => `${letter.toUpperCase()}`)
    .toUpperCase();
}

export default async function addToState(props: AddToStateProps) {
  checkFiles();

  const stateFU = props.state[0].toUpperCase() + props.state.slice(1);
  const stateFL = props.state[0].toLowerCase() + props.state.slice(1);
  const propertyFU = props.property[0].toUpperCase() + props.property.slice(1);
  const setPropertyUS = "SET_" + camelToUpperSnake(props.property);
  console.log(setPropertyUS);

  await new InjectionPipeline(`src/store/reducers/${stateFL}.reducer.ts`)
    .injectSwitchCase(
      {
        caseName: `${stateFU}ActionType.${setPropertyUS}`,
        statements: [
          statements.reducerStateReturnStatement({
            [props.property]: "action.payload@jcs.identifier",
          }),
        ],
        identifier: true,
      },
      { name: "action.type" }
    )
    .injectProperty(
      { key: props.property, value: props.defaultValue },
      { name: "initialState" }
    )

    .parse(`src/store/actionTypes/${stateFL}.actionTypes.ts`)
    .injectTSEnumMember(
      { key: setPropertyUS, value: setPropertyUS },
      { name: `${stateFU}ActionType` }
    )

    .parse(`src/store/actions/${stateFL}.action.ts`)
    .injectStringTemplate({
      template: `

interface Set${propertyFU} {
  type: ${stateFU}ActionType.${setPropertyUS};
  payload: ${
    props.isPropertyTypeString ? `"${props.propertyType}"` : props.propertyType
  };
}

  `,
    })
    .injectTSTypeAlias(
      { type: "union", stringTemplate: `Set${propertyFU}`, forceInject: true },
      { name: `${stateFU}Action` }
    )

    .parse("src/@types/state.d.ts")
    .injectTSInterfaceBody(
      {
        bodyStringTemplate: `{${props.property}: ${
          props.isPropertyTypeString
            ? `"${props.propertyType}"`
            : props.propertyType
        }}`,
      },
      { name: `${stateFU}State` }
    )

    .parse(`src/store/actionCreators/${stateFL}/index.ts`)
    .injectImport({
      isDefault: true,
      source: `./set${propertyFU}.actionCreator`,
      importName: `set${propertyFU}`,
    })
    .injectNamedExportProperty({ name: `set${propertyFU}` })

    .injectFileFromTemplate({
      newFilePath: `src/store/actionCreators/${stateFL}/set${propertyFU}.actionCreator.ts`,
      templatePath: templatePath("actionCreator"),
      replaceKeywords: [
        {
          keyword: "{{payload}}",
          replacement: props.isPropertyTypeString
            ? `'${props.propertyType}'`
            : props.propertyType,
        },
        { keyword: "{{state}}", replacement: stateFU },
        { keyword: "{{actionType}}", replacement: setPropertyUS },
        { keyword: "{{functionName}}", replacement: `set${propertyFU}` },
      ],
    })
    .finish([
      `src/store/actionCreators/${stateFL}/set${propertyFU}.actionCreator.ts`,
    ]);
}
