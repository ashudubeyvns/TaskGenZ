import { useEffect } from "react";
import { useNotificationStore } from "../store/notificationStore";

export function useNotifications(){
  const initialize=useNotificationStore(state=>state.initialize);
  useEffect(()=>{
    void initialize();
    const timer=window.setInterval(()=>{void initialize();},5000);
    return ()=>window.clearInterval(timer);
  },[initialize]);
}
