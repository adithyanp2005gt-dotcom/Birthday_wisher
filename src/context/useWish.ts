import { useContext } from 'react';
import { WishContext } from './wish-context-def';

export const useWish = () => {
  const context = useContext(WishContext);
  if (!context) {
    throw new Error('useWish must be used within a WishProvider');
  }
  return context;
};
