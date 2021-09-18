import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    f7,
    Page,
    Navbar,
    BlockTitle,
    BlockFooter,
    useStore,
    Button,
    List,
    ListInput,
    ListButton,
    Progressbar,
} from "framework7-react";
import Active from "./active";

const online = () => {
    const [progress, setProgress] = useState(false);
    const [targetname, setTargetname] = useState("default");
    const [targetnumber, setTargetnumber] = useState("917982625205");
    const [activeData, setActiveData] = useState([
        { name: "jio", number: "917982625205", status: "" },
        { name: "saran", number: "917982044126", status: "" },
    ]);

    const getstatus = async (
        targetname = "defaultName",
        targetnumber = "917982625205",
        base = "https://serene-sierra-48167.herokuapp.com/",
        url = base + targetnumber
    ) => {
        try {
            console.log("initial req for", targetnumber);
            await axios.post(url);
            await axios
                .get(url)
                .then((res) => {
                    const userData = {};
                    const status =
                        res.data.status === "available" ? "online" : "offline";
                    console.log(
                        "initial request success for ",
                        targetname,
                        status
                    );
                    userData.name = targetname;
                    userData.status = status;
                    userData.number = targetnumber;
                    console.log({ userData });
                    setActiveData([...activeData, userData]);
                    f7.dialog.alert(status, `${targetname} Status`);
                    // const clearIntervalID = setInterval(
                    //     () => updateStatus(url, userData, activeData),
                    //     5 * 1000
                    // );
                })
                .catch((err) => {
                    console.log(
                        "initial req error for ",
                        targetnumber,
                        err.response.data
                    );
                    f7.dialog.alert(err.response.data.msg, "Error");
                });
        } catch (error) {
            console.log(error);
        }
    };
    // sleep example
    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    return (
        <Page name='Status check'>
            <Navbar title='Whatsapp Status Checker' backLink='Back' />
            <List form>
                <ListInput
                    type='text'
                    name='targetname'
                    placeholder='Your targetname'
                    value={targetname}
                    onInput={(e) => setTargetname(e.target.value)}
                ></ListInput>
                <ListInput
                    type='number'
                    name='targetnumber'
                    placeholder='Your targetnumber with countrycode '
                    value={targetnumber}
                    onInput={(e) => setTargetnumber(e.target.value)}
                ></ListInput>
            </List>
            <List>
                <ListButton
                    title='Check Status'
                    onClick={async () => {
                        if (!progress) {
                            setProgress(true);
                            await getstatus(targetname, targetnumber);
                            setProgress(false);
                        } else {
                        }
                    }}
                />
                <BlockFooter>
                    {progress && (
                        <p>
                            <Progressbar infinite color='multi' />
                        </p>
                    )}
                    Number requires country code for ex- 91[YourNumberHere] for
                    India
                    <br />
                    Report the bugs at python3pro@gmail.com
                </BlockFooter>
                <Active userList={activeData} />
            </List>
        </Page>
    );
};

export default online;
