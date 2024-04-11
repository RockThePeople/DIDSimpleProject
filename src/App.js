// import Web3 from 'web3'
// import { ethers } from 'ethers';
// import { createJWT, decodeJWT, verifyJWT, ES256KSigner, hexToBytes } from 'did-jwt';
// import { InfuraProvider } from 'ethers';
// import ethr from 'ethr-did-resolver'

import { EthrDID } from 'ethr-did';
import { useEffect, useState } from 'react';
import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver';
import { keypair_1, keypair_2 ,infuraKey } from './account'

function App() {
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