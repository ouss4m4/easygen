import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const MAX_LOGIN_ATTEMPTS = 5;
export const ACCOUNT_LOCK_TIME_MS = 1 * 60 * 1000;
