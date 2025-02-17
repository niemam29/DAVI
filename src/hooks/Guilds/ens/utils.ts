import { MAINNET_ID } from 'utils';

export const isAvailableOnENS = (chainId: number) => {
  const ensNetworks = [MAINNET_ID];
  return ensNetworks.includes(chainId);
};
