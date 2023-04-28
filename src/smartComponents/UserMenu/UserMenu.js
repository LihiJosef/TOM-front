import { useState, useRef } from "react";

import { List, ListItem, ListItemText } from "@material-ui/core";
import { ExitToApp, AccountBox, MoreVert } from "@material-ui/icons";

// Style
import styles from "./userMenu.module.scss";

// Context
import { useMsal } from "../../context/msalContext";

// Hooks
import { useClickOutside } from "../../hooks/useClickOutside";
import { Link } from "react-router-dom/cjs/react-router-dom";

export const UserMenu = () => {
  const wrapperRef = useRef(null);
  const { isAdmin, logout } = useMsal();

  const [openList, setOpenList] = useState(false);

  useClickOutside(wrapperRef, () => setOpenList(false));
  return (
    <div ref={wrapperRef}>
      <div onClick={() => setOpenList(!openList)}>
        <MoreVert />
      </div>
      {openList && (
        <div className={styles.root}>
          <List component="nav">
            {isAdmin && (
              <ListItem button component={Link} to="/admin">
                <AccountBox style={{ paddingRight: 5 }} />
                <ListItemText primary="Admin" />
              </ListItem>
            )}
            <ListItem button onClick={logout}>
              <ExitToApp style={{ paddingRight: 5 }} />
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </div>
      )}
    </div>
  );
};