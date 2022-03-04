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
import { preSaleAbi } from "./utility/presaleabi";
import BigNumber from "bignumber.js";

interface props {
  isLargeScreen: Boolean;
}
const BuyContainer: FC<props> = (props: props) => {
  const { isLargeScreen } = props;
  const { isAuthenticated, enableWeb3, isWeb3Enabled, Moralis } = useMoralis();
  const { fetch } = useWeb3ExecuteFunction();

  const tokens = [
    {
      value: "0",
      label: "MATIC",
      contractAddress: "0x0000000000000000000000000000000000000000",
      oracleAddress: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
    },
    {
      value: "1",
      label: "USDT",
      contractAddress: "0x72F09c85234C975Da2B6686e472FE40633fA2Cd9",
      oracleAddress: "0x92C09849638959196E976289418e5973CC96d645",
    },
    {
      value: "2",
      label: "DAI",
      contractAddress: "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F",
      oracleAddress: "0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046",
    },
  ];
  const [selectedToken, setToken] = useState(0);
  const changeToken = (event: SelectChangeEvent<number>): void => {
    setToken(Number(event.target.value));
  };
  const [amount, setAmount] = useState("0.1");
  const changeAmount = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setAmount(event.target.value);
  };
  const [isCalculating, setIsCalculating] = useState(false);

  const submitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    fetch({
      params: {
        abi: preSaleAbi,
        functionName: "presaleTokens",
        contractAddress: "0x446D0E6f6d473ef5Ac7DF1bac47a1740c540a1B3",
        params: {
          _paymentTokenAddress: tokens[selectedToken].contractAddress,
          _amount: new BigNumber(amount).multipliedBy("1000000000000000").toString(),
        },
        // msgValue: Moralis.Units.ETH(1),
      },
      onComplete: () => {
        setIsCalculating(false);
      },
      onError: (result: any) => {
        console.log(result);
      },
      onSuccess: (result: any) => {
        alert(true);
      },
    });
  };

  useEffect(() => {
    if (!isWeb3Enabled) {
      enableWeb3();
    }
    if (isWeb3Enabled) {
      setIsCalculating(true);
      fetch({
        params: {
          abi: chainlinkFeedAbi,
          functionName: "latestRoundData",
          contractAddress: tokens[selectedToken].oracleAddress,
        },
        onComplete: () => {
          setIsCalculating(false);
        },
        onError: (result: any) => {
          console.log(result);
        },
        onSuccess: (result: any) => {
          const { answer } = result;
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
    } else if (!isCalculating) {
      setIsCalculating(true);
    }
    // eslint-disable-next-line
  }, [isAuthenticated, selectedToken]);
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
                value={selectedToken}
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
                {tokens.map((option) => (
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
