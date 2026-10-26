import {
    getSecureItem,
    setSecureItem,
    deleteSecureItem,
} from '@/storage/secureStorage';

const ONBOARDING_COMPLETED_KEY = 'onboarding.completed';

export async function isOnboardingCompleted(): Promise<boolean> {
    const value = await getSecureItem( ONBOARDING_COMPLETED_KEY );

    return value === 'true';
}

export async function completeOnboarding(): Promise<void> {
    await setSecureItem( ONBOARDING_COMPLETED_KEY, 'true' );
}

export async function resetOnboarding(): Promise<void> {
    await deleteSecureItem( ONBOARDING_COMPLETED_KEY );
}