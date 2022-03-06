import Web3 from 'web3';
// import preSaleAbi from "@alpsfinance/core/build/contracts/Presale.json";
import { PRESALE_CONTRACT_ADDRESS } from '../constant';
import { preSaleAbi } from './presaleabi';
import { tokenAbi } from './tokenAbi';

export const calculateTimeLeft = (timestamp: number) => {
  let difference = timestamp - Date.now();

  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

export const regularNumber = (value: number) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const toWeb3 = () => {
  let backupProvider: any = new Web3.providers.HttpProvider(
    process.env.NODE_ENV === "development" ?
      `https://rpc-mumbai.maticvigil.com` : 'https://rpc.ftm.tools'
  );
  // if (true) {
  //   backupProvider = new Web3.providers.WebsocketProvider(
  //     `wss://mainnet.infura.io/ws/v3/${process.env.NEXT_PUBLIC_INFURA_API_KEY}`,
  //   );
  // }
  return new Web3(Web3.givenProvider || backupProvider);
};

export const toPresaleContract = () => {
  const web3 = toWeb3();
  return new web3.eth.Contract(
    JSON.parse(preSaleAbi),
    PRESALE_CONTRACT_ADDRESS
  );
};
export const toTokenContract = (address: string) => {
  const web3 = toWeb3();
  return new web3.eth.Contract(JSON.parse(tokenAbi), address);
};
