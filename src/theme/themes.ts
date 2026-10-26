export type ThemeMode = 'system' | 'light' | 'dark';

export type AppTheme = {
    isDark: boolean;
    colors: {
        background: string;
        surface: string;
        surfaceSecondary: string;
        text: string;
        textSecondary: string;
        border: string;
        primary: string;
        onPrimary: string;
        danger: string;
        success: string;
        inputBackground: string;
        placeholder: string;
        statusBar: string;
    };
};

export const lightTheme: AppTheme = {
    isDark: false,
    colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        surfaceSecondary: '#F3F4F6',
        text: '#111827',
        textSecondary: '#6B7280',
        border: '#D1D5DB',
        primary: '#2563EB',
        onPrimary: '#FFFFFF',
        danger: '#DC2626',
        success: '#16A34A',
        inputBackground: '#F9FAFB',
        placeholder: '#9CA3AF',
        statusBar: '#FFFFFF',
    },
};

export const darkTheme: AppTheme = {
    isDark: true,
    colors: {
        background: '#111318',
        surface: '#1B1E25',
        surfaceSecondary: '#272B34',
        text: '#F9FAFB',
        textSecondary: '#A1A1AA',
        border: '#3F4450',
        primary: '#60A5FA',
        onPrimary: '#111827',
        danger: '#F87171',
        success: '#4ADE80',
        inputBackground: '#20242C',
        placeholder: '#717784',
        statusBar: '#111318',
    },
};