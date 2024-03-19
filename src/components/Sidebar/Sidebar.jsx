import { Outlet } from "react-router-dom";

import Logo from "../Logo";
import AppNav from "../AppNav";
import styles from "./Sidebar.module.css";

import SidebarFooter from "./SidebarFooter";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      <Outlet />

      <SidebarFooter />
    </div>
  );
}

export default Sidebar;
