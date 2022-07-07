import { utils } from 'ethers';
import { useMemo } from 'react';
import { useNetwork } from 'wagmi';
import useIPFSFile from '../ipfs/useIPFSFile';

// TODO: Get the actual token registry hash
const RICH_CONTRACT_DATA_REGISTRY =
  'QmXzDJU14QbYREbaNaornE4QUJA5ANxmTg3zh9fCghmJFQ';

export interface RichContractFunctionParam {
  type: string;
  component: string;
  name: string;
  defaultValue: string;
  description: string;
}

export interface RichContractFunction {
  title: string;
  functionName: string;
  params: RichContractFunctionParam[];
  shortDescription: string;
  longDescription: string;
  templateLiteral: string;
  spendsTokens: boolean;
}

export interface RichContractData {
  title: string;
  tags: string[];
  networks: { [chainId: number]: string };
  functions: RichContractFunction[];
  contractAddress: string;
  contractInterface: utils.Interface;
}

export type IPFSRichContractData = Omit<
  RichContractData,
  'contractAddress' | 'contractInterface'
>;

export const useRichContractRegistry = (chainId?: number) => {
  const { chain: activeChain } = useNetwork();

  const { data, error } = useIPFSFile<IPFSRichContractData[]>(
    RICH_CONTRACT_DATA_REGISTRY
  );

  const registryContracts: RichContractData[] = useMemo(() => {
    if (error || !data) return null;

    return data
      .filter(contract => !!contract.networks[chainId || activeChain?.id])
      .map(contract => {
        // Construct the Ethers Contract interface from registry data
        const contractInterface = new utils.Interface(
          contract.functions.map(f => {
            const name = f.functionName;
            const params = f.params.reduce(
              (acc, cur, i) =>
                acc.concat(
                  `${cur.type} ${cur.name}`,
                  i === f.params.length - 1 ? '' : ', '
                ),
              ''
            );
            return `function ${name}(${params})`;
          })
        );

        return {
          ...contract,
          contractAddress: contract.networks[chainId || activeChain?.id],
          contractInterface,
        };
      });
  }, [chainId, activeChain, data, error]);

  return {
    contracts: registryContracts,
  };
};
