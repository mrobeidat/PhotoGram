import { Link, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { bottombarLinks } from "@/constants";

const Bottombar = () => {
  const { pathname } = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const previousIndexRef = useRef<number | null>(null);

  const updateIndicator = () => {
    const activeLink = linksRef.current.find(
      (link) => link && link.classList.contains("active")
    );

    if (activeLink) {
      const activeIndex = linksRef.current.indexOf(activeLink);
      const activeLinkRect = activeLink.getBoundingClientRect();

      let newLeft = activeLink.offsetLeft;
      let newWidth = activeLink.offsetWidth;

      if (
        previousIndexRef.current !== null &&
        previousIndexRef.current !== activeIndex
      ) {
        const previousLink = linksRef.current[previousIndexRef.current];
        if (previousLink) {
          const previousLinkRect = previousLink.getBoundingClientRect();
          if (previousLinkRect.left < activeLinkRect.left) {
            newLeft = previousLinkRect.left;
            newWidth = activeLinkRect.right - previousLinkRect.left;
          } else {
            newLeft = activeLinkRect.left;
            newWidth = previousLinkRect.right - activeLinkRect.left;
          }
        }
      }

      setIndicatorStyle({ left: newLeft, width: newWidth });
      setTimeout(() => {
        setIndicatorStyle({
          left: activeLink.offsetLeft,
          width: activeLink.offsetWidth,
        });
      }, 400);

      previousIndexRef.current = activeIndex;
    }
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [pathname]);

  return (
    <section className="bottom-bar">
      <div
        className="horizontal-indicator"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          transition: "left 0.5s, width 0.5s",
        }}
      ></div>
      {bottombarLinks.map((link, index) => {
        const isActive = pathname === link.route;
        const IconComponent = link.icon;

        return (
          <Link
            key={`bottombar-${link.label}`}
            to={link.route}
            className={`bottombar-link ${isActive ? "active" : ""}`}
            ref={(el) => (linksRef.current[index] = el)}
          >
            {IconComponent ? (
              <IconComponent
                className={`text-purple-200 group-hover:text-white ${
                  isActive && "text-white"
                }`}
              />
            ) : null}
            <p className="tiny-medium text-light-2">{link.label}</p>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;
