import { FC, useState, useMemo, useEffect } from "react";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
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
import recordPresale from "../utils/serverlessWorker";

interface BuyPresaleModalProps {
  open: boolean;
  handleClose: () => void;
  paymentTokenAddress: string;
  paymentTokenAmount: string;
  estimatedAlpsReceived: string;
}

const BuyPresaleModal: FC<BuyPresaleModalProps> = (props) => {
  const {
    open,
    handleClose,
    paymentTokenAddress,
    paymentTokenAmount,
    estimatedAlpsReceived,
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
    () => ["Summary", isERC20 && "Approve", "Buy"].filter((s) => s),
    [isERC20]
  );
  const stepsButton = useMemo(() => {
    switch (activeStep) {
      case 1:
        return isERC20 ? "Next" : "Confirm";
      case 2:
        return isERC20 ? "Confirm" : "Close";
      case 3:
        return "Close";
      default:
        return "Next";
    }
  }, [activeStep, isERC20]);

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

  const {
    fetch: fetchApprove,
    isLoading: isApproveLoading,
    isFetching: isApproveFetching,
  } = useWeb3ExecuteFunction({
    abi: erc20ABI,
    functionName: "approve",
    contractAddress: paymentTokenAddress,
    params: {
      spender: presaleContractAddress[presaleChain].presale,
      amount: Moralis.Units.Token(
        paymentTokenAmount !== "" ? paymentTokenAmount : "0",
        decimals ? parseInt(decimals as string) : 18
      ),
    },
  });

  const {
    fetch: fetchPresaleTokens,
    isLoading: isPresaleTokensLoading,
    isFetching: isPresaleTokensFetching,
  } = useWeb3ExecuteFunction({
    abi: presaleABI,
    functionName: "presaleTokens",
    contractAddress: presaleContractAddress[presaleChain].presale,
    params: {
      _paymentTokenAddress: paymentTokenAddress,
      _amount: Moralis.Units.ETH(
        paymentTokenAmount !== "" ? paymentTokenAmount : "0"
      ),
    },
    ...(isERC20
      ? {}
      : {
          msgValue: Moralis.Units.ETH(
            paymentTokenAmount !== "" ? paymentTokenAmount : "0"
          ),
        }),
  });

  /**
   * @name handleNext
   * @description Handle moving steps to the next step
   */
  const handleNext = () => {
    if (activeStep <= steps.length) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  /**
   * @name handleBack
   * @description Handle moving steps to one step back
   */
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  /**
   * @name handlePrimaryButton
   * @description Handle the Primary Green button on the right of the modal
   */
  const handlePrimaryButton = () => {
    switch (activeStep) {
      case 0:
        handleNext();
        break;
      case 1:
        if (isERC20) {
          if (isAllowanceSufficient) {
            handleNext();
          } else {
            enqueueSnackbar("You have not approved yet.", {
              variant: "warning",
            });
          }
        } else {
          fetchPresaleTokens({
            onSuccess: () =>{
              handleNext()
              recordPresale(account ?? '', parseFloat(estimatedAlpsReceived).toFixed(2))
            },
            onError: () =>
              enqueueSnackbar(
                "Failed to purchase $ALPS token. Try again later.",
                {
                  variant: "error",
                }
              ),
          });
        }
        break;
      case 2:
        if (isERC20) {
          fetchPresaleTokens({
            onSuccess: () => {
              handleNext()
              recordPresale(account ?? '', parseFloat(estimatedAlpsReceived).toFixed(2))
            },
            onError: () =>
              enqueueSnackbar(
                "Failed to purchase $ALPS token. Try again later.",
                {
                  variant: "error",
                }
              ),
          });
        } else {
          handleClose();
        }
        break;
      default:
        handleClose();
        break;
    }
  };

  const isAllowanceSufficient = useMemo(
    () =>
      allowance
        ? parseInt((allowance as any).toString()) >=
          parseInt(paymentTokenAmount)
        : false,
    [allowance, paymentTokenAmount]
  );

  useEffect(() => {
    if (isInitialized && open && paymentTokenAddress !== NULL_ADDRESS) {
      fetchDecimals({
        onSuccess: () =>
          fetchAllowance({
            onError: () =>
              enqueueSnackbar("Failed to fetch data. Please try again later.", {
                variant: "error",
              }),
          }),
        onError: () =>
          enqueueSnackbar("Failed to fetch data. Please try again later.", {
            variant: "error",
          }),
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

  useEffect(() => {
    if (!open) {
      // Reset the steps to 0 when closing
      setActiveStep(0);
    }
  }, [open, setActiveStep]);

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
                {parseFloat(estimatedAlpsReceived).toFixed(2)}
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
              sx={{ pt: 3 }}
            >
              {isAllowanceSufficient ? (
                <Grid item>
                  <Typography textAlign="center">
                    Looks like you have enough allowance to buy $ALPS token. To
                    proceed, click the <b>Next</b> button.
                  </Typography>
                </Grid>
              ) : (
                <>
                  <Grid item>
                    <Typography textAlign="center">
                      Please approve the token before proceeding to buy $ALPS
                      token.
                    </Typography>
                  </Grid>
                  <Grid item>
                    <LoadingButton
                      color="inherit"
                      variant="contained"
                      loading={isApproveLoading || isApproveFetching}
                      sx={{
                        borderRadius: 2,
                        background:
                          "linear-gradient(74.61deg, #0D7E06 18.06%, #00BB89 125.98%);",
                        fontWeight: "bold",
                        width: "100%",
                        textTransform: "none",
                        color: "white",
                      }}
                      onClick={() =>
                        fetchApprove({
                          onSuccess: () =>
                            fetchAllowance({
                              onError: () =>
                                enqueueSnackbar(
                                  "Failed to fetch data. Please try again later.",
                                  { variant: "error" }
                                ),
                            }),
                          onError: () =>
                            enqueueSnackbar(
                              "Failed to approve. Try again later.",
                              { variant: "error" }
                            ),
                        })
                      }
                    >
                      Approve
                    </LoadingButton>
                  </Grid>
                </>
              )}
            </Grid>
          ) : (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={3}
              sx={{ pt: 3 }}
            >
              <Grid item>
                <Typography textAlign="center">
                  Click the <b>Confirm</b> button the purchase of{" "}
                  {parseFloat(estimatedAlpsReceived).toFixed(2)} $ALPS token
                  with {paymentTokenAmount}{" "}
                  {
                    presalePaymentToken[presaleChain].find(
                      (p) => p?.address === paymentTokenAddress
                    )?.value
                  }
                  .
                </Typography>
              </Grid>
            </Grid>
          ))}
        {activeStep === 2 &&
          (isERC20 ? (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={3}
              sx={{ pt: 3 }}
            >
              <Grid item>
                <Typography textAlign="center">
                  Click the <b>Confirm</b> button the purchase of{" "}
                  {parseFloat(estimatedAlpsReceived).toFixed(2)} $ALPS token
                  with {paymentTokenAmount}{" "}
                  {
                    presalePaymentToken[presaleChain].find(
                      (p) => p?.address === paymentTokenAddress
                    )?.value
                  }
                  .
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid
              container
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={3}
              sx={{ pt: 3 }}
            >
              <Grid item>
                <Typography textAlign="center" variant="h5">
                  Congratulations 🥳
                </Typography>
              </Grid>
              <Grid item>
                <Typography textAlign="center" variant="h1">
                  🎉
                </Typography>
              </Grid>
              <Grid item>
                <Typography textAlign="center" variant="h5">
                  You just purchased{" "}
                  {parseFloat(estimatedAlpsReceived).toFixed(2)} $ALPS!!!
                </Typography>
              </Grid>
            </Grid>
          ))}
        {activeStep === 3 && (
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={3}
            sx={{ pt: 3 }}
          >
            <Grid item>
              <Typography textAlign="center" variant="h5">
                Congratulations 🥳
              </Typography>
            </Grid>
            <Grid item>
              <Typography textAlign="center" variant="h1">
                🎉
              </Typography>
            </Grid>
            <Grid item>
              <Typography textAlign="center" variant="h5">
                You just purchased{" "}
                {parseFloat(estimatedAlpsReceived).toFixed(2)} $ALPS!!!
              </Typography>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={activeStep === 0 ? handleClose : handleBack}
          disabled={
            isPresaleTokensFetching ||
            isPresaleTokensLoading ||
            isApproveFetching ||
            isApproveLoading
          }
          variant="contained"
          color="error"
        >
          {activeStep === 0 ? "Cancel" : "Previous"}
        </Button>
        <LoadingButton
          loading={isPresaleTokensFetching || isPresaleTokensLoading}
          onClick={handlePrimaryButton}
          variant="contained"
          color="primary"
          sx={{ color: "white" }}
        >
          {stepsButton}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default BuyPresaleModal;
