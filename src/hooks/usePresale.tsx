import { useContext } from "react";
import { PresaleContext } from "../provider/PresaleContextProvider";

const usePresale = () => {
  const { currentPresaleRound, totalPresaleRound, presaleDataMapping } =
    useContext(PresaleContext);

  return {
    currentPresaleRound,
    totalPresaleRound,
    presaleDataMapping,
  };
};

export default usePresale;
