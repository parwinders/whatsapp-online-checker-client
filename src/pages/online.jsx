import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    f7,
    Page,
    Navbar,
    BlockFooter,
    useStore,
    Col,
    Preloader,
    Block,
    List,
    ListInput,
    ListButton,
    Progressbar,
    BlockTitle,
    Icon,
} from "framework7-react";
import { API_BASE_URL, UPDATE_URL } from "./constant";
import Active from "./active";

const online = () => {
    const BaseUrl = API_BASE_URL;
    const [sound, setSound] = useState(true);
    const [progress, setProgress] = useState(false);
    const [targetname, setTargetname] = useState("");
    const [targetnumber, setTargetnumber] = useState("");
    const [activeData, setActiveData] = useState([]);
    // On component mount
    useEffect(() => {
        // Get version Match:Update
        let fetch = axios.get(UPDATE_URL);
        fetch.then((res) => {
            let gotVer;
            console.info("Latest version:", (gotVer = res.data.split("\n")[0]));
            /1.0.0/.test(gotVer)
                ? console.info("Already latest version")
                : f7.dialog.alert(
                      "Download the latest version",
                      "New update Available"
                  );
            console.log(gotVer, "matching", "1.0.0");
        });
        // Add Event listener key for Enter (web and desktop version ):comfort
        document
            .getElementsByName("targetnumber")[0]
            .addEventListener("keypress", enterKey);

        // Load persistent Data for State Recovery : state mechanism(localStorage)
        let oldData;
        if ((oldData = localStorage.getItem("persistData"))) {
            try {
                oldData = JSON.parse(oldData);
                console.log("oldData found setting oldData active", oldData);
                oldData.forEach((person) => {
                    person.status = "refresh";
                    axios.post(BaseUrl + person.number);
                });
                setActiveData(oldData);
            } catch (e) {
                console.warn("error parsing old data ", e);
                localStorage.clear();
            }
        }
    }, []);

    useEffect(() => {
        // Saving State to localStorage on each new Contact update (del/add)
        localStorage.setItem("persistData", JSON.stringify(activeData));
        console.log("saved", activeData);
    }, [activeData]);

    // helper method for Enter key Convenience
    const enterKey = (e) => {
        if (e.key === "Enter")
            document.querySelector("#enter").firstElementChild.click();
    };
    // Delete Active Contact
    const removeActive = (num) => {
        setActiveData(activeData.filter((user) => !(user.number === num)));
    };
    // Play Beep Sound
    function beep() {
        if (!sound) return;
        var snd = new Audio(
            "data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="
        );
        snd.play();
    }

    // MAIN method Onclick fn
    const getstatus = async (
        targetname = "target",
        targetnumber = "",
        base = BaseUrl,
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
    ////////////////////////////// Render //////////////////////////////////////
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
                    id='enter'
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
                    <Col>
                        <a
                            href='#'
                            onClick={() => {
                                console.info("sound turned", !sound);
                                setSound(!sound);
                                console.log({ sound });
                            }}
                        >
                            <Icon
                                f7={
                                    sound === true
                                        ? "speaker_2"
                                        : "speaker_slash"
                                }
                            />
                        </a>
                    </Col>
                </Block>
            )}
            <Active userList={activeData} remove={removeActive} beep={beep} />
        </Page>
    );
};

export default online;
