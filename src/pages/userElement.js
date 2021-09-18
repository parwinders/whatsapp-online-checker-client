import React, { useEffect, useState } from "react";
import { ListItem } from "framework7-react";
import axios from "axios";

const UserElement = ({ user, remove, beep }) => {
    const [userP, setUserP] = useState(user);

    useEffect(() => {
        const mount = { val: true };
        const sub = async () => {
            // console.log("updated from userelement", userP.name);
            await axios
                .get(
                    "https://serene-sierra-48167.herokuapp.com/" + userP.number
                )
                .then((res) => {
                    const status =
                        res.data.status === "available" ? "online" : "offline";
                    try {
                        if (status === "online") beep();
                    } catch (error) {
                        console.warn("catch1", error);
                    }
                    if (mount.val) {
                        setUserP({ name: userP.name, status: status });
                    } else {
                        console.warn("already umnounted cant update");
                    }
                })
                .catch((err) => console.warn("catch2", err));
        };
        const id = setInterval(sub, 5000);
        console.log(id, "started for", userP.name);

        return () => {
            // console.log("unmounted")
            mount.val = false;
            clearInterval(id);
            console.warn("cleared setInterval -- cleanup ", id);
        };
    }, []);

    return (
        <ListItem
            style={{
                listStyle: "none",
                color: userP.status === "online" && "var(--f7-color-lime-tint)",
            }}
            title={userP.name}
            onClick={() => remove(user.number)}
            link='#'
            header='name'
            after={userP.status === "online" ? "ONLINE" : "offline"}
        >
            {" "}
        </ListItem>
    );
};

export default UserElement;
