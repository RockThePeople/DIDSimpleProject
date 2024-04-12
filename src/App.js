// import Web3 from 'web3'
// import { ethers } from 'ethers';
// import { createJWT, decodeJWT, verifyJWT, ES256KSigner, hexToBytes } from 'did-jwt';
// import { InfuraProvider } from 'ethers';
// import ethr from 'ethr-did-resolver'

import { EthrDID } from 'ethr-did';
import { useEffect, useState } from 'react';
import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver';
import { keypair_1, keypair_2 ,infuraKey, test_key } from './account'
import { SigningKey } from 'ethers';
import { Wallet, BrowserProvider } from 'ethers';

function App() {

  //const web3 = new Web3.providers.HttpProvider(`https://mainnet.infura.io/v3/${infuraKey}`);
  const provider = new BrowserProvider(window.ethereum);
  console.log(window.ethereum)
  const providerConfig = { name: 'mainnet', rpcUrl: `https://mainnet.infura.io/v3/${infuraKey}` };
  const ethrDidResolver = getResolver(providerConfig);
  const resolver = new Resolver(ethrDidResolver);

  const ethrDid_1 = new EthrDID({ ...keypair_1 })
  const ethrDid_2 = new EthrDID({ ...keypair_2 })

  const [jwt, setJwt] = useState('');
  const getSign = async () => {
    const res = await ethrDid_1.signJWT({ claims: { name: 'Dweb', Purpose: "test_1" } })
    setJwt(res);
    console.log(res);
  }

  const getVerify = async () => {
    const res = await ethrDid_2.verifyJWT(jwt, resolver);
    console.log(res);
  }

  useEffect(() => {
    getSign();
    // if(jwt) { getVerify(); }
    //getPublicKey();
    getPublicKey();
  })

  const [ pubKey, setPubkey] = useState("");

  const getPublicKey = async () => {
    const signing = new SigningKey(test_key.privateKey);
    const pubKey = await signing.compressedPublicKey;
    const wallet = new Wallet(signing, provider);
    await wallet.connect(provider);
    // 이거 프로바이더만 찾으면 돼 제발 진짜로 플리즈 한번만
    setPubkey(pubKey);
    console.log(wallet);
  }


  

  // const getPublicKey = async () => {
  //   const pubKey = await window.ethereum.request({
  //     "method": "eth_getEncryptionPublicKey",
  //     "params": [
  //       `${test_key.address}`
  //     ]
  //   })
  //   console.log(pubKey);
  // }

  return (
    <div className="App">
    </div>
  );
}

export default App;