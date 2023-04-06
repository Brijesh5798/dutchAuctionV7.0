import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import GreeterArtifact from '../artifacts/contracts/Greeter.sol/Greeter.json';
import AuctionArtifact from '../artifacts/contracts/BasicDutchAuction.sol/BasicDutchAuction.json';
import { Provider } from '../utils/provider';
import { SectionDivider } from './SectionDivider';

const StyledDeployContractButton = styled.button`
  width: 180px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

const StyledGreetingDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
`;

export function Greeter(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, active } = context;

  const [signer, setSigner] = useState<Signer>();
  const [greeterContract, setGreeterContract] = useState<Contract>();
  const [greeterContractAddr, setGreeterContractAddr] = useState<string>('');
  const [auctionContract, setAuctionContract] = useState<Contract>();
  const [auctionContractAddr, setAuctionContractAddr] = useState<string>('');
  const [reservePriceInput, setReservePriceInput] = useState<string>('');
  const [blocksInput, setblocksInput] = useState<string>('');
  const [priceDecrementInput, setPriceDecrementInput] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');
  const [addressInput, setAddressInput] = useState<string>('');
  const [reservePrice, setReservePrice] = useState<string>('');
  const [blocks, setBlocks] = useState<string>('');
  const [priceDecrement, setPriceDecrement] = useState<string>('');
  const [initialPrice, setInitialPrice] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<string>('');
  const [winner, setWinner] = useState<string>('');
  const [bidInput, setBidInput] = useState<string>('');

  useEffect((): void => {
    if (!library) {
      setSigner(undefined);
      return;
    }
    console.log(library.getBlockNumber(),"Current Blocckkkkk");
    setSigner(library.getSigner());
  }, [library]);

  useEffect((): void => {
    if (!greeterContract) {
      return;
    }

    async function getGreeting(greeterContract: Contract): Promise<void> {
      const _greeting = await greeterContract.greet();

      if (_greeting !== greeting) {
        setGreeting(_greeting);
      }
    }

    getGreeting(greeterContract);
  }, [greeterContract, greeting]);

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
        const auctionContract = await auction.deploy(ethers.utils.parseEther(reservePriceInput), blocksInput, ethers.utils.parseEther(priceDecrementInput));
        console.log("deployy");
        
        await auctionContract.deployed();
        console.log("deployyedddd");
        // const greeting = await greeterContract.greet();

        setAuctionContract(auctionContract);
        // setGreeting(greeting);

        window.alert(`Auction contract deployed to: ${auctionContract.address}`);

        setAuctionContractAddr(auctionContract.address);
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    deployAuctionContract(signer);
  }

  function handleAddressChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setAddressInput(event.target.value);
  }

  function handleBidChange(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    setBidInput(event.target.value);
  }

  function handleAddressSubmit(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (!auctionContract) {
      window.alert('Undefined Auction Contract');
      return;
    }

    if (!addressInput) {
      window.alert('Address cannot be empty');
      return;
    }

    async function submitAdress(auctionContract: Contract): Promise<void> {
      try {
        console.log("in tryyyy");
        
        const reservePrice = await auctionContract.reservePrice();
        console.log((ethers.utils.formatEther(reservePrice)),"reservePrice");

        // await setRevPriceTxn.wait();
        setReservePrice(ethers.utils.formatEther(reservePrice))

        const numBlocksAuctionOpen = await auctionContract.numBlocksAuctionOpen();
        console.log(numBlocksAuctionOpen.toNumber(),"numBlocksAuctionOpen");
        
        setBlocks((numBlocksAuctionOpen.toNumber()).toString())

        const offerPriceDecrement = await auctionContract.offerPriceDecrement();
        console.log((ethers.utils.formatEther(offerPriceDecrement)),"offerPriceDecrement");
        setPriceDecrement(ethers.utils.formatEther(offerPriceDecrement))

        const initialPrice = await auctionContract.initialPrice();
        console.log((ethers.utils.formatEther(initialPrice)),"initialPrice");
        setInitialPrice(ethers.utils.formatEther(initialPrice))
        
        const currentBlock = library ? await library.getBlockNumber() : 0
        console.log(currentBlock,"Current blockkkkk");
        
        const startBlock = await auctionContract.auctionStartBlock();
        console.log(startBlock.toNumber(),"startBlock");
        const blockPassed = currentBlock - startBlock
        console.log(blockPassed,"blockPassed");
        console.log(ethers.utils.formatEther(initialPrice),"initialPrice");
        console.log(offerPriceDecrement.toNumber(),"offerPriceDecrement");
        const currentPrice = initialPrice - (blockPassed * offerPriceDecrement)
        console.log(currentPrice,"currentPrice");
        setCurrentPrice(ethers.utils.formatEther(currentPrice.toString()))

        const winner = await auctionContract.winner();
        console.log(winner,"winner");
        setWinner(winner ? winner : "winner not decided")
        // const newGreeting = await greeterContract.greet();
        // window.alert(`Success!\n\nGreeting is now: ${newGreeting}`);

        // if (newGreeting !== greeting) {
        //   setGreeting(newGreeting);
        // }
      } catch (error: any) {
        console.log("in catchh");
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    submitAdress(auctionContract);
  }

  function handleBidSubmit(event: MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    if (!auctionContract) {
      window.alert('Undefined Auction Contract');
      return;
    }

    if (!addressInput) {
      window.alert('Address cannot be empty');
      return;
    }

    async function submitBid(auctionContract: Contract): Promise<void> {
      try {
        const bidxn = await auctionContract.bid({value:ethers.utils.parseEther(bidInput)});

        await bidxn.wait();
        // const newGreeting = await greeterContract.greet();
        // window.alert(`Success!\n\nGreeting is now: ${newGreeting}`);

        // if (newGreeting !== greeting) {
        //   setGreeting(newGreeting);
        // }
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    submitBid(auctionContract);
  }

  return (
    <><>
      {/* <StyledDeployContractButton
      disabled={!active || greeterContract ? true : false}
      style={{
        cursor: !active || greeterContract ? 'not-allowed' : 'pointer',
        borderColor: !active || greeterContract ? 'unset' : 'blue'
      }}
      onClick={handleDeployContract}
    >
      Deploy Greeter Contract
    </StyledDeployContractButton>
    <SectionDivider /> */}
      <StyledLabel htmlFor="reservePriceInput">Reserve Price</StyledLabel><StyledInput
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
      </StyledButton></><StyledGreetingDiv>
        <StyledLabel>Contract addr</StyledLabel>
        <div>
          {auctionContractAddr ? (
            auctionContractAddr
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        {/* <div></div>
        <StyledLabel>Current greeting</StyledLabel>
        <div>
          {greeting ? greeting : <em>{`<Contract not yet deployed>`}</em>}
        </div> */}
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel htmlFor="addressInput">Get Contract Info</StyledLabel>
        <StyledInput
          id="addressInput"
          type="text"
          placeholder={greeting ? '' : '<Contract not yet deployed>'}
          onChange={handleAddressChange}
          style={{ fontStyle: greeting ? 'normal' : 'italic' }}
        ></StyledInput>
        <StyledButton
          disabled={!active || !auctionContract ? true : false}
          style={{
            cursor: !active || !auctionContract ? 'not-allowed' : 'pointer',
            borderColor: !active || !auctionContract ? 'unset' : 'blue'
          }}
          onClick={handleAddressSubmit}
        >
          Submit
        </StyledButton>
        <StyledLabel>Winner</StyledLabel>
        <div>
          {winner ? (
            winner
          ) : (
            <em>{`<Type contract address above>`}</em>
          )}
        </div>
        <div></div>
        <StyledLabel>Reserve Price</StyledLabel>
        <div>
          {reservePrice ? (
            reservePrice
          ) : (
            <em>{`<Type contract address above>`}</em>
          )}
        </div>
        <div></div>
        <StyledLabel>Auction duration</StyledLabel>
        <div>
          {blocks ? (
            blocks
          ) : (
            <em>{`<Type contract address above>`}</em>
          )}
        </div>
        <div></div>
        <StyledLabel>Price decrement per block</StyledLabel>
        <div>
          {priceDecrement ? (
            priceDecrement
          ) : (
            <em>{`<Type contract address above>`}</em>
          )}
        </div>
        <div></div>
        <StyledLabel>Current price</StyledLabel>
        <div>
          {currentPrice ? (
            currentPrice
          ) : (
            <em>{`<Type contract address above>`}</em>
          )}
        </div>
        <div></div>
        <StyledLabel htmlFor="addressInput">Place your bid</StyledLabel>
        <StyledInput
          id="bidInput"
          type="text"
          placeholder={greeting ? '' : '<Contract not yet deployed>'}
          onChange={handleBidChange}
          style={{ fontStyle: greeting ? 'normal' : 'italic' }}
        ></StyledInput>
        <StyledButton
          disabled={!active || !auctionContract ? true : false}
          style={{
            cursor: !active || !auctionContract ? 'not-allowed' : 'pointer',
            borderColor: !active || !auctionContract ? 'unset' : 'blue'
          }}
          onClick={handleBidSubmit}
        >
          Submit
        </StyledButton>
      </StyledGreetingDiv></>
  );
}
