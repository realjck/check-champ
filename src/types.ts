export type Category = {
  id: string;
  name: string;
  color: string;
  dotColor: string;
};

export type Product = {
  id: string;
  name: string;
  categoryId: string;
  purchased: boolean;
  order: number;
};