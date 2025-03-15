import jcs from "jscodeshift";
import { parsers } from "tscodeinject";

function reducerStateReturnStatement(payload: { [key: string]: any }) {
  const value = parsers.objToExp(jcs, payload);
  const objExp = jcs.objectExpression([
    jcs.spreadElement(jcs.identifier("state")),
  ]);
  for (let prop in value.properties)
    objExp.properties.push(value.properties[prop]);
  return jcs.returnStatement(objExp);
}

export default reducerStateReturnStatement;
