import inquirer from "inquirer";

const type = async () =>
  (
    await inquirer.prompt({
      name: "propertyType",
      type: "input",
      message: "What is the typescript type of this property?",
    })
  ).propertyType;

const defaultValue = async () =>
  (
    await inquirer.prompt({
      name: "defaultValue",
      type: "input",
      message: "What is the default value of this propertyz?",
    })
  ).defaultValue;

const addToStatePrompts = { type, defaultValue };

export default addToStatePrompts;
