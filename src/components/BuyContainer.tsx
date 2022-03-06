import { ChangeEvent, /*FormEvent*/ useState, FC } from "react";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
// import LoadingButton from "@mui/lab/LoadingButton";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import { SelectChangeEvent } from "@mui/material/Select";
import { useTheme } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useMoralis } from "react-moralis";
import presalePaymentToken from "../constants/presalePaymentToken.json";
import usePresaleChain from "../hooks/usePresaleChain";
import NULL_ADDRESS from "../utils/nullAddress";
import usePresale from "../hooks/usePresale";
import BuyPresaleModal from "./BuyPresaleModal";

interface PaymentTokenData {
  tokenAddress: string;
  tokenAmount: string;
}

const BuyContainer: FC = (props) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { Moralis } = useMoralis();
  const { presaleChain } = usePresaleChain();
  const { currentPresaleRound, presaleDataMapping } = usePresale();
  const [paymentTokenInfo, setPaymentTokenInfo] = useState<PaymentTokenData>({
    tokenAddress: NULL_ADDRESS,
    tokenAmount: "0",
  });
  const [open, setOpen] = useState<boolean>(false);
  const [isCalculating] = useState<boolean>(false);

  const handleTokenAddressChange = (event: SelectChangeEvent<string>): void => {
    setPaymentTokenInfo({
      ...paymentTokenInfo,
      tokenAddress: event.target.value,
    });
  };
  const handleTokenAmountChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ): void => {
    if (event.target.value === "" || parseFloat(event.target.value)) {
      setPaymentTokenInfo({
        ...paymentTokenInfo,
        tokenAmount: event.target.value,
      });
    }
  };

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
          <Box
            component="form"
            autoComplete="off"
            // onSubmit={submitHandler}
          >
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
              onClick={() => setOpen(true)}
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
      />
    </>
  );
};

export default BuyContainer;
