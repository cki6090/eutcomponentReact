import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function LeftMenu(props) {
  let menuList = props.menuList;
  const pathname = usePathname();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const currentPath = pathname;
    const menuIndex = menuList.findIndex(
      (menu) => currentPath === `/${props.title}/${menu.link}`
    );

    if (menuIndex !== -1) {
      setSelectedIndex(menuIndex);
    }
  }, [pathname, menuList, props.title]);

  return (
    <div className="left-menu">
      <div className="left-menu-list">
        <ul>
          {menuList.map((menu, index) => (
            <li
              key={index}
              className={
                selectedIndex === index &&
                pathname === `/${props.title}/${menu.link}`
                  ? "on"
                  : ""
              }
              onClick={() => setSelectedIndex(index)}
            >
              <Link href={`/${props.title}/${menu.link}`}>{menu.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
