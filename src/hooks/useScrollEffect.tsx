import { useEffect, useState } from "react";

function useScrollEffect() {
  const [scrolled, setScrolled] = useState<boolean>(false);

  const scrollEffect = () => {
    if (window.scrollY >= 20) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollEffect);

    return () => {
      window.removeEventListener("scroll", scrollEffect);
    };
  }, []);

  return scrolled;
}

export default useScrollEffect;
