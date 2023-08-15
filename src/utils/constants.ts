import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(join(__filename, "../"));

export const templatePath = (name: string) =>
  `${__dirname}/templates/${name}.template`;

export const reducersTemplate = `import { combineReducers } from 'redux';

const reducers = combineReducers({ });

export type State = ReturnType<typeof reducers>;

export default reducers;
`;

export const storeTemplate = `import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers, { State } from './reducers';

export * as actionCreators from './actionCreators';

export const store = createStore(
  reducers,
  {},
  applyMiddleware<{}, State>(thunk),
);

export type Store = typeof store;
export type StoreDispatch = typeof store.dispatch;
`;
