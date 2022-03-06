import { FC, useState, useMemo } from "react";
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
import NULL_ADDRESS from "../utils/nullAddress";
import presalePaymentToken from "../constants/presalePaymentToken.json";
import usePresaleChain from "../hooks/usePresaleChain";

interface BuyPresaleModalProps {
  open: boolean;
  handleClose: () => void;
  paymentTokenAddress: string;
  paymentTokenAmount: string;
}

const BuyPresaleModal: FC<BuyPresaleModalProps> = (props) => {
  const { open, handleClose, paymentTokenAddress, paymentTokenAmount } = props;
  const { presaleChain } = usePresaleChain();
  const theme = useTheme();
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
                <b>Estimated Alps Token Received:</b> {paymentTokenAmount}
              </Grid>
            </Grid>
          </>
        )}
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
