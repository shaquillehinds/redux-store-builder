import inquirer from "inquirer";

const type = async () =>
  (
    await inquirer.prompt({
      name: "propertyType",
      type: "input",
      message: "What is the typescript type of this property?",
    })
  ).propertyType;

const propertyName = async () =>
  (
    await inquirer.prompt({
      name: "propertyName",
      type: "input",
      message: "What is the name of this property?",
    })
  ).propertyName;

const defaultValue = async () =>
  (
    await inquirer.prompt({
      name: "defaultValue",
      type: "input",
      message: "What is the default value of this propertyz?",
    })
  ).defaultValue;

const stateAction = async () =>
  (
    await inquirer.prompt({
      name: "stateAction",
      type: "list",
      message: "What action would you like to perform on the state?",
      default: 0,
      loop: true,
      choices: [{ value: "add", name: "Add property to state" }],
    })
  ).stateAction;

const addToStatePrompts = { type, defaultValue, stateAction, propertyName };

export default addToStatePrompts;
