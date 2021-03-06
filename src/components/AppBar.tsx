import {
  FC,
  useState,
  useCallback,
  useEffect,
  KeyboardEvent,
  MouseEvent,
} from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import LoadingButton from "@mui/lab/LoadingButton";
import Menu from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { useMoralis } from "react-moralis";
import getEllipsisText from "../utils/getEllipsisText";
import presaleMenu from "../constants/presaleMenu.json";
import AlpsLogoGreen from "../assets/logo/Alps-Logo-Basic-1.svg";
import AlpsLogoWhite from "../assets/logo/Alps-Logo-Basic-3.svg";
import AuthenticationModal from "../components/AuthenticationModal";

const CustomAppBar: FC = () => {
  const { isAuthenticated, account } = useMoralis();
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isYOffsetMoreThan100, setIsYOffsetMoreThan100] =
    useState<boolean>(false);

  const toggleDrawer =
    (_: String, open: boolean) => (event: KeyboardEvent | MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as KeyboardEvent).key === "Tab" ||
          (event as KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setIsOpen(open);
    };

  /**
   * @name handleScroll
   * @description Handle scrolling logic to give app bar box shadow
   */
  const handleScroll = useCallback(() => {
    const position = window.pageYOffset;
    // eslint-disable-next-line no-mixed-operators
    if (position >= 100 !== isYOffsetMoreThan100) {
      setIsYOffsetMoreThan100(position >= 100);
    }
  }, [isYOffsetMoreThan100]);

  const list = (anchor: String) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {presaleMenu.map((menu, index) => (
          <ListItem button key={index}>
            <ListItemText
              primary={menu.name}
              onClick={() => {
                const AlpsFinanceAppURL = menu.url;
                window.open(AlpsFinanceAppURL, "_blank") ||
                  window.location.replace(AlpsFinanceAppURL);
              }}
            />
          </ListItem>
        ))}
      </List>
      <List>
        <LoadingButton
          color="inherit"
          variant="contained"
          sx={{
            borderRadius: 30,
            color: "#0D7E06",
            background: "white",
            ml: 1,
            fontWeight: "bold",
          }}
          onClick={() => setIsAuthModalOpen(true)}
        >
          {isAuthenticated
            ? getEllipsisText(account as string)
            : "Connect Wallet"}
        </LoadingButton>
      </List>
    </Box>
  );

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          pt: 1.5,
          pb: 1.5,
          pl: 3.5,
          backgroundColor: isYOffsetMoreThan100 ? "white" : "transparent",
          transition: "0.3s",
          ...(isYOffsetMoreThan100 && {
            boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
          }),
          "@media (min-width: 780px)": {
            pr: 3.5,
          },
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <img
              src={isYOffsetMoreThan100 ? AlpsLogoGreen : AlpsLogoWhite}
              alt="Alps Logo"
              width={30}
              height="auto"
            />
          </Box>
          {presaleMenu
            .filter((menu) => menu.name !== "Home")
            .map((menu, index) => (
              <Link
                key={index}
                color={
                  isYOffsetMoreThan100 ? theme.palette.secondary.light : "white"
                }
                underline={"none"}
                href={menu.url}
                sx={{
                  pr: 3,
                  fontWeight: "bold",
                  "@media (max-width: 780px)": {
                    display: "none",
                  },
                }}
              >
                {menu.name}
              </Link>
            ))}
          <LoadingButton
            color="inherit"
            variant="contained"
            sx={{
              borderRadius: 30,
              color: "#0D7E06",
              backgroundColor: "white",
              ml: 1,
              "@media (max-width: 780px)": {
                display: "none",
              },
              textTransform: "none",
            }}
            onClick={() => setIsAuthModalOpen(true)}
          >
            <b>
              {isAuthenticated
                ? getEllipsisText(account as string)
                : "Connect Wallet"}
            </b>
          </LoadingButton>
          <Grid
            container
            justifyContent="right"
            alignItems="right"
            sx={{
              "@media (min-width: 780px)": {
                display: "none",
              },
            }}
          >
            <Grid item>
              <Button
                onClick={toggleDrawer("right", true)}
                sx={{
                  color: isYOffsetMoreThan100
                    ? theme.palette.secondary.light
                    : "white",
                }}
              >
                <Menu />
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
        <Drawer
          anchor={"right"}
          open={isOpen}
          onClose={toggleDrawer("right", false)}
          PaperProps={{
            sx: {
              backgroundColor: "#C8CACB",
            },
          }}
        >
          {list("right")}
        </Drawer>
      </AppBar>
      <AuthenticationModal
        open={isAuthModalOpen}
        handleClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default CustomAppBar;
