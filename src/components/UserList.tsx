import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText } from "@mui/material";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id}>
          <ListItemText primary={user.username} />
        </ListItem>
      ))}
    </List>
  );
};

export default UserList;
