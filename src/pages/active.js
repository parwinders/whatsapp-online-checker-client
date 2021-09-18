import React from "react";
import uuid from "uuid";
import { List } from "framework7-react";
import UserElement from "./userElement";
const Active = ({ userList }) => {
    return (
        <List>
            {userList.length > 0 &&
                userList.map((user) => (
                    <UserElement key={uuid.v4()} user={user} />
                ))}
        </List>
    );
};

export default Active;
