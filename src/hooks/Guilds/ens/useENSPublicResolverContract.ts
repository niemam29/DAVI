import { useContractRead } from 'wagmi';
import ensPublicResolver from 'contracts/ENSPublicResolver.json';
import {
  convertToIpfsHash,
  convertToNameHash,
} from 'components/ActionsBuilder/SupportedActions/UpdateENSContent/utils';
import { isAvailableOnENS } from './utils';
import useENSResolver from './useENSResolver';
import { MAINNET_ID } from 'utils';

/**
 * @dev This file contains all the functions contained in the ENS Public Resolver contract: https://docs.ens.domains/contract-api-reference/publicresolver
 */

export function useENSAvatarUri(ensName: string, chainId?: number) {
  const supportedChainId = isAvailableOnENS(chainId) ? chainId : MAINNET_ID;
  const { resolver } = useENSResolver(ensName, supportedChainId);
  const { data, ...rest } = useContractRead({
    addressOrName: resolver?.address,
    contractInterface: ensPublicResolver.abi,
    functionName: 'text',
    args: [convertToNameHash(ensName), 'avatar'],
    chainId: supportedChainId,
  });
  return {
    avatarUri: data?.toString(),
    ...rest,
  };
}

export function useENSContentHash(ensName: string, chainId?: number) {
  const supportedChainId = isAvailableOnENS(chainId) ? chainId : MAINNET_ID;
  const { resolver, ...rest } = useENSResolver(ensName, supportedChainId);
  const { data } = useContractRead({
    addressOrName: resolver?.address,
    contractInterface: ensPublicResolver.abi,
    functionName: 'contenthash',
    args: convertToNameHash(ensName),
    select(data) {
      return convertToIpfsHash(data.toString());
    },
  });
  return {
    ipfsHash: data?.toString(),
    ...rest,
  };
}
