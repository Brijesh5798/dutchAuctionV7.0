import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import AuctionArtifact from '../artifacts/contracts/BasicDutchAuction.sol/BasicDutchAuction.json';
import styled from 'styled-components';
import { Provider } from '../utils/provider';

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;

export function SignMessage(): ReactElement {
  const context = useWeb3React<Provider>();
  const [signer, setSigner] = useState<Signer>();
  const { account, active, library } = context;
  const [auctionContract, setAuctionContract] = useState<Contract>();
  const [auctionContractAddr, setAuctionContractAddr] = useState<string>('');
  const [reservePriceInput, setReservePriceInput] = useState<string>('');
  const [blocksInput, setblocksInput] = useState<string>('');
  const [priceDecrementInput, setPriceDecrementInput] = useState<string>('');

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);


  function handleReservePriceChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setReservePriceInput(event.target.value);
  }

  function handleBlocksChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setblocksInput(event.target.value);
  }

  function handlePriceDecrementChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setPriceDecrementInput(event.target.value);
  }

  function handleDeployContract(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    // only deploy the Greeter contract one time, when a signer is defined
    if (auctionContract || !signer) {
      return;
    }

    async function deployAuctionContract(signer: Signer): Promise<void> {
      const auction = new ethers.ContractFactory(
        AuctionArtifact.abi,
        AuctionArtifact.bytecode,
        signer
      );
      console.log("got info");
      

      try {
        const auctionContract = await auction.deploy(reservePriceInput, blocksInput, priceDecrementInput);
        console.log("deployy");
        
        await auctionContract.deployed();
        console.log("deployyedddd");
        // const greeting = await greeterContract.greet();

        setAuctionContract(auctionContract);
        // setGreeting(greeting);

        window.alert(`Greeter deployed to: ${auctionContract.address}`);

        setAuctionContractAddr(auctionContract.address);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    deployAuctionContract(signer);
  }

  return (
    <><StyledLabel htmlFor="reservePriceInput">Reserve Price</StyledLabel><StyledInput
      id="reservePriceInput"
      type="text"
      onChange={handleReservePriceChange}
      style={{ fontStyle: 'italic' }}
    ></StyledInput>
    <StyledLabel htmlFor="blocksInput">Number of Blocks for auction duration</StyledLabel><StyledInput
      id="blocksInput"
      type="text"
      onChange={handleBlocksChange}
      style={{ fontStyle: 'italic' }}
    ></StyledInput>
    <StyledLabel htmlFor="priceDecrementInput">Price decrement per block</StyledLabel><StyledInput
      id="priceDecrementInput"
      type="text"
      onChange={handlePriceDecrementChange}
      style={{ fontStyle: 'italic' }}
    ></StyledInput>
    <StyledButton
      disabled={!active ? true : false}
      style={{
        cursor: !active ? 'not-allowed' : 'pointer',
        borderColor: !active ? 'unset' : 'blue'
      }}
      onClick={handleDeployContract}
    >
        Deploy Contract
      </StyledButton></>
  );
}
