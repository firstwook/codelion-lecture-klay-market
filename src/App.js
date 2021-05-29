import logo from './logo.svg';
import Caver from 'caver-js';
import './App.css';

const COUNT_CONTRACT_ADDRESS = '0x0619762041428d3deb052cd5c5Ab7Bc3A5e85A9F';
const ACCESS_KEY_ID = 'KASKYM1GOE9D577Q78HLFBZB';
const SECRET_ACCESS_KEY = 'YV6RGbkLfxHmo8nP2Klke/BC4DP9YNpBMR/3OO0w';
const CHAIN_ID = '1001'; //  MAINNET 8217 TESTNET 1001 
const COUNT_ABI = '[ { "constant": false, "inputs": [ { "name": "_count", "type": "uint256" } ], "name": "setCount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "count", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getBlockNumber", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]'

const option = {
  headers: [{
    name: "Authorization",
    value: "Basic " + Buffer.from(ACCESS_KEY_ID + ":" + SECRET_ACCESS_KEY).toString("base64")
  },
  { name: "x-chain-id", value: CHAIN_ID }
  ]

}

const caver = new Caver(new Caver.providers.HttpProvider("https://node-api.klaytnapi.com/v1/klaytn", option))
const CountContract = new caver.contract(JSON.parse(COUNT_ABI), COUNT_CONTRACT_ADDRESS);
const readCount = async () => {
  const _count = await CountContract.methods.count().call();
  console.log(_count);
}

const getBalance = (address) => {
  return caver.rpc.klay.getBalance(address).then((res) => {
    const balance = caver.utils.convertFromPeb(caver.utils.hexToNumberString(res));
    console.log(`BALANCE : ${balance}`);
  })
}

const setCount = async (newCount) => {

  // 사용할 account 설정

  try {

    const privateKey = '0x01165f24c650421e8e4c650f2461686a3e9e4ac9f589438bcc26e323079a1f36';
    const deployer = caver.wallet.keyring.createFromPrivateKey(privateKey);
    caver.wallet.add(deployer);

    // 스마트 컹트랙트 실행 트랜잭션 날리기
    // 결과 확인

    const receipt = await CountContract.methods.setCount(newCount).send({
      from: deployer.address,
      gas: "0x4bfd200"
    });
    console.log(receipt);

  } catch (e) {
    console.error('[ERROR_SET_COUNT] : ', e);
  }

}

// 1. SmartContract 배포 주소 파악(가져오기)
// 2. caver.js 이용해서 스마트 컨트랙트 연동하기
// 3. 가져온 스마트 컨트랙트 실행 결과(데이터) 웹에 표현하기

function App() {
  readCount();
  getBalance('0x3f8eaca50cfeb57838a04199c89f32f5509c6fe5');
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button title={'카운트변경'} onClick={()=>{setCount(100)}}></button>
        <p>
          GOOD <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
