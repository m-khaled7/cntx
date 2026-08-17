import { createPath } from "./generate-protos.js";
export * from "./generate-protos.js";

export const [iamProtoPath,iamProtoDirPath] = createPath("iam")
export const [assetsProtoPath, assetsProtoDirPath] = createPath('assets');
export const [knowledgeBaseProtoPath, knowledgeBaseProtoDirPath] = createPath('knowledge-base');
export const [aiProtoPath, aiProtoDirPath] = createPath('ai');

