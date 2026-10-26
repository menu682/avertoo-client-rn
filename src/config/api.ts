export const API_CONFIG = {
    BASE_URL: 'https://api.avertoo.pp.ua',
    SITE_URL: 'https://avertoo.pp.ua',
    TIMEOUT_MS: 15000,
} as const;

export const API_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
} as const;

export const CAPTCHA_CONFIG = {
    SITE_KEY: '0x4AAAAAAFRL-PzNYP0Ikix_',
    SCRIPT_URL: 'https://challenges.cloudflare.com/turnstile/v0/api.js',
} as const;