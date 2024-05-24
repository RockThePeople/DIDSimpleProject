import { EthrDID } from 'ethr-did';
import { useEffect, useState } from 'react';
import { Resolver } from 'did-resolver';
import { getResolver } from 'ethr-did-resolver';
import { keypair_2, infuraKey, employee_test } from './account';
import { createJWT } from 'did-jwt';

const URL = "http://127.0.0.1:8080";

function App() {

  //const provider = new BrowserProvider(window.ethereum);
  const providerConfig = { name: 'mainnet', rpcUrl: `https://mainnet.infura.io/v3/${infuraKey}` };
  const ethrDidResolver = getResolver(providerConfig);
  const resolver = new Resolver(ethrDidResolver);

  useEffect(() => {
    getRequestAccounts();
    showMyDID();
  }, [])

  // const handleCraete = () => {
  //   const new_Account = createJWT();
  //   console.log(new_Account);
  // }

  const [account, setAccount] = useState(null)
  const getRequestAccounts = async () => {
    try {
      const [account] = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      setAccount(account);
      console.log(account);
    } catch (error) {
      return;
    }
    return account;
  }

  const [email,] = useState("3qufqks@gmail.com");
  const [name,] = useState("head");
  const [position,] = useState("alex");
  // 인증된 이메일 정보 그대로 넘기기

  const [response, setResponse] = useState([]);
  const sendRequest = async () => {
    const res = await fetch(`${URL}/didrequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        position: position,
        name: name,
        account: account,
        email: email
      })
    })
    if (res.ok) {
      const data = await res.json();
      console.log(res);
      //didToString(data);
    } else {
      console.log("rejected")
    }
  }
  const getRequestList = async () => {
    const res = await fetch(`${URL}/requestList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account: account
      })
    })
    if (res.ok) {
      const data = await res.json();
      if (data.msg) {
        alert(data.msg);
        return;
      }
      console.log(res);
      //didToString(data);
      setResponse(data);
    } else {
      console.log("rejected")
    }
  }

  // const didToString = (data) => {
  //   const trim = data.join('.');
  //   setDID(trim);
  //   console.log(trim);
  // }

  async function confirmDID(account) {
    const res = await fetch(`${URL}/approveRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account: account,
      })
    })
    if (res.ok) {
      console.log(res);
    } else {
      console.log("rejected")
    }
  }
  useEffect(() => {
    showMyDID();
  }, [])

  const [myDID, setMyDID] = useState([]);
  async function showMyDID() {
    const acc = await getRequestAccounts();
    const did = localStorage.getItem("planzDID");
    if (!did) {
      const res = await fetch(`${URL}/showMyDID`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          account: acc,
        })
      })
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setMyDID(data);
        if (data.length < 1 && !did) {
          alert("DID 생성해야함");
          return;
        }
        localStorage.setItem("planzDID", data[0].did)
      } else {
        console.log("rejected")
      }
    } else {
      console.log("did : " + did);
    }

  }

  const [recoverdDID, setRecoveredDID] = useState("")
  const ethrDid_2 = new EthrDID({ ...keypair_2 });
  const didRecover = async () => {
    const did = localStorage.getItem("planzDID");
    const res = await ethrDid_2.verifyJWT(did, resolver);
    console.log([res]);
    setRecoveredDID([res]);
  }

  // QR 코드를 인식했을 떄 string을 추출해냄
  // request account : "0x123....ab";
  const [checkSigner, setCheckSigner] = useState(false);
  const vendingMachineCheck = async () => {
    didRecover();
    const companyAccount = '0x9021361C5226099AA99370DfeD181c9E31469d3B'
    if (recoverdDID) {
      const signer = recoverdDID[0].signer.blockchainAccountId;
      const tokens = signer.split(':');
      // 배열의 마지막 요소를 추출합니다.
      const lastToken = tokens[tokens.length - 1];
      console.log(lastToken);
      if (companyAccount === lastToken) { 
        setCheckSigner(true); 
        console.log("make coffee !")
      }
      return;
    }
    return;
  }

  return (
    <div className="App" style={{ margin: "50px 50px", fontSize: "20px" }}>
      <div>
        <h3>이메일 인증 다음 DID 발급창입니다 (유저)</h3>
        <p>예시 계정 : {account}</p>
        <p>예시 이메일 : "{email}"</p>
        <p>예시 직책 : "{position}"</p>
        <p>예시 이름 : "{name}"</p>
        <button onClick={sendRequest}>send</button>
      </div>
      <h3>요청 목록 (회사) </h3>
      <button onClick={getRequestList} style={{ marginTop: "30px" }}>Show List</button>
      <ul>
        {response.map((data, idx) => (
          (<li key={idx}>{data.account} <button onClick={() => { confirmDID(data.account) }}>confirm</button></li>))
        )}{
          response.length == 0 && <p> * 현재 발급 요청목록이 없습니다</p>
        }
      </ul>
      <h3>생성됐는지 확인 (유저) 개인정보 보호를 위해 아래 정보를 안전한 곳에 보관하세요</h3>
      {myDID.length == 1 ? <>{myDID[0].did}</> : <></>}

      <h3>DID 정보 풀어서 체크 (커피머신)</h3>
      <button onClick={vendingMachineCheck} style={{ marginTop: "30px" }}>verify</button>
      {recoverdDID.length ?
        <div>
          <p>요청자 : {recoverdDID[0].payload.claims.account}</p>
          <p>서명자 : {recoverdDID[0].signer.blockchainAccountId}</p>
        </div> : <></>
      }{checkSigner ? <p>유효한 서명값입니다. 커피 제조 시작! </p> : <></>}
      <p></p>
    </div>
  );
}

export default App;

