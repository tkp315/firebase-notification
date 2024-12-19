"use client"
import axios from "axios";
import {useFcmToken} from "./hooks/useFcmToken";

import { Button } from "@/components/ui/button";


export default function Home() {
  const {token,notificationPermissionStatus}= useFcmToken();
  const handleTestNotification = async ()=>{
    const response = await axios.post('/api/send-notification',{
      token,
      title:'Test notification',
      message:'I am testing the notification',
      link: '/orders'
    })
    console.log(response.data);
  }
  return (
   <>
   <Button onClick={handleTestNotification}>
    Send Notification
   </Button>
   </>
  );
}
