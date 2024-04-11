// import Web3 from 'web3'
// import { ethers } from 'ethers';
// import { createJWT, decodeJWT, verifyJWT, ES256KSigner, hexToBytes } from 'did-jwt';
// import { InfuraProvider } from 'ethers';
// import ethr from 'ethr-did-resolver'

import { EthrDID } from 'ethr-did';
import { useEffect, useState } from 'react';
import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver';

function App() {
  const providerConfig = { name: 'mainnet', rpcUrl: 'https://mainnet.infura.io/v3/c249e2789fff4a6db1fd3ea782ffe5a4' };
  const ethrDidResolver = getResolver(providerConfig);
  const resolver = new Resolver(ethrDidResolver);

  const keypair_1 = {
    address: '0x9021361C5226099AA99370DfeD181c9E31469d3B',
    privateKey: '0x1de50334b47bc59027ecb6450637c333a57566941e29e51859c030de1261662b',
    publicKey: '0x0361e0984afc0e6dbb76a2fc2f7f1e86d63613f42ce032a8e26a812c82bd9bc1e3',
    identifier: '0x0361e0984afc0e6dbb76a2fc2f7f1e86d63613f42ce032a8e26a812c82bd9bc1e3'
  }
  const keypair_2 = {
    address: '0xedf57bC0e2775433E97d85c996bB03e1dbaa57c5',
    privateKey: '0xf0606ffc7b56978633d766bf6d4ab3ddbd441ae83d2bb85110017287960aeb2a',
    publicKey: '0x024b6eb1a2be6962813f27864c22bc0a283ae5fffa099a7cea7eceef0b088eebf6',
    identifier: '0x024b6eb1a2be6962813f27864c22bc0a283ae5fffa099a7cea7eceef0b088eebf6'
  }

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
    if(jwt) { getVerify(); }
  })

  return (
    <div className="App">
    </div>
  );
}

export default App;


// const [account, setAccount] = useState(null)
// const getRequestAccounts = async () => {
//   const [account] = await window.ethereum.request({
//     method: 'eth_requestAccounts',
//   })
//   setAccount(account);
// }
// useEffect(() => {
//   getRequestAccounts();
// }, []);