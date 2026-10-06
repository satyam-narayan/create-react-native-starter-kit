import { RootStoreState } from '@/store/rootReducer';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const useAppSelector: TypedUseSelectorHook<RootStoreState> = useSelector;
