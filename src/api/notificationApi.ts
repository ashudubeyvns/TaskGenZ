import { apiRequest } from "./apiClient";
import type { Notification } from "../store/notificationStore";
export const getNotifications = () => apiRequest<Notification[]>("/notifications");
export const markNotificationRead = (id:number) => apiRequest<void>(`/notifications/${id}/read`,{method:"PATCH"});
export const markAllNotificationsRead = () => apiRequest<void>("/notifications/read-all",{method:"PATCH"});
export const deleteNotification = (id:number) => apiRequest<void>(`/notifications/${id}`,{method:"DELETE"});
