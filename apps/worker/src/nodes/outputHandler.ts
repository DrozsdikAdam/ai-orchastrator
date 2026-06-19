export const outputHandler = (data: Record<string, any>, context: Record<string, any>, userId: string) => {
    const { outputVariable, outputFormat = "text" } = data;

    if (!outputVariable) {
        throw new Error("Missing output variable.");
    }
    var output;
    try {
        switch (outputFormat) {
            case "text":
                output = String(outputVariable);
                break;
            case "json":
                output = typeof outputVariable === "string" ?
                    JSON.parse(outputVariable) :
                    outputVariable;
                break;
            case "html":
                output = "<div>" + String(outputVariable) + "</div>";
                break;
            case "list":
                output = Array.isArray(outputVariable) ?
                    outputVariable.map((v: string) => v.trim()) :
                    outputVariable.toString().split(",").map((v: string) => v.trim());

                break;
            default: throw new Error("Invalid output format.");
        }
    } catch (error) {
        throw new Error("Failed to format output. " + error)
    }
    return { ok: true, output: output, format: outputFormat };
}