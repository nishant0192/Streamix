import { Response } from 'express';

export function setCookie(res: Response, name: string, value: string, options: any) {
    res.cookie(name, value, options);
}

export function clearCookie(res: Response, name: string, options: any) {
    res.cookie(name, '', { ...options, expires: new Date(0) });
}
