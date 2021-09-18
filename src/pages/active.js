import React from "react";
import uuid from "uuid";
import { List } from "framework7-react";
import UserElement from "./userElement";
const Active = ({ userList, remove }) => {
    return (
        <List>
            {userList.length > 0 &&
                userList.map((user) => (
                    <UserElement key={uuid.v4()} user={user} remove={remove} />
                ))}
        </List>
    );
};

export default Active;
