import type { AuthUser } from "../types";

export type AuthState = {
  user: AuthUser | null;
  isLoggedIn: boolean;
};

const intialState: AuthState = { user: null, isLoggedIn: false };

type AuthAction =
  | { type: "LOGIN"; payload: AuthUser }
  | { type: "LOGOUT" };

export const AuthReducer = (
  state: AuthState = intialState,
  action: AuthAction | { type: string }
): AuthState => {
  switch (action.type) {
    case "LOGIN":
      if (!("payload" in action)) return state;
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
      };
    case "LOGOUT":
      return intialState;
    default:
      return state;
  }
};
