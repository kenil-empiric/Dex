import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import tokenList from "../tokenList1.json";
import axios from "axios";
import { useSendTransaction, useWaitForTransaction } from "wagmi";
import { ethers } from "ethers";
import Abi from "../Abi/abi.json";
import Swapabi from "../Abi/swap.json";

const tokenList1 = [
  {
    ticker: "Eth",
    img: "https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026",
    name: "ethereum",
    address: "0x5fb99aDF344370A6bB2Dc4E8a748aa117f459Bc6",
    decimals: 6,
  },
];

function Swap(props) {
  const { isConnected, address } = props;
  const [slippage, setslippage] = useState(2.5);
  const [tokenOneAmount, settokenOneAmount] = useState();
  const [tokenTwoAmount, settokenTwoAmount] = useState();
  const [ethtoken, setethtoken] = useState(tokenList1[0])
  const [tokenOne, settokenOne] = useState(tokenList[0]);
  const [tokenTwo, settokenTwo] = useState(tokenList[1]);
  const [isOpen, setisOpen] = useState(false);
  const [chnageToken, setchnageToken] = useState(1);
  const [tokenowner, settokenowner] = useState();
  const [Price, setPrice] = useState(null);
  const [constract1, setconstract1] = useState();
  const [txDetails, settxDetails] = useState({
    to: null,
    data: null,
    value: null,
  });
  const { data, sendTransaction } = useSendTransaction({
    request: {
      from: address,
      to: String(txDetails.to),
      data: String(txDetails.data),
      value: String(txDetails.value),
    },
  });

  function handleslippage(e) {
    setslippage(e.target.value);
  }

  function chnageAmount(e) {
    settokenOneAmount(e.target.value);
    console.log(Price);
    if (e.target.value && Price) {
      settokenTwoAmount((e.target.value * Price.ratio).toFixed(2));
    } else {
      settokenTwoAmount(null);
    }
  }

  function switchTokens() {
    setPrice(null);
    settokenOneAmount(null);
    settokenTwoAmount(null);
    const one = tokenOne;
    const two = tokenTwo;
    settokenOne(two);
    settokenTwo(one);
    fetchPrices(two.address, one.address);
  }

  function openModal(asset) {
    setchnageToken(asset);
    setisOpen(true);
  }

  function modifytoken(i) {
    setPrice(null);
    settokenOneAmount(null);
    settokenTwoAmount(null);
    if (chnageToken === 1) {
      settokenOne(tokenList[i]);

      fetchPrices(tokenList[i].address, tokenTwo.address);
    } else {
      settokenTwo(tokenList[i]);
      console.log(tokenOne.address, tokenList[i].address);
      fetchPrices(tokenOne.address, tokenList[i].address);
    }
    setisOpen(false);
  }

  async function fetchPrices(one, two) {
    if (window.ethereum) {
      console.log(one, two);

      const contract_add1 = one;
      const contract_add2 = two;
      const contract_abi = Abi;
      // const { ethereum } = window;
      const provider = await new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const contract1 = await new ethers.Contract(
        contract_add1,
        contract_abi,
        signer
      );
      const contract2 = await new ethers.Contract(
        contract_add2,
        contract_abi,
        signer
      );
      console.log(contract1);
      const price1 = await contract1.tokenPrice();
      const price2 = await contract2.tokenPrice();
      const tokenowner = await contract2.owner();
      console.log("asdfsf", tokenowner);
      settokenowner(tokenowner);
      // const res= await axios.get(`http://localhost:3002/tokenPrice`,{ params: {addressOne:one,addressTwo:two}})
      // console.log(res.data);
      console.log(Number(price1), Number(price2));
      const priceset = {
        price1: Number(price1),
        price2: Number(price2),
        ratio: Number(price1) / Number(price2),
      };
      setconstract1(contract1);
      setPrice(priceset);
      // console.log(contract1);
      // await setconstract1(contract1)
    }
  }

  async function fetchDexswap() {
    const allownce = await axios.get(
      `https://api.1inch.io/v5.2/1/approve/allowance?tokenAddress=${tokenOne.address}&walletAddress=${address}`
    );

    if (allownce.data.allownce === "0") {
      const approve = await axios.get(
        `https://api.1inch.io/v5.2/1/approve/transaction?tokenAddress=${tokenOne.address}`
      );

      settxDetails(approve.data);
      console.log("not approve");
      return;
    }

    // const tx= await axios.get(``)
    console.log("make swap");
  }

  useEffect(() => {
    fetchPrices(tokenList[0].address, tokenList[1].address);
  }, []);

  useEffect(() => {
    if (txDetails.to && isConnected) {
      sendTransaction();
    }
  }, [txDetails]);

  const swapfunction = async (e) => {
    e.preventDefault();
    const contract_add = "0xD51DE8Cb428035F8FCe4793ba6cC10B9504029a8";
    const contract_abi = Swapabi;
    // const { ethereum } = window;
    const provider = await new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const contract1 = await new ethers.Contract(
      contract_add,
      contract_abi,
      signer
    );
    const numtowei1 = ethers.utils.parseUnits(`${tokenOneAmount}`);
    const numtowei2 = ethers.utils.parseUnits(`${tokenTwoAmount}`);
    const txcharge = ethers.utils.parseUnits(`0.000001`);
    console.log(tokenOne.address, tokenTwo.address);
    console.log("----", tokenOneAmount, tokenTwoAmount);
    console.log("----", Number(numtowei1), Number(numtowei2));
    const gasLimit = 150000;
    if (buttonclicck==true){
      const trasection = await contract1.buyTokens(tokenowner,tokenTwo.address,numtowei2,{ value: `${numtowei1}`, gasLimit: gasLimit })
    }else{
      const approvetx = await constract1.approve(contract_add, numtowei1);
      const apptx = await approvetx.wait();
      console.log(apptx);
      const trasectionparamiter = {
        tokenowner: tokenowner,
        fromaddress: tokenOne.address,
        fromTo: tokenTwo.address,
        fromamount: numtowei1,
        toamount: numtowei2,
      };
      console.log(trasectionparamiter);
      const trasection = await contract1.Tokensswap(
        tokenowner,
        tokenOne.address,
        tokenTwo.address,
        numtowei1,
        numtowei2,
        { value: `${txcharge}`, gasLimit: gasLimit }
      );
      const tx = await trasection.wait();
      console.log(tx);
    }
    
    // const transection= await contract1.buyTokens(tokenTwo.address,numtowei2 ,{ value :`${numtowei1}`,gasLimit: gasLimit,})
    // const tx= transection.wait()
    // console.log(tx);
  };

  const [buttonclicck, setbuttonclicck] = useState(false);
  const buttonfun = async () => {
    if (buttonclicck == true) {
      setbuttonclicck(false);
    } else {
      setbuttonclicck(true);
    }
  };

  console.log("-------------------------------", buttonclicck);

  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleslippage}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  return (
    <>
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setisOpen(false)}
        title="Select a token"
      >
        <div className="modalContent">
          {tokenList?.map((e, i) => {
            return (
              <div
                className="tokenChoice"
                key={i}
                onClick={() => modifytoken(i)}
              >
                <img src={e.img} alt={e.ticker} className="tokenLogo" />
                <div className="tokenChoiceNames">
                  <div className="tokenName">{e.name}</div>
                  <div className="tokenTicker">{e.ticker}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
      <div className="tradeBox">
        <form onSubmit={swapfunction}>
          <div className="tradeBoxHeader">
            <h4>Swap</h4>
            <button
              type="button"
              onClick={buttonfun}
              className={`button ${buttonclicck ? "even" : "odd"}`}
            >
              {buttonclicck ? "Eth to token" : "Token to token"}
            </button>

            <Popover
              content={settings}
              title="Settings"
              trigger="click"
              placement="bottomRight"
            >
              <SettingOutlined className="cog" />
            </Popover>
          </div>
          <div className="inputs">
            <Input
              placeholder="0"
              value={tokenOneAmount}
              onChange={chnageAmount}
              // disabled={!Price}
            />
            <Input placeholder="0" value={tokenTwoAmount} disabled={true} />

            <div className="switchButton" onClick={switchTokens}>
              <ArrowDownOutlined className="switchArrow" />
            </div>

            {buttonclicck ? (
              <div className="assetOne" >
                <img
                  src={ethtoken.img}
                  alt="assetOneLogo"
                  className="assetLogo"
                />
                {ethtoken.ticker}
                <DownOutlined />
              </div>
            ) : (
              <div className="assetOne" onClick={() => openModal(1)}>
                <img
                  src={tokenOne.img}
                  alt="assetOneLogo"
                  className="assetLogo"
                />
                {tokenOne.ticker}
                <DownOutlined />
              </div>
            )}

            <div className="assetTwo" onClick={() => openModal(2)}>
              <img
                src={tokenTwo.img}
                alt="assetOneLogo"
                className="assetLogo"
              />
              {tokenTwo.ticker}
              <DownOutlined />
            </div>
          </div>

          <button
            type="submit"
            className="swapButton"
            disabled={!tokenOneAmount || !isConnected}
          >
            {" "}
            Swap
          </button>
        </form>
      </div>
    </>
  );
}

export default Swap;
