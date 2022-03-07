import { ChangeEvent, useState, FC, useEffect, useMemo } from "react";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { SelectChangeEvent } from "@mui/material/Select";
import { useTheme } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMoralis, useApiContract } from "react-moralis";
import { useSnackbar } from "notistack";
import presalePaymentToken from "../constants/presalePaymentToken.json";
import usePresaleChain from "../hooks/usePresaleChain";
import NULL_ADDRESS from "../utils/nullAddress";
import usePresale from "../hooks/usePresale";
import BuyPresaleModal from "./BuyPresaleModal";
import chainlinkFeedABI from "../abi/chainlinkePriceFeed.json";
import { CircularProgress } from "@mui/material";

interface PaymentTokenData {
  tokenAddress: string;
  tokenAmount: string;
}

const BuyContainer: FC = (props) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { Moralis, isInitialized } = useMoralis();
  const { enqueueSnackbar } = useSnackbar();
  const { presaleChain } = usePresaleChain();
  const { currentPresaleRound, presaleDataMapping } = usePresale();
  const currentPresale = presaleDataMapping.find(
    (p) => p.round === currentPresaleRound
  );
  const [paymentTokenInfo, setPaymentTokenInfo] = useState<PaymentTokenData>({
    tokenAddress: NULL_ADDRESS,
    tokenAmount: "0",
  });
  const [open, setOpen] = useState<boolean>(false);

  const {
    data: decimals,
    runContractFunction: runDecimals,
    isLoading: isDecimalsLoading,
    isFetching: isDecimalsFetching,
  } = useApiContract({
    address: presalePaymentToken[presaleChain].find(
      (p) => p.address === paymentTokenInfo.tokenAddress
    )?.aggregatorAddress,
    functionName: "decimals",
    abi: chainlinkFeedABI,
    chain: presaleChain,
    params: {},
  });

  const {
    data: latestRoundData,
    runContractFunction: runLatestRoundData,
    isLoading: isLatestRoundDataLoading,
    isFetching: isLatestRoundDataFetching,
  } = useApiContract({
    address: presalePaymentToken[presaleChain].find(
      (p) => p.address === paymentTokenInfo.tokenAddress
    )?.aggregatorAddress,
    functionName: "latestRoundData",
    abi: chainlinkFeedABI,
    chain: presaleChain,
    params: {},
  });

  /**
   * @name handleTokenAddressChange
   * @description Handle Changes of Token Address dropdown
   */
  const handleTokenAddressChange = (event: SelectChangeEvent<string>): void => {
    setPaymentTokenInfo({
      ...paymentTokenInfo,
      tokenAddress: event.target.value,
    });
  };

  /**
   * @name handleTokenAmountChange
   * @description Handle changes of token amount for purchase
   */
  const handleTokenAmountChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    if (
      event.target.value === "" ||
      /^[0-9]+(\.[0-9]*)?$/.test(event.target.value)
    ) {
      setPaymentTokenInfo({
        ...paymentTokenInfo,
        tokenAmount: event.target.value,
      });
    }
  };

  const isLoading = useMemo(
    () =>
      isDecimalsLoading ||
      isLatestRoundDataLoading ||
      isLatestRoundDataFetching ||
      isDecimalsFetching,
    [
      isDecimalsFetching,
      isDecimalsLoading,
      isLatestRoundDataFetching,
      isLatestRoundDataLoading,
    ]
  );

  const paymentTokenUSDValue = useMemo(
    () =>
      isLoading
        ? 0 // to avoid having not updated decimals and latestRoundData calculated together
        : parseFloat(
            Moralis.Units.FromWei(
              (latestRoundData as any)?.answer ?? "0",
              parseInt(decimals ?? "18")
            )
          ) *
          parseFloat(
            paymentTokenInfo.tokenAmount !== ""
              ? paymentTokenInfo.tokenAmount
              : "0"
          ),
    [
      Moralis.Units,
      decimals,
      isLoading,
      latestRoundData,
      paymentTokenInfo.tokenAmount,
    ]
  );

  const estimatedAlpsReceived = useMemo(
    () =>
      isLoading && !currentPresale?.usdPrice
        ? 0 // to avoid having not updated decimals and latestRoundData calculated together
        : paymentTokenUSDValue / ((currentPresale?.usdPrice ?? 1e18) / 1e18),
    [currentPresale?.usdPrice, isLoading, paymentTokenUSDValue]
  );

  useEffect(() => {
    if (isInitialized && paymentTokenInfo.tokenAddress) {
      runDecimals({
        onSuccess: () =>
          runLatestRoundData({
            onError: () =>
              enqueueSnackbar(
                "Failed to convert price to $ALPS token. Please try again later.",
                { variant: "error" }
              ),
          }),
        onError: () =>
          enqueueSnackbar(
            "Failed to convert price to $ALPS token. Please try again later.",
            { variant: "error" }
          ),
      });
    }
  }, [
    enqueueSnackbar,
    isInitialized,
    paymentTokenInfo.tokenAddress,
    runDecimals,
    runLatestRoundData,
  ]);

  return (
    <>
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
          <Typography fontWeight={600} textAlign="center" sx={{ ml: 0.5 }}>
            1 $ALPS = ${" "}
            {Moralis.Units.FromWei(
              (
                presaleDataMapping.find((d) => d?.round === currentPresaleRound)
                  ?.usdPrice ?? 0
              ).toString()
            )}
          </Typography>
          <Box component="form" autoComplete="off">
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                height: "50px",
                backgroundColor: "#6E856E",
                borderRadius: "10px",
                mt: 1,
                mb: 1,
              }}
            >
              <TextField
                required
                variant="standard"
                name="tokenAmount"
                value={paymentTokenInfo?.tokenAmount}
                onChange={handleTokenAmountChange}
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
                  name="tokenAddress"
                  value={paymentTokenInfo?.tokenAddress}
                  onChange={handleTokenAddressChange}
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
                        <Grid container spacing={1} alignItems="center">
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
            <Typography>
              <i>
                Est. Received:{" "}
                {isLoading ? (
                  <CircularProgress size={15} sx={{ ml: 2 }} />
                ) : (
                  `${estimatedAlpsReceived.toFixed(2)} $ALPS`
                )}{" "}
              </i>
            </Typography>
            <Button
              color="inherit"
              variant="contained"
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
              onClick={() => {
                // Check whether the amount of token wanted to buy is 0 or not
                if (estimatedAlpsReceived <= 0) {
                  enqueueSnackbar("Input the amount should be larger than 0!", {
                    variant: "warning",
                  });
                }
                // Check whether the minimum amount of purchase is fulfilled
                else if (
                  currentPresale?.minimumUSDPurchase &&
                  paymentTokenUSDValue <
                    parseFloat(
                      Moralis.Units.FromWei(
                        (currentPresale?.minimumUSDPurchase ?? 0).toString()
                      )
                    )
                ) {
                  enqueueSnackbar(
                    `Amount of purchase cannot be less than the minimum of $${Moralis.Units.FromWei(
                      (currentPresale?.minimumUSDPurchase ?? 0).toString()
                    )}!`,
                    {
                      variant: "warning",
                    }
                  );
                } else {
                  setOpen(true);
                }
              }}
            >
              Buy
            </Button>
          </Box>
        </Box>
      </Grid>
      <BuyPresaleModal
        open={open}
        handleClose={() => setOpen(false)}
        paymentTokenAddress={paymentTokenInfo.tokenAddress}
        paymentTokenAmount={paymentTokenInfo.tokenAmount}
        estimatedAlpsReceived={estimatedAlpsReceived.toString()}
      />
    </>
  );
};

export default BuyContainer;
