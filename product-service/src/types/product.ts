export type ProductBody = {
    title: string;
    price: number;
    count: number;
    description: string;
};

export type Product = {
    id: string;
    title: string;
    price: number;
    count: number;
    description: string;
};

export type Products = Product[];
