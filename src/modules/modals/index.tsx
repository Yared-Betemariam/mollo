"use client";

import { useEffect, useState } from "react";
import { ConfirmationModal } from "./components/ConfirmationModal";

const Modals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <>
      <ConfirmationModal />
    </>
  );
};
export default Modals;
