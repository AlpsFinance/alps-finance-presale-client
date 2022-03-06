/**
 * @name usePresaleChain
 * @description Returns the chain to use depending on `NODE_ENV`
 *
 * @returns `0x13881` for development or `0xfa` for production
 */
const usePresaleChain = (): { presaleChain: "0x13881" | "0xfa" } => {
  return {
    presaleChain: process.env.NODE_ENV === "development" ? "0x13881" : "0xfa",
  };
};

export default usePresaleChain;
