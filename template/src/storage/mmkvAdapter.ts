import { createMMKV } from 'react-native-mmkv';

export const createMMKVInstance = (id: string) => createMMKV({ id });
