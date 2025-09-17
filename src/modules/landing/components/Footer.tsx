/* eslint-disable @next/next/no-img-element */

import Logo from "@/components/Logo";

const Footer = () => {
  const date = new Date();
  return (
    <footer className="absolute bottom-0 inset-x-0 text-white border-t border-border/20 py-12 md:py-8 bg-black/15 backdrop-blur-lg">
      <section className="wrapper text-center font-normal h-full flex items-center justify-center gap-4 md:gap-8 flex-col md:flex-row">
        <Logo light />
        <p className="opacity-45 hover:cursor-pointer  hover:opacity-50 duration-200 transition-all text-base md:mr-auto">
          &copy; {date.getFullYear()} Mollo. All Rights Reserved.
        </p>
        <a
          target="_blank"
          href="https://www.orpad.cc"
          className="w-fit h-fit border border-zinc-900/25 flex items-center gap-2 font-sans rounded-xl text-sm p-1 px-2 opacity-70 hover:opacity-90 duration-300 transition-all drop-shadow-sm bg-white text-black"
        >
          <img
            src="https://www.orpad.cc/logo.png"
            width={15}
            height={15}
            alt="orpad logo"
            className="size-4"
          />
          <span>Made with Orpad</span>
        </a>
      </section>
    </footer>
  );
};

export default Footer;
