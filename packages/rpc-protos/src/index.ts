import { createPath } from "./generate-protos.js";
export * from "./generate-protos.js";

export const [iamProtoPath,iamProtoDirPath] = createPath("iam")
export const [assetsProtoPath, assetsProtoDirPath] = createPath('assets');
