import React, { useState } from "react";
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

const online = () => {
    const [progress, setProgress] = useState(false);
    const [targetname, setTargetname] = useState("");
    const [targetnumber, setTargetnumber] = useState("");

    const getstatus = async () => {
        await axios.post(
            "https://serene-sierra-48167.herokuapp.com/" + targetnumber
        );
        await axios
            .get("https://serene-sierra-48167.herokuapp.com/" + targetnumber)
            .then((res) => {
                console.log(res.data);
                f7.dialog.alert(res.data.status, "Target Status");
            })
            .catch((err) => {
                console.log(err.response.data);
                f7.dialog.alert(err.response.data.msg, "Error");
            });
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
                            await getstatus();
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
            </List>
        </Page>
    );
};

export default online;
