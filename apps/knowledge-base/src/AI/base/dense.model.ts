export abstract class DenseModel {
    abstract generateDenseVectors(text: string[]):Promise<number[][]|undefined>;
}