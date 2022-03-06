import { FC, useState } from "react";
import { useSnackbar } from "notistack";
import { useMoralis } from "react-moralis";
import { useTheme } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import LoadingButton from "@mui/lab/LoadingButton";
import Fade from "@mui/material/Fade";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import WalletLinkConnector from "../connectors/WalletLinkConnector";
import MetamaskLogo from "../assets/wallet/metamask.svg";
import WalletConnectLogo from "../assets/wallet/walletconnect.svg";
import CoinbaseLogo from "../assets/wallet/coinbase.png";

enum AuthenticationType {
  METAMASK = "metamask",
  WALLETCONNECT = "walletconnect",
  COINBASE = "coinbase",
}

interface AuthenticationModalProps {
  open: boolean;
  handleClose: () => void;
}

const AuthenticationModal: FC<AuthenticationModalProps> = (props) => {
  const { open, handleClose } = props;
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { authenticate, logout, isAuthenticated, isAuthenticating } =
    useMoralis();
  const { enqueueSnackbar } = useSnackbar();
  const [walletAuth, setWalletAuth] = useState<AuthenticationType>(
    AuthenticationType.METAMASK
  );
  // temporary weird solution to check when logging out
  const [disconnectLoading, setDisconnectLoading] = useState<boolean>(false);

  /**
   * @name onAuthentication
   * @description Handle Wallet authentication
   *
   * @param {AuthenticationType} type - Wallet type (Metamask, WalletConnect, etc.)
   */
  const onAuthentication = async (type: AuthenticationType) => {
    switch (type) {
      case AuthenticationType.WALLETCONNECT:
        authenticate({
          provider: "walletconnect",
          signingMessage: "Alps Finance Authentication",
          onSuccess: async () => {
            await enqueueSnackbar("Successfully connected to wallet", {
              variant: "success",
            });
            handleClose();
          },
          onError: () =>
            enqueueSnackbar("Failed to connect with WalletConnect", {
              variant: "error",
            }),
        });
        break;
      case AuthenticationType.COINBASE:
        try {
          await authenticate({
            signingMessage: "Alps Finance Authentication",
            // @ts-ignore
            connector: WalletLinkConnector,
            onSuccess: async () => {
              await enqueueSnackbar("Successfully connected to wallet", {
                variant: "success",
              });
              handleClose();
            },
            onError: () =>
              enqueueSnackbar("Failed to connect with Coinbase wallet", {
                variant: "error",
              }),
          });
        } catch (e) {
          enqueueSnackbar("Failed to connect with Coinbase wallet", {
            variant: "error",
          });
        }
        break;
      case AuthenticationType.METAMASK:
      default:
        authenticate({
          signingMessage: "Alps Finance Authentication",
          onSuccess: async () => {
            await enqueueSnackbar("Successfully connected to wallet", {
              variant: "success",
            });
            handleClose();
          },
          onError: () =>
            enqueueSnackbar("Failed to connect with Metamask", {
              variant: "error",
            }),
        });
        break;
    }
  };

  /**
   * @name: onDisconnectingWallet
   * @description Hanlde logging out with Moralis
   */
  const onDisconnectingWallet = async () => {
    try {
      setDisconnectLoading(true);
      await logout();
      setDisconnectLoading(false);
      handleClose();
    } catch (e) {
      enqueueSnackbar("Failed to logout. Try again later.", {
        variant: "error",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Fade}
      fullScreen={!isLargeScreen}
      fullWidth
    >
      <DialogTitle sx={{ textAlign: "center" }}>
        <b>
          {!isAuthenticated && isAuthenticating
            ? `${disconnectLoading ? "Disconnecting" : "Connecting"} Wallet...`
            : `${isAuthenticated ? "Disconnect" : "Connect"}  Wallet`}
        </b>
      </DialogTitle>
      {!isAuthenticated ? (
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          direction="column"
          sx={{ mb: 3 }}
          spacing={3}
        >
          {disconnectLoading ? (
            <CircularProgress sx={{ mt: 5, mb: 5 }} />
          ) : (
            <>
              <Grid item>
                {!isAuthenticated && !isAuthenticating && (
                  <Typography textAlign="center">
                    Select one of the following wallet to connect
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <LoadingButton
                  onClick={() => onAuthentication(AuthenticationType.METAMASK)}
                  color="inherit"
                  variant="outlined"
                  loading={
                    isAuthenticating &&
                    walletAuth === AuthenticationType.METAMASK
                  }
                  disabled={
                    isAuthenticating &&
                    walletAuth !== AuthenticationType.METAMASK
                  }
                  fullWidth
                  sx={{ minWidth: "300px", minHeight: "56px" }}
                >
                  <Grid container justifyContent="center" alignItems="center">
                    <Grid item xs={1} sx={{ pt: 1 }}>
                      <img
                        src={MetamaskLogo}
                        alt="Metamask"
                        height="40px"
                        width="auto"
                        style={{ marginRight: "0.5rem" }}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      Metamask
                    </Grid>
                  </Grid>
                </LoadingButton>
              </Grid>
              <Grid item>
                <LoadingButton
                  onClick={() =>
                    onAuthentication(AuthenticationType.WALLETCONNECT)
                  }
                  color="inherit"
                  variant="outlined"
                  loading={
                    isAuthenticating &&
                    walletAuth === AuthenticationType.WALLETCONNECT
                  }
                  disabled={
                    isAuthenticating &&
                    walletAuth !== AuthenticationType.WALLETCONNECT
                  }
                  fullWidth
                  sx={{ minWidth: "300px", minHeight: "56px" }}
                >
                  <Grid container justifyContent="center" alignItems="center">
                    <Grid item xs={1} sx={{ pt: 1 }}>
                      <img
                        src={WalletConnectLogo}
                        alt="Metamask"
                        height="35px"
                        width="auto"
                        style={{ marginRight: "0.5rem" }}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      WalletConnect
                    </Grid>
                  </Grid>
                </LoadingButton>
              </Grid>
              <Grid item>
                <LoadingButton
                  onClick={() => {
                    setWalletAuth(AuthenticationType.COINBASE);
                    onAuthentication(AuthenticationType.COINBASE);
                  }}
                  color="inherit"
                  variant="outlined"
                  loading={
                    isAuthenticating &&
                    walletAuth === AuthenticationType.COINBASE
                  }
                  disabled={
                    isAuthenticating &&
                    walletAuth !== AuthenticationType.COINBASE
                  }
                  fullWidth
                  sx={{ minWidth: "300px", minHeight: "56px" }}
                >
                  <Grid container justifyContent="center" alignItems="center">
                    <Grid item xs={1} sx={{ pt: 1 }}>
                      <img
                        src={CoinbaseLogo}
                        alt="Metamask"
                        height="35px"
                        width="auto"
                        style={{ marginRight: "0.5rem" }}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      Coinbase
                    </Grid>
                  </Grid>
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
          alignItems="left"
          sx={{ pb: 3, pl: 3, pr: 3 }}
        >
          <Grid item>
            <Typography sx={{ mb: 2 }}>
              Are you sure you want to disconnect your wallet?
            </Typography>
          </Grid>
          <Grid item>
            <Button
              color="inherit"
              variant="contained"
              fullWidth
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
              onClick={onDisconnectingWallet}
            >
              Disconnect Wallet
            </Button>
          </Grid>
        </Grid>
      )}
    </Dialog>
  );
};

export default AuthenticationModal;
