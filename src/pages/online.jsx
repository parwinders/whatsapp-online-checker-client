import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    f7,
    Page,
    Navbar,
    BlockFooter,
    useStore,
    Button,
    Col,
    Preloader,
    Block,
    List,
    ListInput,
    ListButton,
    Progressbar,
    BlockTitle,
} from "framework7-react";
import Active from "./active";

const online = () => {
    const [progress, setProgress] = useState(false);
    const [targetname, setTargetname] = useState("");
    const [targetnumber, setTargetnumber] = useState("");
    const [activeData, setActiveData] = useState([]);

    useEffect(() => {
        document.getElementsByName("targetnumber")[0].addEventListener('keypress',enterKey )
        let oldData;
        if ((oldData = localStorage.getItem("persistData"))) {
            setActiveData(JSON.parse(oldData));
            console.log("oldData found setting oldData active", oldData);
        }
    }, []);
    useEffect(() => {
        localStorage.setItem("persistData", JSON.stringify(activeData));
        console.log("saved", activeData);
    }, [activeData]);

    const enterKey  = ()=>{
        document.getElementsByName("enter")[0].click();
    }
    const removeActive = (num) => {
        setActiveData(activeData.filter((user) => !(user.number === num)));
    };
    const getstatus = async (
        targetname = "target",
        targetnumber = "",
        base = "https://serene-sierra-48167.herokuapp.com/",
        url = base + targetnumber
    ) => {
        try {
            console.log("initial req for", targetnumber);
            await axios.post(url);
            await new Promise((res) => setTimeout(res, 500));
            await axios
                .get(url)
                .then((res) => {
                    const userData = {};
                    const status =
                        res.data.status === "available" ? "online" : "offline";
                    userData.name = targetname;
                    userData.number = targetnumber;
                    userData.status = status;
                    console.log(userData);
                    setActiveData([...activeData, userData]);
                    f7.dialog.alert(status, `${targetname} Status`);
                    setTargetname(""), setTargetnumber("");
                })
                .catch((err) => {
                    console.error(
                        "initial req error for ",
                        targetnumber,
                        err.response.data
                    );
                    f7.dialog.alert(
                        err.response.data.msg + " on whatsapp ? ",
                        "Error"
                    );
                });
        } catch (error) {
            console.error(error);
        }
    };

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
                    name="enter"
                    title='Check Status'
                    onClick={async () => {
                        if (!progress) {
                            if (targetnumber.trim() === "")
                                return f7.dialog.alert(
                                    "is there a  PhoneNumber ?",
                                    " Server crashed"
                                );
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
                    {
                        "Number requires country code for an example 91|YourNumberHere| for India"
                    }
                    <br />
                    {
                        "Report the bugs at Python3pro@gmail.com or just curse and Restart, works Everytime !"
                    }
                    <br />
                </BlockFooter>
            </List>
            {activeData.length > 0 && (
                <Block className='row'>
                    {" "}
                    <Col>WatchList</Col>
                    {activeData.length > 0 && (
                        <Col>
                            <Preloader color='green' />
                        </Col>
                    )}
                </Block>
            )}
            <Active userList={activeData} remove={removeActive} />
        </Page>
    );
};

export default online;
