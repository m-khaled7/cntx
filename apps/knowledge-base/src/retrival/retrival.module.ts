import { Module } from "@nestjs/common";
import { RetrivalController } from "./retrival.controller.js";
import { RetrivalService } from "./retrival.service.js";

@Module({controllers:[RetrivalController],
    providers:[RetrivalService]
})
export class RetrivalModule{

}