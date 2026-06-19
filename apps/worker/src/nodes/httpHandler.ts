export const httpHandler = async (data: Record<string, any>, context: Record<string, any>, userId: string) => {
    const { url, method = "GET", headers, body } = data;
    let parsedHeaders: Record<string, string> = {};

    if (!url || typeof url !== "string") {
        throw new Error("Missing or invalid url.");
    }
    if (headers && typeof headers !== "string") {
        throw new Error("Invalid headers.");
    }
    if (body && typeof body !== "string") {
        throw new Error("Invalid body.");
    }

    try {
        parsedHeaders = headers ? JSON.parse(headers) : {};
    } catch (error: any) {
        throw new Error(`Invalid headers JSON format: ${error.message}`);
    }

    const methodUpper = method.toUpperCase();

    if (methodUpper === "GET" || methodUpper === "HEAD") {
        if (body) {
            throw new Error(`Unexpected body for ${method} request.`);
        }
        return await fetchCall(url, methodUpper, parsedHeaders, body);
    }

    if (!body) {
        throw new Error(`Missing body for ${method} request.`);
    }

    const hasContentType = Object.keys(parsedHeaders).some(
        (k) => k.toLowerCase() === "content-type"
    );

    if (!hasContentType) {
        parsedHeaders["Content-Type"] = "application/json";
    }

    return await fetchCall(url, methodUpper, parsedHeaders, body);
};

const fetchCall = async (url: string, methodUpper: string, parsedHeaders: Record<string, string>, body: any) => {
    const fetchOptions: RequestInit = {
        method: methodUpper,
        headers: parsedHeaders,
        body: ["GET", "HEAD"].includes(methodUpper) ? undefined : body,
        signal: AbortSignal.timeout(10000),
    };

    try {
        const response = await fetch(url, fetchOptions);

        const responseHeaders = Object.fromEntries(response.headers.entries());
        const contentType = (responseHeaders["content-type"] || "").toLowerCase();
        let responseBody: any;

        if (!contentType.includes("application/json")) {
            responseBody = await response.text();
        } else {
            try {
                responseBody = await response.json();
            } catch {
                responseBody = await response.text();
            }
        }

        return {
            statusCode: response.status,
            headers: responseHeaders,
            body: responseBody,
        };
    } catch (error: any) {
        if (error.name === "AbortError") {
            throw new Error("HTTP request timeout (10s limit reached).");
        }
        throw new Error(`HTTP request failed: ${error.message || error}`);
    }
};
