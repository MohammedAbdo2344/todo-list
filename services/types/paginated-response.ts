export interface Links {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

// Meta interface
export interface Meta {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
}
