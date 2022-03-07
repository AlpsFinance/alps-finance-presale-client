import { createContext, FC, useEffect, useState } from "react";
import { useApiContract, useMoralis } from "react-moralis";
import { abi } from "@alpsfinance/core/build/contracts/Presale.json";
import presaleContractAddress from "../constants/presaleContractAddress.json";
import usePresaleChain from "../hooks/usePresaleChain";

interface PresaleDataState {
  startingTime: number;
  usdPrice: number;
  minimumUSDPurchase: number;
  maximumPresaleAmount: number;
}

interface PresaleDataStateWithRound extends PresaleDataState {
  round: number;
}

interface PresaleDataType {
  currentPresaleRound: number;
  totalPresaleRound: number;
  presaleDataMapping: PresaleDataStateWithRound[];
}

export const PresaleContext = createContext<PresaleDataType>({
  currentPresaleRound: 0,
  totalPresaleRound: 0,
  presaleDataMapping: [],
});

const PresaleContextProvider: FC = (props) => {
  const { children } = props;
  const { presaleChain } = usePresaleChain();
  const { isInitialized } = useMoralis();
  const [presaleDataMapping, setPresaleDataMapping] = useState<
    PresaleDataStateWithRound[]
  >([]);

  const {
    data: currentPresaleRound,
    runContractFunction: getCurrentPresaleRound,
  } = useApiContract({
    address: presaleContractAddress[presaleChain].presale,
    functionName: "getCurrentPresaleRound",
    abi,
    chain: presaleChain,
    params: {},
  });

  const { data: totalPresaleRound, runContractFunction: getTotalPresaleRound } =
    useApiContract({
      address: presaleContractAddress[presaleChain].presale,
      functionName: "totalPresaleRound",
      abi,
      chain: presaleChain,
      params: {},
    });

  // @ts-ignore
  const { runContractFunction: getPresaleDetails } = useApiContract({});

  useEffect(() => {
    if (isInitialized) {
      getCurrentPresaleRound({
        onSuccess: () => {
          getTotalPresaleRound({
            onSuccess: async (totalRound) => {
              let presaleMappingArray: PresaleDataStateWithRound[] = [];

              for (
                let presaleRound = 0;
                presaleRound < parseInt(totalRound as string);
                presaleRound++
              ) {
                await getPresaleDetails({
                  params: {
                    address: presaleContractAddress[presaleChain].presale,
                    function_name: "presaleDetailsMapping",
                    // @ts-ignore
                    abi,
                    chain: presaleChain,
                    params: {
                      "": presaleRound.toString(),
                    },
                  },
                  onSuccess: (presaleDetails) => {
                    const {
                      maximumPresaleAmount,
                      minimumUSDPurchase,
                      startingTime,
                      usdPrice,
                    } = (presaleDetails as unknown as PresaleDataState) ?? {};
                    presaleMappingArray.push({
                      round: parseInt(presaleRound as unknown as string),
                      maximumPresaleAmount: parseInt(
                        maximumPresaleAmount as unknown as string
                      ),
                      minimumUSDPurchase: parseInt(
                        minimumUSDPurchase as unknown as string
                      ),
                      startingTime: parseInt(startingTime as unknown as string),
                      usdPrice: parseInt(usdPrice as unknown as string),
                    });
                  },
                });
              }

              setPresaleDataMapping(presaleMappingArray);
            },
          });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    getCurrentPresaleRound,
    getPresaleDetails,
    getTotalPresaleRound,
    isInitialized,
    presaleChain,
  ]);

  return (
    <PresaleContext.Provider
      value={{
        currentPresaleRound: parseInt(currentPresaleRound as string),
        totalPresaleRound: parseInt(totalPresaleRound as string),
        presaleDataMapping,
      }}
    >
      {children}
    </PresaleContext.Provider>
  );
};

export default PresaleContextProvider;
