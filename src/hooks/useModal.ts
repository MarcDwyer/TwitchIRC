import { deferred } from "@src/utils/async/deferred";
import { useCallback, useEffect, useState } from "react";

export const useModal = <T>() => {
  const [signal, setSignal] = useState(deferred<T>());
  const [open, setOpen] = useState<boolean>(false);

  const openModal = useCallback(() => {
    setOpen(true);
    return signal;
  }, [signal, setOpen]);

  useEffect(() => {
    signal.finally(() => {
      setSignal(deferred<T>());
    });
  }, [signal]);

  return {
    signal,
    open,
    openModal,
  };
};
