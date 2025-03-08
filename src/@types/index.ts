export type YesOrNo = "Yes" | "No";

export const requiredFiles = [
  "@types",
  "@types/state.d.ts",
  "store",
  "store/actionCreators",
  "store/actionCreators/index.ts",
  "store/actions",
  "store/actions/index.ts",
  "store/actionTypes",
  "store/actionTypes/index.ts",
  "store/middleware",
  "store/reducers",
  "store/reducers/index.ts",
  "store/index.ts",
] as const;

export type RequiredFiles = (typeof requiredFiles)[number];
