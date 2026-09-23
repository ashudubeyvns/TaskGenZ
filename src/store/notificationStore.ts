import { create } from "zustand";
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from "../api/notificationApi";

export type NotificationType =
  | "task_assigned"
  | "task_updated"
  | "task_created"
  | "task_moved"
  | "task_reordered"
  | "task_due";
export interface Notification { id:number; type:NotificationType; title:string; message:string; createdAt:string; read:boolean; }
interface NotificationStore {
  notifications:Notification[]; initialize:()=>Promise<void>; addNotification:(notification:Omit<Notification,"id"|"createdAt"|"read">)=>void;
  markAsRead:(id:number)=>void; markAllAsRead:()=>void; removeNotification:(id:number)=>void; clearNotifications:()=>void; hasNotification:(id:number)=>boolean;
}
const isTest=import.meta.env.MODE==="test";
export const useNotificationStore=create<NotificationStore>((set,get)=>({
  notifications:[],
  initialize:async()=>{if(isTest)return;try{set({notifications:await getNotifications()});}catch{/* backend may be offline during initial render */}},
  addNotification:(notification)=>{const local:Notification={...notification,id:Date.now()*1000+Math.floor(Math.random()*1000),createdAt:new Date().toISOString(),read:false};set(state=>({notifications:[local,...state.notifications].slice(0,50)}));},
  markAsRead:(id)=>{set(state=>({notifications:state.notifications.map(n=>n.id===id?{...n,read:true}:n)}));if(!isTest)void markNotificationRead(id).catch(()=>{});},
  markAllAsRead:()=>{set(state=>({notifications:state.notifications.map(n=>({...n,read:true}))}));if(!isTest)void markAllNotificationsRead().catch(()=>{});},
  removeNotification:(id)=>{set(state=>({notifications:state.notifications.filter(n=>n.id!==id)}));if(!isTest)void deleteNotification(id).catch(()=>{});},
  clearNotifications:()=>set({notifications:[]}),
  hasNotification:(id)=>get().notifications.some(n=>n.id===id),
}));
