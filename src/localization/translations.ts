export const uk = {
    'app.name': 'Avertoo',

    'common.continue': 'Продовжити',
    'common.back': 'Назад',
    'common.cancel': 'Скасувати',
    'common.confirm': 'Підтвердити',
    'common.save': 'Зберегти',
    'common.retry': 'Спробувати ще раз',

    'pin.createLogin.title': 'Створення PIN-коду',
    'pin.createLogin.description': 'Створіть PIN-код для входу в застосунок.',
    'pin.confirmLogin.title': 'Підтвердження PIN-коду',
    'pin.confirmLogin.description': 'Введіть PIN-код повторно.',
    'pin.createWipe.title': 'PIN-код видалення даних',
    'pin.createWipe.description':
        'Створіть окремий PIN-код для видалення локальних даних.',
    'pin.confirmWipe.title': 'Підтвердження PIN-коду видалення',
    'pin.confirmWipe.description': 'Введіть PIN-код видалення повторно.',
    'pin.errorMismatch': 'PIN-коди не збігаються.',
    'pin.errorSameCodes':
        'PIN-код входу та PIN-код видалення мають відрізнятися.',

    'auth.title': 'Авторизація',
    'auth.login': 'Увійти',
    'auth.userId': 'ID користувача',
    'auth.password': 'Пароль',
    'auth.registerPrompt': 'Ще не маєте облікового запису?',
    'auth.registerLink': 'Зареєструватися',

    'registration.title': 'Реєстрація',
    'registration.submit': 'Створити обліковий запис',
    'registration.loginPrompt': 'Вже маєте обліковий запис?',
    'registration.loginLink': 'Увійти',

    'settings.language': 'Мова',
    'settings.language.uk': 'Українська',
    'settings.language.en': 'Англійська',
    'settings.theme': 'Тема',
    'settings.theme.system': 'Як у системі',
    'settings.theme.light': 'Світла',
    'settings.theme.dark': 'Темна',

    'theme.error.notReady': 'Налаштування теми ще не завантажені або сховище недоступне.',

    'pin.keypad.backspace': 'Видалити останню цифру',
    'pin.error.storage': 'Не вдалося зберегти PIN-код. Спробуйте ще раз.',
    'pin.error.notConfigured': 'PIN-коди ще не налаштовані.',
    'pin.error.invalid': 'PIN-код має містити рівно 4 цифри.',

    'auth.password.show': 'Показати пароль',
    'auth.password.hide': 'Приховати пароль',
    'auth.error.network': 'Не вдалося з’єднатися із сервером. Перевір інтернет.',
    'auth.error.timeout': 'Сервер не відповів вчасно. Спробуй ще раз.',
    'auth.error.invalidResponse': 'Сервер повернув некоректну відповідь.',
    'auth.error.storage': 'Не вдалося зберегти дані авторизації.',
    'auth.error.validation': 'Перевір правильність введених даних.',
    'auth.error.unauthorized': 'Неправильний ідентифікатор або пароль.',
    'auth.error.forbidden': 'Запит відхилено. Перевір CAPTCHA.',
    'auth.error.conflict': 'Такий ідентифікатор уже зайнятий.',
    'auth.error.rateLimited': 'Забагато запитів. Спробуй пізніше.',
    'auth.error.server': 'Помилка сервера. Спробуй пізніше.',
    'auth.error.unknown': 'Сталася невідома помилка.',
    'registration.description': 'Створіть обліковий запис Avertoo.',
    'registration.userIdHint': 'Можна вказати вільний ID із 10 цифр або залишити поле порожнім — сервер призначить ID автоматично.',
    'registration.confirmPassword': 'Повторіть пароль',

    'pin.enterLogin.title': 'Введіть PIN-код',
    'pin.enterLogin.description': 'Введіть PIN-код для розблокування застосунку',

    'pin.error.incorrect': 'Неправильний PIN-код. Спробуйте ще раз.',

    'registration.success.title': 'Обліковий запис створено!',
    'registration.success.description':
        'Збережіть свої дані для входу. Вони знадобляться, щоб увійти в Avertoo знову.',
    'registration.success.warningTitle': 'Важливо!',
    'registration.success.warning':
        'Запишіть або скопіюйте ID і пароль у надійне місце. Пароль не можна буде відновити, якщо ви його забудете.',
    'registration.success.copy': 'Копіювати',
    'registration.success.copied': 'Скопійовано в буфер обміну.',
    'registration.success.idUnavailable':
        'Не вдалося прочитати ID з токена. Зверніться до підтримки.',
    'chats.title': 'Чати',
    'chats.connection.disconnected': 'Немає з’єднання',
    'chats.connection.connecting': 'З’єднання встановлюється',
    'chats.connection.connected': 'З’єднано',
    'chats.newChat': 'Створити чат',
    'chats.newChatLater': 'Створення чату буде доступне пізніше.',
    'chats.deleteTitle': 'Видалити чат?',
    'chats.deleteWarning': 'Чат і всі повідомлення буде видалено без можливості відновлення. У співрозмовника чат і повідомлення також видаляться автоматично під час наступного підключення до мережі.',
    'chats.delete': 'Видалити',

} as const;

export type TranslationKey = keyof typeof uk;
export type Language = 'uk' | 'en';

const en: Record<TranslationKey, string> = {
    'app.name': 'Avertoo',

    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.save': 'Save',
    'common.retry': 'Try again',

    'pin.createLogin.title': 'Create PIN',
    'pin.createLogin.description': 'Create a PIN to access the app.',
    'pin.confirmLogin.title': 'Confirm PIN',
    'pin.confirmLogin.description': 'Enter your PIN again.',
    'pin.createWipe.title': 'Data deletion PIN',
    'pin.createWipe.description':
        'Create a separate PIN for deleting local data.',
    'pin.confirmWipe.title': 'Confirm data deletion PIN',
    'pin.confirmWipe.description':
        'Enter your data deletion PIN again.',
    'pin.errorMismatch': 'The PIN codes do not match.',
    'pin.errorSameCodes':
        'The login PIN and data deletion PIN must be different.',

    'auth.title': 'Sign in',
    'auth.login': 'Sign in',
    'auth.userId': 'User ID',
    'auth.password': 'Password',
    'auth.registerPrompt': 'Don’t have an account yet?',
    'auth.registerLink': 'Create an account',

    'registration.title': 'Registration',
    'registration.submit': 'Create account',
    'registration.loginPrompt': 'Already have an account?',
    'registration.loginLink': 'Sign in',

    'settings.language': 'Language',
    'settings.language.uk': 'Ukrainian',
    'settings.language.en': 'English',
    'settings.theme': 'Theme',
    'settings.theme.system': 'System',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',

    'theme.error.notReady': 'Theme settings are not loaded yet or storage is unavailable.',

    'pin.keypad.backspace': 'Delete last digit',
    'pin.error.storage': 'Could not save the PIN. Please try again.',
    'pin.error.notConfigured': 'PIN codes have not been configured yet.',
    'pin.error.invalid': 'The PIN must contain exactly 4 digits.',

    'auth.password.show': 'Show password',
    'auth.password.hide': 'Hide password',
    'auth.error.network': 'Could not connect to the server. Check your internet connection.',
    'auth.error.timeout': 'The server did not respond in time. Please try again.',
    'auth.error.invalidResponse': 'The server returned an invalid response.',
    'auth.error.storage': 'Could not save authentication data.',
    'auth.error.validation': 'Please check the entered information.',
    'auth.error.unauthorized': 'Incorrect user ID or password.',
    'auth.error.forbidden': 'Request rejected. Please check the CAPTCHA.',
    'auth.error.conflict': 'This user ID is already taken.',
    'auth.error.rateLimited': 'Too many requests. Please try again later.',
    'auth.error.server': 'Server error. Please try again later.',
    'auth.error.unknown': 'An unknown error occurred.',
    'registration.description': 'Create your Avertoo account.',
    'registration.userIdHint': 'Enter an available 10-digit ID, or leave this field empty and the server will assign one automatically.',
    'registration.confirmPassword': 'Confirm password',

    'pin.enterLogin.title': 'Enter your PIN',
    'pin.enterLogin.description': 'Enter your PIN to unlock the app',

    'pin.error.incorrect': 'Incorrect PIN. Please try again.',

    'registration.success.title': 'Account created!',
    'registration.success.description':
        'Save your sign-in details. You will need them to sign in to Avertoo again.',
    'registration.success.warningTitle': 'Important!',
    'registration.success.warning':
        'Write down or copy your ID and password to a safe place. Your password cannot be recovered if you forget it.',
    'registration.success.copy': 'Copy',
    'registration.success.copied': 'Copied to clipboard.',
    'registration.success.idUnavailable':
        'Could not read the ID from the token. Please contact support.',
    'chats.title': 'Chats',
    'chats.connection.disconnected': 'Disconnected',
    'chats.connection.connecting': 'Connecting',
    'chats.connection.connected': 'Connected',
    'chats.newChat': 'Create chat',
    'chats.newChatLater': 'Chat creation will be available later.',
    'chats.deleteTitle': 'Delete chat?',
    'chats.deleteWarning': 'The chat and all messages will be deleted permanently. The chat and messages will also be automatically deleted for the other person the next time they connect to the network.',
    'chats.delete': 'Delete',

};

export const translations: Record<
    Language,
    Record<TranslationKey, string>
> = {
    uk,
    en,
};
