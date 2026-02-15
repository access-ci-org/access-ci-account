import { atom } from 'jotai';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export type AppNotification = {
    id: string;
    title?: string;
    message: React.ReactNode | string;
    variant?: NotificationType;
    dismissible?: boolean;
    autoCloseMs?: number; // time in milliseconds to auto close the notification
};

export const notificationsAtom = atom<AppNotification[]>([]);

// Helper: add a notification
export const pushNotificationAtom = atom(
  null,
  (get, set, n: Omit<AppNotification, "id"> & { id?: string }) => {
    const id = n.id ?? crypto.randomUUID();

    // Only show one notification with unique id 
    const current = get(notificationsAtom);
    if (current.some((x) => x.id === id)) return;

    const next: AppNotification = {
      id,
      variant: n.variant ?? "info",
      dismissible: n.dismissible ?? true,
      ...n,
    };
    set(notificationsAtom, [...get(notificationsAtom), next]);
  },
);

// Helper: remove a notification
export const dismissNotificationAtom = atom(null, (get, set, id: string) => {
    set(
        notificationsAtom,
        get(notificationsAtom).filter((n) => n.id !== id),
    );
});

// Helper: Clear all
export const clearNotificationsAtom = atom(null, (_get, set) => {
    set(notificationsAtom, []);
});