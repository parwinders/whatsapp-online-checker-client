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

  /////////////////////////////////////////////////////////////////////////////////////////////
  const getstatus = (url) => {
    var config = {
      method: "get",
      url: url,
    };
    axios(config).then((response) => {
      console.log(JSON.stringify(response.data));
      window.ps3response = response;
      setProgress(false);
      f7.dialog.alert(response.data.status, "Target Status");
    });
  };
  ////////////////////////////////////////
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //////////////////////////////////////
  const getresponse = (resurl) => {
    var config = {
      method: "get",
      url: resurl,
    };

    return axios(config)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        window.ps2response = response;
        let code = response.data;
        if (code === 201) {
          console.log("status: " + code);
          return true;
        } else {
          console.log("status code is not 201 =/= " + code);
          await sleep(5000);
          return getresponse(resurl);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //////////////////////////////////
  const checkStatus = () => {
    var data = `{"code":200,"target":{        "name":"${targetname}",        "number":"${targetnumber}"    }}`;

    var config = {
      method: "post",
      url:
        "https://online-checker-b0783-default-rtdb.firebaseio.com/active.json",

      data: data,
    };

    axios(config)
      .then(async function (response) {
        console.log(JSON.stringify(response.data));
        const psresponse = response;
        window.psresponse = psresponse;
        if (psresponse.data.name) {
          var postaddr = psresponse.data.name;
          var resurl = `https://online-checker-b0783-default-rtdb.firebaseio.com/server-response/${postaddr}/code.json`;
          window.resurl = resurl;
          window.getresponse = getresponse;

          window.bug = await getresponse(resurl);
          if (window.bug) {
            console.log("getresponse returned true");
            var resurl = `https://online-checker-b0783-default-rtdb.firebaseio.com/server-response/${postaddr}/response.json`;
            getstatus(resurl);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
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
          onClick={() => {
            if (!progress) {
              setProgress(true);
              checkStatus();
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
          Number requires country code for ex- 91[YourNumberHere] for India
          <br />
          Report the bugs at python3pro@gmail.com
        </BlockFooter>
      </List>
    </Page>
  );
};

export default online;
