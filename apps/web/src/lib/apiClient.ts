export class ApiClient {

    token: string;
    link: string;
    headers: Headers;
    path: string;

    constructor(path: string) {

        this.token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
        this.link = process.env.NEXT_PUBLIC_API_URL || "";
        this.headers = new Headers();
        this.headers.set("Content-Type", "application/json");
        this.headers.set("Authorization", `Bearer ${this.token}`);
        this.path = `${this.link}${path.startsWith("/") ? path : `/${path}`}`;

        if (!this.link || this.link === "") throw new Error("No server link provided");

        if (!this.path ||
            this.path === "" ||
            path === this.link ||
            path === this.link + "/") throw new Error("No path provided");

    }


    async get<T = unknown>(): Promise<T> {
        const response = await fetch(this.path, {
            method: "GET",
            headers: this.headers
        });
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        return response.json() as Promise<T>;
    }

    async post<T = unknown>(body?: unknown): Promise<T> {
        const response = await fetch(this.path, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        return response.json() as Promise<T>;
    }

    async put<T = unknown>(body?: unknown): Promise<T> {
        const response = await fetch(this.path, {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error("Failed to fetch");
        }
        return response.json() as Promise<T>;
    }

    async delete<T = unknown>(): Promise<T> {
        const response = await fetch(this.path, {
            method: "DELETE",
            headers: this.headers
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