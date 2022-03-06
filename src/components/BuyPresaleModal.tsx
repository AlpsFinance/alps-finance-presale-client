import { FC, useState, useMemo, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import Fade from "@mui/material/Fade";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { useSnackbar } from "notistack";
import { useWeb3ExecuteFunction, useMoralis } from "react-moralis";
import { abi as erc20ABI } from "@alpsfinance/core/build/contracts/ERC20.json";
import { abi as presaleABI } from "@alpsfinance/core/build/contracts/Presale.json";
import NULL_ADDRESS from "../utils/nullAddress";
import presaleContractAddress from "../constants/presaleContractAddress.json";
import presalePaymentToken from "../constants/presalePaymentToken.json";
import usePresaleChain from "../hooks/usePresaleChain";

interface BuyPresaleModalProps {
  open: boolean;
  handleClose: () => void;
  paymentTokenAddress: string;
  paymentTokenAmount: string;
  estimatedAlpsPrice: string;
}

const BuyPresaleModal: FC<BuyPresaleModalProps> = (props) => {
  const {
    open,
    handleClose,
    paymentTokenAddress,
    paymentTokenAmount,
    estimatedAlpsPrice,
  } = props;
  const { presaleChain } = usePresaleChain();
  const { Moralis, account, isInitialized } = useMoralis();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const [activeStep, setActiveStep] = useState(0);
  const isERC20 = useMemo(
    () => paymentTokenAddress !== NULL_ADDRESS,
    [paymentTokenAddress]
  );
  const steps = useMemo(
    () => ["Summary", isERC20 && "Approve", "Buy"],
    [isERC20]
  );

  const { data: decimals, fetch: fetchDecimals } = useWeb3ExecuteFunction({
    abi: erc20ABI,
    functionName: "decimals",
    contractAddress: paymentTokenAddress,
    params: {},
  });

  const { data: allowance, fetch: fetchAllowance } = useWeb3ExecuteFunction({
    abi: erc20ABI,
    functionName: "allowance",
    contractAddress: paymentTokenAddress,
    params: {
      owner: account,
      spender: presaleContractAddress[presaleChain].presale,
    },
  });

  const { fetch: fetchApprove } = useWeb3ExecuteFunction({
    abi: erc20ABI,
    functionName: "approve",
    contractAddress: paymentTokenAddress,
    params: {
      spender: presaleContractAddress[presaleChain].presale,
      amount: Moralis.Units.Token(
        estimatedAlpsPrice ?? "0",
        decimals ? parseInt(decimals as string) : 18
      ),
    },
  });

  const { fetch: fetchPresaleTokens } = useWeb3ExecuteFunction({
    abi: presaleABI,
    functionName: "presaleTokens",
    contractAddress: presaleContractAddress[presaleChain].presale,
    params: {
      _paymentTokenAddress: paymentTokenAddress,
      _amount: Moralis.Units.ETH(estimatedAlpsPrice),
    },
    msgValue: isERC20 ? "0" : Moralis.Units.ETH(estimatedAlpsPrice),
  });

  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  useEffect(() => {
    if (isInitialized && open && paymentTokenAddress !== NULL_ADDRESS) {
      fetchDecimals({
        onSuccess: () =>
          fetchAllowance({
            onError: () =>
              enqueueSnackbar(
                "Failed to change to $ALPS token. Please try again later.",
                { variant: "error" }
              ),
          }),
        onError: () =>
          enqueueSnackbar(
            "Failed to change to $ALPS token. Please try again later.",
            { variant: "error" }
          ),
      });
    }
  }, [
    enqueueSnackbar,
    fetchAllowance,
    fetchDecimals,
    isInitialized,
    open,
    paymentTokenAddress,
  ]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Fade}
      fullScreen={!isLargeScreen}
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle>
        <b>Buy Presale</b>
      </DialogTitle>
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map(
            (label) =>
              label && (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              )
          )}
        </Stepper>
        {activeStep === 0 && (
          <>
            <Typography sx={{ pt: 3, pb: 3 }}>
              Please check the following details before proceeding to the next
              step.
            </Typography>
            <Grid container direction="column">
              <Grid item>
                <b>Payment Token:</b>{" "}
                {
                  presalePaymentToken[presaleChain].find(
                    (p) => p?.address === paymentTokenAddress
                  )?.value
                }
              </Grid>
              {isERC20 && (
                <Grid item>
                  <b>Payment Token Address:</b> {paymentTokenAddress}
                </Grid>
              )}
              <Grid item>
                <b>Payment Token Amount:</b> {paymentTokenAmount}
              </Grid>
              <Grid item>
                <b>Estimated Alps Token Received:</b>{" "}
                {parseFloat(estimatedAlpsPrice).toFixed(2)}
              </Grid>
            </Grid>
          </>
        )}
        {activeStep === 1 &&
          (isERC20 ? (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={3}
            >
              <Grid item>
                <Typography textAlign="center">
                  Please approve the token before proceeding to buy $ALPS token.
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  color="inherit"
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    background:
                      "linear-gradient(74.61deg, #0D7E06 18.06%, #00BB89 125.98%);",
                    fontWeight: "bold",
                    width: "100%",
                    textTransform: "none",
                    color: "white",
                  }}
                  //   onClick={() => fetchApprove()}
                >
                  Approve
                </Button>
              </Grid>
            </Grid>
          ) : (
            <></>
          ))}
        {activeStep === 2 && <></>}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={activeStep === 0 ? handleClose : handleBack}
          variant="contained"
          color="error"
        >
          {activeStep === 0 ? "Cancel" : "Previous"}
        </Button>
        <Button onClick={handleNext} variant="contained" color="primary">
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BuyPresaleModal;
