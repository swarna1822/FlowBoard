import { combineReducers, createStore, type StoreEnhancer } from "redux";
import { AuthReducer } from "./Authreducer";
import { boardReducer } from "./boardReducer";

const rootReducer = combineReducers({
  auth: AuthReducer,
  board: boardReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const enhancer = (
  window as Window & { __REDUX_DEVTOOLS_EXTENSION__?: () => StoreEnhancer }
).__REDUX_DEVTOOLS_EXTENSION__?.();

export const store = createStore(rootReducer, enhancer);
