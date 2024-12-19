"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { fetchToken } from "../lib/firebase"; // Your custom Firebase fetchToken function
import { getMessaging, onMessage, Unsubscribe } from "firebase/messaging";
import { toast } from "sonner";

async function getNotificationPermissionTokenAndToken() {
  if (!self.Notification) {
    console.log("This browser does not support notifications.");
    return null;
  }

  if (Notification.permission === "granted") {
    return await fetchToken();
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await fetchToken();
    }
  }

  console.log("Notification permission not granted.");
  return null;
}

const useFcmToken = () => {
  const router = useRouter();
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<NotificationPermission | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const retryLoadToken = useRef(0);
  const isLoading = useRef(false);

  const loadToken = async () => {
    if (isLoading.current) return;

    isLoading.current = true;

    const token = await getNotificationPermissionTokenAndToken();

    if (Notification.permission === "denied") {
      setNotificationPermissionStatus("denied");
      console.info("[Push Notification Status] Permission denied.");
      isLoading.current = false;
      return;
    }

    if (!token) {
      if (retryLoadToken.current >= 3) {
        console.error("[Error] Exhausted max retry limit.");
        isLoading.current = false;
        return;
      }
      retryLoadToken.current += 1;
      isLoading.current = false;
      await loadToken();
      return;
    }

    setNotificationPermissionStatus(Notification.permission);
    setToken(token);
    console.log("FCM Token:", token);
    isLoading.current = false;
  };

  useEffect(() => {
    if (self.Notification) {
      loadToken();
    }
  }, []);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const setupListener = async () => {
      if (!token) return;

      console.log("onMessage listener registered.");
      const messaging = getMessaging(); // Proper initialization of messaging
      unsubscribe = onMessage(messaging, (payload) => {
        if (Notification.permission !== "granted") return;

        console.log("Foreground Notification:", payload);

        const link = payload.fcmOptions?.link || payload.data?.link;
        if (link) {
          toast.info(`${payload.notification?.title}: ${payload.notification?.body}`, {
            action: {
              label: "Visit",
              onClick: () => router.push(link),
            },
          });
        } else {
          toast.info(`${payload.notification?.title}: ${payload.notification?.body}`);
        }
      });

      return unsubscribe;
    };

    setupListener().then((unsub) => {
      if (unsub) {
        unsubscribe = unsub;
      }
    });

    return () => unsubscribe?.();
  }, [token, router]);

  return { token, notificationPermissionStatus };
};

export { useFcmToken };
