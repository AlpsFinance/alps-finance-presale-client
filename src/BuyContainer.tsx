import { ChangeEvent, FormEvent, useState, FC, useEffect } from "react";
import _ from "lodash";
import Typography from "@mui/material/Typography";
import {
  Box,
  TextField,
  Divider,
  FormControl,
  Select,
  MenuItem,
  Button,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { chainlinkFeedAbi } from "./utility/abi";
import BigNumber from "bignumber.js";
import { PRESALE_CONTRACT_ADDRESS } from "./constant";
import { toPresaleContract, toTokenContract } from "./utility/helper";
import { ClipLoader } from "react-spinners";

interface props {
  isLargeScreen: Boolean;
}

type CurrencyData = {
  value: string;
  label: string;
  address: string;
  aggregatorAddress: string;
};

const BuyContainer: FC<props> = (props: props) => {
  const { isLargeScreen } = props;
  const { enableWeb3, isWeb3Enabled, Moralis, user } = useMoralis();
  const getPriceFunc = useWeb3ExecuteFunction();

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  console.log(process.env.NODE_ENV);
  const chain_id = process.env.NODE_ENV === "development" ? "0x13881" : "0xfa";

  const currencies: { [type: string]: CurrencyData[] } = {
    "0xfa": [
      {
        value: "FTM",
        label: "FTM",
        address: "0x0000000000000000000000000000000000000000",
        aggregatorAddress: "0xf4766552D15AE4d256Ad41B6cf2933482B0680dc",
      },
      {
        value: "USDT",
        label: "USDT",
        address: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
        aggregatorAddress: "0x91d5DEFAFfE2854C7D02F50c80FA1fdc8A721e52",
      },
      {
        value: "DAI",
        label: "DAI",
        address: "0x049d68029688eAbF473097a2fC38ef61633A3C7A",
        aggregatorAddress: "0xF64b636c5dFe1d3555A847341cDC449f612307d0",
      },
    ],
    "0x13881": [
      {
        value: "MATIC",
        label: "MATIC",
        address: "0x0000000000000000000000000000000000000000",
        aggregatorAddress: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
      },
      {
        value: "LINK",
        label: "LINK",
        address: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        aggregatorAddress: "0x12162c3E810393dEC01362aBf156D7ecf6159528",
      },
    ],
  };
  const [token, setToken] = useState<CurrencyData>(currencies[chain_id][0]);
  const changeToken = (event: SelectChangeEvent<string>): void => {
    setToken(
      currencies[chain_id].filter(
        (x: CurrencyData) => x.value === event.target.value
      )[0]
    );
  };
  const [amount, setAmount] = useState("0.1");
  const changeAmount = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setAmount(event.target.value);
  };

  const [price, setPrice] = useState("1");
  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(price, amount);
    if (!isWeb3Enabled) {
      await enableWeb3();
    }
    setIsProcessing(true);
    try {
      const ethAddress = user?.get("ethAddress");
      if (token.address === "0x0000000000000000000000000000000000000000") {
        const res = await toPresaleContract()
          .methods.presaleTokens(token.address, Moralis.Units.ETH(amount))
          .send({
            from: ethAddress,
            value: Moralis.Units.ETH(amount),
          });

        console.log(res);
      } else {
        const tokenContract = toTokenContract(token.address);
        const approve = await tokenContract.methods
          .allowance(ethAddress, PRESALE_CONTRACT_ADDRESS)
          .call();
        console.log(approve < Moralis.Units.ETH(amount));
        if (approve < Moralis.Units.ETH(amount)) {
          await tokenContract.methods
            .approve(PRESALE_CONTRACT_ADDRESS, Moralis.Units.ETH(amount))
            .send({ from: ethAddress });
        }
        const res = await toPresaleContract()
          .methods.presaleTokens(token.address, Moralis.Units.ETH(amount))
          .send({ from: ethAddress });
        console.log(res);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (isWeb3Enabled) {
      setIsCalculating(true);
      console.log("getting");
      getPriceFunc.fetch({
        params: {
          abi: chainlinkFeedAbi,
          functionName: "latestRoundData",
          contractAddress: token.aggregatorAddress,
        },
        onComplete: () => {
          setIsCalculating(false);
        },
        onSuccess: (result: any) => {
          const { answer } = result;
          setPrice(answer.toString());
          setAmount(
            String(
              _.ceil(
                25 /
                  new BigNumber(answer.toString())
                    .dividedBy("100000000")
                    .toNumber(),
                2
              )
            )
          );
        },
      });
    } else {
      enableWeb3();
    }
    // eslint-disable-next-line
  }, [isWeb3Enabled, token]);

  return (
    <Grid item lg={5} px={isLargeScreen ? 5 : 0} mt={2} mb={2}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Presale Round 1
      </Typography>
      <Box
        sx={{
          background:
            "linear-gradient(109.06deg, rgba(18, 209, 6, 0.3) 2.72%, rgba(255, 255, 255, 0) 98.2%)",
          boxShadow: "0px 4px 5px 3px rgba(18, 209, 6, 0.1)",
          borderRadius: "10px",
          px: isLargeScreen ? 5 : 1,
          pt: 3,
          pb: 2,
        }}
      >
        <Typography fontWeight={600} sx={{ ml: 0.5, mb: 1 }}>
          Price: 1 Alps = $0.000125
        </Typography>
        <Box component="form" autoComplete="off" onSubmit={submitHandler}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              height: "50px",
              backgroundColor: "#6E856E",
              borderRadius: "10px",
            }}
          >
            <TextField
              required
              variant="standard"
              value={amount}
              onChange={changeAmount}
              disabled={isCalculating}
              InputProps={{
                disableUnderline: true,
                inputMode: "decimal",
              }}
              sx={{
                pl: 1,
                minWidth: "120px",
                Input: {
                  height: "40px",
                  color: "white",
                },
              }}
            />
            <Divider orientation="vertical" flexItem color="white" />
            <FormControl variant="standard" sx={{ minWidth: 100 }}>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={token.value}
                onChange={changeToken}
                label="Age"
                disableUnderline
                sx={{
                  pl: 2,
                  color: "white",
                  height: "50px",
                  svg: {
                    color: "white",
                  },
                }}
              >
                {currencies[chain_id].map((option: any) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            color="inherit"
            variant="contained"
            disabled={isProcessing}
            sx={{
              borderRadius: 2,
              background:
                "linear-gradient(74.61deg, #0D7E06 18.06%, #00BB89 125.98%);",
              mt: 1,
              fontWeight: "bold",
              width: "100%",
              textTransform: "none",
              color: "black",
            }}
            type="submit"
          >
            {isProcessing ? (
              <ClipLoader color={"#fff"} loading={isProcessing} size={30} />
            ) : (
              "Buy"
            )}
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default BuyContainer;
