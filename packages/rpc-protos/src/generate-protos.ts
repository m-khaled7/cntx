import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const plugin = path.resolve(import.meta.dirname, "../node_modules/.bin/protoc-gen-ts_proto.cmd");

export function createPath(proto:string){
    return [
        require.resolve(`../proto/${proto}/${proto}.proto`),
        path.join(import.meta.dirname, "../proto", proto)
    ]
}

/**
 * helper function to generate TS Protobuf type using protoc, 
 * you must install protoc localy on development machine
 * @param protoDirPath dir which contian .proto files
 * @param outDirPath the out dir path of generate types (dir must be exist)
 */
export function generateProtos(protoDirPath:string, outDirPath:string) {
    const protoFiles = fs
        .readdirSync(protoDirPath)
        .filter((file) => file.endsWith(".proto"))
        .map((file) => path.join(protoDirPath, file));

    const protoc = spawn(
        'protoc',
        [
            `--plugin=protoc-gen-ts_proto=${plugin}`,
            `--ts_proto_out=${outDirPath}`,
            '--ts_proto_opt=importSuffix=.js',
            '--ts_proto_opt=nestJs=true',
            '--ts_proto_opt=outputServices=grpc-js',
            '--ts_proto_opt=esModuleInterop=true',
            '--ts_proto_opt=forceLong=number',
            '--ts_proto_opt=addGrpcMetadata=true',
            '-I',
            protoDirPath,
            ...protoFiles,
        ],
        {
            stdio: 'inherit',
        }
    );

    protoc.on("close", (code) => {
        if (code === 0) {
            console.log("Proto generation completed.");
        } else {
            console.error(`protoc exited with code ${code}`);
        }
    });

    protoc.on("error", (err) => {
        console.error("Failed to start protoc:", err);
    });
}
