import path from "node:path";
import { generateProtos, knowledgeBaseProtoDirPath } from '@cntx/rpc-protos';

const outDir = path.join(import.meta.dirname, "src/common/generated-proto");
generateProtos(knowledgeBaseProtoDirPath, outDir);
