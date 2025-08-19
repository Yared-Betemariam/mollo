"use client";

import { useEffect, useState } from "react";
import UserModal from "../components/UserModal";

const AdminModals = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
    }
  }, []);

  if (!mounted) return null;

  return (
    <>
      <UserModal />
    </>
  );
};
export default AdminModals;
