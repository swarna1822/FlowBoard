import { combineReducers, createStore } from "redux";
import { AuthReducer } from "./Authreducer";
import { boardReducer } from "./boardReducer";

const rootReducer = combineReducers({
  auth: AuthReducer,
  board: boardReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const devTools = (window as Window & { __REDUX_DEVTOOLS_EXTENSION__?: () => unknown })
  .__REDUX_DEVTOOLS_EXTENSION__?.();

export const store = createStore(rootReducer, devTools);
