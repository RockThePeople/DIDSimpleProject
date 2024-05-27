import { EthrDID } from 'ethr-did';
import { useEffect, useState } from 'react';
import { Resolver } from 'did-resolver';
import { getResolver } from 'ethr-did-resolver';
import { keypair_2, infuraKey, employee_test } from './account';
// import { createJWT } from 'did-jwt';

const URL = "https://didserver.run.goorm.io";
//const URL = "http://localhost:8080"

function App() {

  //const provider = new BrowserProvider(window.ethereum);
  const providerConfig = { name: 'mainnet', rpcUrl: `https://mainnet.infura.io/v3/${infuraKey}` };
  const ethrDidResolver = getResolver(providerConfig);
  const resolver = new Resolver(ethrDidResolver);

  useEffect(() => {
    getRequestAccounts();
  }, [])

  //암호화 JWE, JWS 방식 사용

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
      console.log(res);
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

  const [myDID, setMyDID] = useState([]);
  async function showMyDID() {
    const acc = await getRequestAccounts();
    const did = localStorage.getItem("planzDID");
    setMyDID([did]);
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
        if (data.length < 1) {
          alert("DID 생성이 수락되지 않음");
        } else {
          localStorage.setItem("planzDID", data[0].did)
        }
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
      const lastToken = tokens[tokens.length - 1];
      console.log("signer: " + lastToken);
      if (companyAccount === lastToken) {
        setCheckSigner(true);
        alert("유효한 서명 값, 커피 제조가 시작됩니다 !")
      }
      return;
    }
    return;
  }

  const deleteDIDonDB = async () => {
    const res = await fetch(`${URL}/deleteDIDonDB`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account: account
      })
    })
    if (res.ok) {
      const data = await res.json()
      window.confirm("임시저장소의 데이터가 모두 사라집니다.");
      //실제 사용 시 아래 줄 enable
      //localStorage.removeItem("planzDID");
      if (data.msg) { alert(data.msg); }
    } else {
      alert("재시도 바랍니다.")
    }
  }

  return (
    <div className="App" style={{ margin: "50px 50px", fontSize: "20px" }}>
      <div>
        <h3>이메일 인증 다음 DID 발급창입니다 (유저)
          <button onClick={sendRequest}>send</button></h3>
        <p>예시 계정 : {account}</p>
        <p>예시 이메일 : "{email}"</p>
        <p>예시 직책 : "{position}"</p>
        <p>예시 이름 : "{name}"</p>
      </div>
      <h3>요청 목록 (회사)  <button onClick={getRequestList} style={{ marginTop: "30px" }}>Show List</button></h3>

      <ul>
        {response.map((data, idx) => (
          (<li key={idx}>{data.account} <button onClick={() => { confirmDID(data.account) }}>confirm</button></li>))
        )}{
          response.length == 0 && <p> * 현재 발급 요청목록이 없습니다</p>
        }
      </ul>
      <h3>생성됐는지 확인 (유저) 개인정보 보호를 위해 아래 정보를 안전한 곳에 보관하세요<button onClick={showMyDID} style={{ marginTop: "30px" }}>My did</button></h3>
      {myDID.length > 0 ? <>{myDID}</> : <></>}
      <h3>DID를 안전한 곳에 복사/보관했다면 "Check" 버튼을 눌러 임시저장소로부터 DID를 삭제하세요 <button onClick={deleteDIDonDB} style={{ marginTop: "30px" }}>Check</button></h3>
      <h3>DID 정보 풀어서 체크 (커피머신) <button onClick={vendingMachineCheck} style={{ marginTop: "30px" }}>verify</button></h3>
      {recoverdDID.length ?
        <div>
          <p>요청자 : {recoverdDID[0].payload.claims.account}</p>
          <p>서명자 : {recoverdDID[0].signer.blockchainAccountId}</p>
        </div> : <></>
      }
      {checkSigner ? <p>유효한 서명값입니다. 커피 제조 시작! </p> : <></>}
      <p></p>
    </div>
  );
}

export default App;

