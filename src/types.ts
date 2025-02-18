export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Product = {
  id: string;
  name: string;
  categoryId: string;
  purchased: boolean;
  order: number;
};