
export type Route = {
  segments: {
    color: string;
    isTransfer: boolean;
  }[];
};

export type Trip = {
  id: string;
  name: string;
  location: string;
  transitTime: string;
  transitRating: number;
  route: Route;
  address: string;
  category: 'cafes' | 'restaurants' | 'museums';
  liked?: boolean;
  visited?: boolean;
};
