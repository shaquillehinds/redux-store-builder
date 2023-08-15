export type YesOrNo = "Yes" | "No";

export const requiredFiles = [
  "src",
  "src/@types",
  "src/@types/state.d.ts",
  "src/store",
  "src/store/actionCreators",
  "src/store/actionCreators/index.ts",
  "src/store/actions",
  "src/store/actions/index.ts",
  "src/store/actionTypes",
  "src/store/actionTypes/index.ts",
  "src/store/middleware",
  "src/store/reducers",
  "src/store/reducers/index.ts",
  "src/store/index.ts",
] as const;

export type RequiredFiles = (typeof requiredFiles)[number];
