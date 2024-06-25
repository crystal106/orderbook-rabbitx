import { useEffect, useRef, useState } from "react";
import { Centrifuge, Subscription } from "centrifuge";

export const useCentrifuge = (url: string, channel: string) => {
  const [centrifuge, setCentrifuge] = useState<Centrifuge | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const token = process.env.REACT_APP_CENTRIFUGE_TOKEN;
    if (!token) {
      console.error("Centrifuge token is not provided.");
      return;
    }

    const centrifuge = new Centrifuge(url, { token });
    setCentrifuge(centrifuge);

    const subscription = centrifuge.newSubscription(channel);
    setSubscription(subscription);
  }, [url, channel]);

  return {
    centrifuge,
    subscription,
  };
};
