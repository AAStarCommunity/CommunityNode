import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Wallet } from '../../../entities/wallet';
import { PrimeSdk } from '@etherspot/prime-sdk';
import { ethers } from 'ethers';
import { getBalanceDto, checkDto, opDto } from '../controller/wallet.dto';

interface Response {
  status: number;
  message: string;
  data: any;
}
@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async batchCreate(numWallet: number): Promise<string> {
    console.log('batchCreate start ....');
    for (let i = 0; i < numWallet; i++) {
      await (async () => {
        // generate random mnemonic
        const mnemonic = ethers.Mnemonic.entropyToPhrase(
          ethers.randomBytes(32),
        );
        // create HD wallet
        const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
        const wallet = ethers.Wallet.fromPhrase(mnemonic);

        // The password used to encrypt json can be changed to something else
        const pwd = 'planckerDev';
        const json = await wallet.encrypt(pwd);

        // Create AA Wallet with HD Wallet
        const primeSdk = new PrimeSdk(
          {
            privateKey: hdNode.privateKey,
          },
          {
            chainId: 11155111,
            projectKey: '',
            rpcProviderUrl: 'https://sepolia-bundler.etherspot.io/',
          },
        );
        const address: string = await primeSdk.getCounterFactualAddress();

        // save sqllite
        await this.walletRepository.save({
          address: address,
          password: JSON.stringify(json),
        });
        console.log(`create wallet: ${i + 1} ${address}`);
      })();
    }
    return '';
  }

  async _createPrimeSdk(certificate: string): Promise<PrimeSdk> {
    let privateKey = null;
    if (certificate === '') {
      // generate random mnemonic
      const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32));
      // create HD wallet
      const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
      privateKey = hdNode.privateKey;
    } else {
      //let wallet: Wallet;
      const wallet = await this.walletRepository.findOne({
        where: { certificate: certificate },
      });

      if (wallet != null) {
        const pwd = 'planckerDev';
        const wallet2 = await ethers.Wallet.fromEncryptedJson(
          JSON.parse(wallet.password),
          pwd,
        );
        const mnemonic = wallet2['mnemonic'].phrase;

        const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
        privateKey = hdNode.privateKey;
      }
    }

    // Create AA Wallet with HD Wallet
    const primeSdk = new PrimeSdk(
      {
        privateKey: privateKey,
      },
      {
        chainId: 11155111,
        projectKey: '',
        rpcProviderUrl: 'https://sepolia-bundler.etherspot.io/',
      },
    );

    return primeSdk;
  }  }
}
