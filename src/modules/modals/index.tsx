"use client";

import { useEffect, useState } from "react";
import { ConfirmationModal } from "./components/ConfirmationModal";
import TestimonialsModal from "./components/TestimonialsModal";
import SkillsModal from "./components/SkillsModal";
import EducationModal from "./components/EducationModal";

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
      {/* Edu, Skill, Proj, Vidgroup, ImgGroup */}
      <ConfirmationModal />
      <EducationModal />
      <TestimonialsModal />
      <SkillsModal />
    </>
  );
};
export default Modals;
