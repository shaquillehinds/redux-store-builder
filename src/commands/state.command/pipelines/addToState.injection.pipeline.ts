import InjectionPipeline, { statements } from "tscodeinject";
import checkFiles from "../../../utils/fileChecker";
import { templatePath } from "../../../utils/constants";
import src from "@src/utils/src";

interface AddToStateProps {
  state: string;
  property: string;
  propertyType: string;
  isPropertyTypeString?: boolean;
  defaultValue: any;
  addReducer: boolean;
}

export function camelToUpperSnake(str: string) {
  return str.replace(/[A-Z]/g, (letter) => `_${letter}`).toUpperCase();
}

export default async function addToState(props: AddToStateProps) {
  checkFiles();

  const stateFU = props.state[0].toUpperCase() + props.state.slice(1);
  const stateFL = props.state[0].toLowerCase() + props.state.slice(1);
  const propertyFU = props.property[0].toUpperCase() + props.property.slice(1);
  const setPropertyUS = "SET_" + camelToUpperSnake(props.property);
  console.log($lf(28), setPropertyUS);

  const reducerPipeline = new InjectionPipeline(
    src(`store/reducers/${stateFL}.reducer.ts`)
  );

  if (props.addReducer)
    reducerPipeline.injectSwitchCase(
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
    );

  reducerPipeline.injectProperty(
    { key: props.property, value: props.defaultValue },
    { name: "initialState" }
  );

  const actionTypesPipeline = reducerPipeline.parse(
    src(`store/actionTypes/${stateFL}.actionTypes.ts`)
  );

  if (props.addReducer)
    actionTypesPipeline
      .injectTSEnumMember(
        { key: setPropertyUS, value: setPropertyUS },
        { name: `${stateFU}ActionType` }
      )

      .parse(src(`store/actions/${stateFL}.action.ts`))
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
        {
          type: "union",
          stringTemplate: `Set${propertyFU}`,
          forceInject: true,
        },
        { name: `${stateFU}Action` }
      );

  const statePipeline = actionTypesPipeline
    .parse(src("@types/state.d.ts"))
    .injectTSInterfaceBody(
      {
        bodyStringTemplate: `{${props.property}: ${
          props.isPropertyTypeString
            ? `"${props.propertyType}"`
            : props.propertyType
        }}`,
      },
      { name: `${stateFU}State` }
    );

  const actionCreatorPipeline = statePipeline.parse(
    src(`store/actionCreators/${stateFL}/index.ts`)
  );

  if (props.addReducer)
    actionCreatorPipeline
      .injectImport({
        isDefault: true,
        source: `./set${propertyFU}.actionCreator`,
        importName: `set${propertyFU}`,
      })
      .injectNamedExportProperty({ name: `set${propertyFU}` })

      .injectFileFromTemplate({
        newFilePath: src(
          `store/actionCreators/${stateFL}/set${propertyFU}.actionCreator.ts`
        ),
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
      });

  const filesToOpen = [
    src(`store/actionCreators/${stateFL}/set${propertyFU}.actionCreator.ts`),
  ];
  if (props.addReducer) await actionCreatorPipeline.finish(filesToOpen);
  else await actionCreatorPipeline.finish();
}

function $lf(n: number) {
  return (
    "$lf|state.command/pipelines/addToState.injection.pipeline.ts:" + n + " >"
  );
  // Automatically injected by Log Location Injector vscode extension
}
