import '@nomiclabs/hardhat-waffle';
import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

task('deploy', 'Deploy Greeter contract').setAction(
  async (_, hre: HardhatRuntimeEnvironment): Promise<void> => {
    const Greeter = await hre.ethers.getContractFactory('Greeter');
    const greeter = await Greeter.deploy('Hello, Hardhat!');

    await greeter.deployed();

    console.log('Greeter deployed to:', greeter.address);

    const BasicDutchAuction = await hre.ethers.getContractFactory('BasicDutchAuction');
    const basicDutchAuction = await BasicDutchAuction.deploy(1000000,10000,100);

    await basicDutchAuction.deployed();

    console.log('BasicDutchAuction deployed to:', basicDutchAuction.address);
  }
  
);
