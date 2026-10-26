export type RegistrationHandoff = {
    userId: string;
    password: string;
};

let registrationHandoff: RegistrationHandoff | null = null;

export function setRegistrationHandoff(
    data: RegistrationHandoff,
): void {
    registrationHandoff = data;
}

export function getRegistrationHandoff(): RegistrationHandoff | null {
    return registrationHandoff;
}

export function clearRegistrationHandoff(): void {
    registrationHandoff = null;
}