export class LocalCache {
    // Method to set an item in localStorage
    set<T>(key: string, value: T): void {
        const stringifiedValue = JSON.stringify(value);
        localStorage.setItem(key, stringifiedValue);
    }

    get<T>(key: string): T | null {
        const item = localStorage.getItem(key);
        if (!item) {
            return null;
        }
        return JSON.parse(item) as T;
    }

    remove(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}
