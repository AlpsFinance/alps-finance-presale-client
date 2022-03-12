/**
 * @name usePresaleChain
 * @description Returns the chain to use depending on `NODE_ENV`
 *
 * @returns `0xa869` for development or `0xa86a` for production
 */
const usePresaleChain = (): { presaleChain: "0xa869" | "0xa86a" } => {
  return {
    presaleChain: process.env.NODE_ENV !== "development" ? "0xa869" : "0xa86a",
  };
};

export default usePresaleChain;
