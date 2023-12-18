import { useCallback, useState } from "react";

export const useModal = () => {
  const [open, setOpen] = useState<boolean>(false);

  const openModal = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return {
    open,
    openModal,
    closeModal,
  };
};
