export const logicHandler = async (data: Record<string, any>, context: Record<string, any>, userId: string) => {

    const {
        condition,
    } = data;

    if (!condition || typeof condition !== "string") {
        throw new Error("Missing or invalid condition!");
    }

    try {
        const evaluated = new Function(`return (${condition})`)();
        return { result: !!evaluated };
    } catch (error: any) {
        throw new Error(`Failed to evaluate condition: ${error.message}`);
    }


}