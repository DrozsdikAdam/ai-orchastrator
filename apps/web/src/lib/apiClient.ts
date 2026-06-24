export class ApiClient {

    link: string;

    constructor() {
        this.link = process.env.NEXT_PUBLIC_API_URL || "";
        if (!this.link || this.link === "") throw new Error("No server link provided");
    }

    private getPath(path: string): string {
        if (!this.link || this.link === "") throw new Error("No server link provided");
        if (!path ||
            path === "" ||
            path === this.link ||
            path === this.link + "/") throw new Error("No path provided");
        return `${this.link}${path.startsWith("/") ? path : `/${path}`}`;
    }

    private getHeaders(includeToken: boolean): Headers {
        let headers = new Headers();
        headers.set("Content-Type", "application/json");
        if (includeToken) {
            let token = localStorage.getItem("token");
            if (!token) throw new Error("No token provided");
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    }


    async get<T = unknown>(path: string, includeToken: boolean): Promise<T> {
        const url = this.getPath(path);
        const response = await fetch(url, {
            method: "GET",
            headers: this.getHeaders(includeToken)
        });
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        return response.json() as Promise<T>;
    }

    async post<T = unknown>(path: string, includeToken: boolean, body?: unknown): Promise<T> {
        const url = this.getPath(path);
        const response = await fetch(url, {
            method: "POST",
            headers: this.getHeaders(includeToken),
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        return response.json() as Promise<T>;
    }

    async put<T = unknown>(path: string, includeToken: boolean, body?: unknown): Promise<T> {
        const url = this.getPath(path);
        const response = await fetch(url, {
            method: "PUT",
            headers: this.getHeaders(includeToken),
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        return response.json() as Promise<T>;
    }

    async delete<T = unknown>(path: string, includeToken: boolean): Promise<T> {
        const url = this.getPath(path);
        const response = await fetch(url, {
            method: "DELETE",
            headers: this.getHeaders(includeToken)
        });
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        if (response.status === 204) {
            return {} as T;
        }
        return response.json() as Promise<T>;
    }

}

export const api = new ApiClient();