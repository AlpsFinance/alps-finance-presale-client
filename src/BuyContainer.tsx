import { ChangeEvent, FormEvent, useState, FC } from "react";
import _ from "lodash";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { SelectChangeEvent } from "@mui/material/Select";
import { useWeb3ExecuteFunction } from "react-moralis";
// import chainlinkFeedAbi from "./abi/chainlinkePriceFeed.json";
// import BigNumber from "bignumber.js";
// import presaleContractAddress from "./constants/presaleContractAddress.json";
import presalePaymentToken from "./constants/presalePaymentToken.json";
import usePresaleChain from "./hooks/usePresaleChain";
import NULL_ADDRESS from "./utils/nullAddress";

interface props {
  isLargeScreen: Boolean;
}

// type CurrencyData = {
//   value: string;
//   label: string;
//   address: string;
//   aggregatorAddress: string;
// };

const BuyContainer: FC<props> = (props: props) => {
  const { isLargeScreen } = props;
  // const { enableWeb3, isWeb3Enabled } = useMoralis();
  const { isLoading } = useWeb3ExecuteFunction();
  const { presaleChain } = usePresaleChain();
  const [tokenAddress, setTokenAddress] = useState<string>(NULL_ADDRESS);
  const [tokenAmount, setTokenAmount] = useState<string>("0");
  const [price] = useState("1");
  const [isCalculating] = useState(false);

  const changeToken = (event: SelectChangeEvent<string>): void => {
    setTokenAddress(event.target.value);
  };
  const changeAmount = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    setTokenAmount(event.target.value);
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const ethAddress = user?.get("ethAddress");
    // if (token.address === "0x0000000000000000000000000000000000000000") {
    //   const res = await toPresaleContract()
    //     .methods.presaleTokens(token.address, Moralis.Units.ETH(amount))
    //     .send({
    //       from: ethAddress,
    //       value: Moralis.Units.ETH(amount),
    //     });
    // } else {
    //   const tokenContract = toTokenContract(token.address);
    //   const approve = await tokenContract.methods
    //     .allowance(ethAddress, PRESALE_CONTRACT_ADDRESS)
    //     .call();
    //   if (approve < Moralis.Units.ETH(amount)) {
    //     await tokenContract.methods
    //       .approve(PRESALE_CONTRACT_ADDRESS, Moralis.Units.ETH(amount))
    //       .send({ from: ethAddress });
    //   }
    //   const res = await toPresaleContract()
    //     .methods.presaleTokens(token.address, Moralis.Units.ETH(amount))
    //     .send({ from: ethAddress });
    // }
  };

  // useEffect(() => {
  // if (isWeb3Enabled) {
  //     setIsCalculating(true);
  //     getPriceFunc.fetch({
  //       params: {
  //         abi: chainlinkFeedAbi,
  //         functionName: "latestRoundData",
  //         contractAddress: token.aggregatorAddress,
  //       },
  //       onComplete: () => {
  //         setIsCalculating(false);
  //       },
  //       onSuccess: (result: any) => {
  //         const { answer } = result;
  //         setPrice(answer.toString());
  //         setAmount(
  //           String(
  //             _.ceil(
  //               25 /
  //                 new BigNumber(answer.toString())
  //                   .dividedBy("100000000")
  //                   .toNumber(),
  //               2
  //             )
  //           )
  //         );
  //       },
  //     });
  //   }
  //   // eslint-disable-next-line
  // }, [isWeb3Enabled, token]);

  return (
    <Grid item lg={5} px={isLargeScreen ? 5 : 0} mt={2} mb={2}>
      <Box
        sx={{
          background:
            "linear-gradient(109.06deg, rgba(18, 209, 6, 0.3) 2.72%, rgba(255, 255, 255, 0) 98.2%)",
          boxShadow: "0px 4px 5px 3px rgba(18, 209, 6, 0.1)",
          borderRadius: "10px",
          px: isLargeScreen ? 5 : 1,
          pt: 3,
          pb: 3,
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
              value={tokenAmount}
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
                value={tokenAddress}
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
                {presalePaymentToken[presaleChain].map((option: any) => {
                  const { value, address, logo } = option;
                  return (
                    <MenuItem key={value} value={address}>
                      <Grid
                        container
                        spacing={1}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Grid item>
                          <img
                            src={logo}
                            alt="dsf"
                            height="20px"
                            style={{ marginTop: "5px" }}
                          />
                        </Grid>
                        <Grid item>{value}</Grid>
                      </Grid>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <LoadingButton
            color="inherit"
            variant="contained"
            loading={isLoading}
            sx={{
              borderRadius: 2,
              background:
                "linear-gradient(74.61deg, #0D7E06 18.06%, #00BB89 125.98%);",
              mt: 1,
              fontWeight: "bold",
              width: "100%",
              textTransform: "none",
              color: "white",
            }}
            type="submit"
          >
            Buy
          </LoadingButton>
        </Box>
      </Box>
    </Grid>
  );
};

export default BuyContainer;
