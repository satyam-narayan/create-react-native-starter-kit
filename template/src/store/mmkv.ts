import { createMMKVInstance } from '@/storage/mmkvAdapter';
import { createMMKVAdapter } from '@/storage/mmkvInstance';

const reduxMMKV = createMMKVInstance('reduxStorage');

export const reduxStorage = createMMKVAdapter(reduxMMKV);
