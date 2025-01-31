export const handleError = (error: unknown): Error => {
    if (error instanceof Error) {
        return error;
    }
    if (typeof error === "string") {
        return new Error(error);
    }
    return new Error(JSON.stringify(error));
};

export const createArrayOf = <T>(element: T, length: number): T[] => {
    let arr: T[] = [];
    for (let i = 0; i < length; i++) {
        arr.push(element);
    }
    return arr;
};
