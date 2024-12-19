import admin from "firebase-admin";
import { Message } from "firebase-admin/messaging";
import { NextRequest, NextResponse } from "next/server";

if (!admin.apps.length) {
  const serviceAccount = require("@/app/service_key.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export async function POST(req: NextRequest) {
  const { token, title, message, link } = await req.json();

  const payload: Message = {
    token,
    notification: {
      title,
      body: message,
    },
    webpush: link && {
      fcmOptions: {
        link,
      },
    },
  };
  try {
    const res = await admin.messaging().send(payload);
    console.log(res);
    return NextResponse.json({ success: true, message: "Notification Sent !" });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}
