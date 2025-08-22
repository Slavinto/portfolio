import { File, Rank } from "@/types/games/chess";

export class Position {
    private readonly _file: File;
    public get file(): File {
        return this._file;
    }

    private readonly _rank: Rank;
    public get rank(): Rank {
        return this._rank;
    }

    constructor(file: File, rank: Rank) {
        this._file = file;
        this._rank = rank;
    }

    public clone(): Position {
        return new Position(this._file, this._rank);
    }

    public toKey(): string {
        return `${this._file}${this._rank}`;
    }

    public equals(other: Position): boolean {
        return this._file === other._file && this._rank === other._rank;
    }
}
