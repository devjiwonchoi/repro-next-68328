import { useLoadOnClientSide } from './useLoadOnClientSide';
const loader = () => import('../star/star').then(({ Star }) => Star);

export const StarLazy = () => {
  const Star = useLoadOnClientSide(loader, null);
  return Star && <Star />;
};
