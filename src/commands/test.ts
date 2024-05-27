import addStateToStore from "./store.command/pipelines/addStateToStore.injection.pipeline";
import addToState from "./state.command/pipelines/addToState.injection.pipeline";

const injections = { addToState, addStateToStore };

async function runInjections() {
  await addStateToStore({ state: "machine" });

  await addToState({
    state: "machine",
    property: "someProperty",
    propertyType: "SomeInterface",
    defaultValue: { test: true },
    addReducer: false,
  });
}
runInjections();

export default injections;
