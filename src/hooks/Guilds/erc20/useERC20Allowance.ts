import ERC20 from 'contracts/ERC20.json';
import { BigNumber } from 'ethers';
import { useContractRead } from 'wagmi';

export const useERC20Allowance = (
  contractAddress: string,
  walletAddress: string,
  spenderAddress: string
) => {
  const { data, ...rest } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: ERC20.abi,
    functionName: 'allowance',
    args: [walletAddress, spenderAddress],
    watch: true,
  });
  return {
    data: data ? BigNumber.from(data) : undefined,
    ...rest,
  };
};
