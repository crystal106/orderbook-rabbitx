import { useEffect, useRef } from "react";
import { Centrifuge, Subscription } from "centrifuge";

export const useCentrifuge = (url: string, channel: string) => {
  const centrifugeRef = useRef<Centrifuge | null>(null);
  const subscriptionRef = useRef<Subscription | null>(null);

  useEffect(() => {
    const token = process.env.REACT_APP_CENTRIFUGE_TOKEN;
    if (!token) {
      console.error("Centrifuge token is not provided.");
      return;
    }

    const centrifuge = new Centrifuge(url, { token });
    centrifugeRef.current = centrifuge;

    const subscription = centrifuge.newSubscription(channel);
    subscriptionRef.current = subscription;
  }, [url, channel]);

  return {
    centrifuge: centrifugeRef.current,
    subscription: subscriptionRef.current,
  };
};
