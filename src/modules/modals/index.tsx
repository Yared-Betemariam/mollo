"use client";

import { useEffect, useState } from "react";
import { ConfirmationModal } from "./components/ConfirmationModal";
import TestimonialsModal from "./components/TestimonialsModal";
import SkillsModal from "./components/SkillsModal";
import EducationModal from "./components/EducationModal";
import ProjectModal from "./components/ProjectModal";
import ImageGalleryGroupModal from "./components/ImageGalleyGroupModal";
import VideoGalleryGroupModal from "./components/VideoGalleyGroupModal";
import ShareModal from "./components/ShareModal";

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
      <ShareModal />
      <ProjectModal />
      <ImageGalleryGroupModal />
      <VideoGalleryGroupModal />
      <EducationModal />
      <TestimonialsModal />
      <SkillsModal />
    </>
  );
};
export default Modals;
