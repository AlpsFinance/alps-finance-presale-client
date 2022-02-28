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

interface props {
  isLargeScreen: Boolean;
}
const BuyContainer: FC<props> = (props: props) => {
  const { isLargeScreen } = props;
  const { isAuthenticated } = useMoralis();
  const { fetch } = useWeb3ExecuteFunction();

  const currencies = [
    {
      value: "FTM",
      label: "FTM",
    },
    {
      value: "USDT",
      label: "USDT",
    },
    {
      value: "DAI",
      label: "DAI",
    },
  ];
  const [token, setToken] = useState("FTM");
  const changeToken = (event: SelectChangeEvent<string>): void => {
    setToken(event.target.value);
  };
  const [amount, setAmount] = useState("0.1");
  const changeAmount = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setAmount(event.target.value);
  };

  const [price, setPrice] = useState("1");
  const submitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log(price);
  };

  const [isCalculating, setIsCalculating] = useState(false);

  const priceOracleAddresses = {
    ftmusd: "0xf4766552D15AE4d256Ad41B6cf2933482B0680dc",
    usdtusd: "0xF64b636c5dFe1d3555A847341cDC449f612307d0",
    daiusd: "0x91d5DEFAFfE2854C7D02F50c80FA1fdc8A721e52",
  };

  useEffect(() => {
    if (isAuthenticated) {
      setIsCalculating(true);
      if (token === "FTM") {
        fetch({
          params: {
            abi: chainlinkFeedAbi,
            functionName: "latestRoundData",
            contractAddress: priceOracleAddresses["ftmusd"],
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
      } else if (token === "USDT") {
        fetch({
          params: {
            abi: chainlinkFeedAbi,
            functionName: "latestRoundData",
            contractAddress: priceOracleAddresses["usdtusd"],
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
        fetch({
          params: {
            abi: chainlinkFeedAbi,
            functionName: "latestRoundData",
            contractAddress: priceOracleAddresses["daiusd"],
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
      }
    }
    // eslint-disable-next-line
  }, [isAuthenticated, token]);
  return (
    <Grid item lg={5} px={isLargeScreen ? 5 : 0} mt={2} mb={2}>
      <Typography variant='h5' sx={{ mb: 2 }}>
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
        <Box component='form' autoComplete='off' onSubmit={submitHandler}>
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
              variant='standard'
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
            <Divider orientation='vertical' flexItem color='white' />
            <FormControl variant='standard' sx={{ minWidth: 100 }}>
              <Select
                labelId='demo-simple-select-standard-label'
                id='demo-simple-select-standard'
                value={token}
                onChange={changeToken}
                label='Age'
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
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            color='inherit'
            variant='contained'
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
            type='submit'
          >
            Buy
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default BuyContainer;
