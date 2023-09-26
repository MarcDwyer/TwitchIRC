import { deferred } from "@src/utils/async/deferred";
import { useCallback, useState } from "react";

export const useModal = <T>() => {
  const [signal, setSignal] = useState(deferred<T>());
  const [open, setOpen] = useState<boolean>(false);

  const openModal = useCallback(() => {
    setOpen(true);
    signal.finally(() => {
      setOpen(false);
      setSignal(deferred());
    });
    return signal;
  }, [signal, setOpen]);

  return {
    signal,
    open,
    openModal,
  };
};
