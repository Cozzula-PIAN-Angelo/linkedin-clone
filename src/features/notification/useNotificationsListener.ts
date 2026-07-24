import { useEffect } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { notificationsSynced } from "./notificationSlice";
import { timeAgo } from "../posts/timeAgo";
import type { NotificationItem } from "./types";

// Tiene la campanella sincronizzata in tempo reale con le notifiche reali
// del proprio account: like, commenti e inviti di collegamento da altri
// utenti veri arrivano subito, senza bisogno di ricaricare la pagina.
export function useNotificationsListener() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  useEffect(() => {
    if (!currentUser) return;

    const notificationsQuery = query(
      collection(db, "notifications"),
      where("recipientId", "==", currentUser.id),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const items: NotificationItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          message: data.message as string,
          time: timeAgo(data.createdAt as string),
          read: data.read as boolean,
        };
      });
      dispatch(notificationsSynced(items));
    });

    return unsubscribe;
  }, [currentUser, dispatch]);
}
