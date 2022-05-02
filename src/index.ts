import { ethers } from 'ethers'
import Counter from '../artifacts/contracts/Counter.sol/Counter.json'
const { abi } = Counter

function getEth() {
  // @ts-ignore
  const eth = window.ethereum
  if (!eth) throw new Error('what no eth found!?')
  return eth
}

async function hasSigners() {
  const eth = getEth()
  const accounts = await eth.request({ method: 'eth_accounts' })
  return accounts && accounts.length
}
async function requestAccounts() {
  const eth = getEth()
  const accounts = await eth.request({ method: 'eth_requestAccounts' })
  return accounts && accounts.length
}

async function run() {
  if (!(await hasSigners()) && !(await requestAccounts())) {
    throw new Error('metamask is busy')
  }

  const counter = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    abi,
    new ethers.providers.Web3Provider(getEth()).getSigner(),
  )
  const el = document.createElement('div')
  const button = document.createElement('button')

  async function setCounter(count?) {
    el.innerHTML = count || (await counter.getCounter())
  }

  button.onclick = async function () {
    await counter.count()
  }

  button.innerText = 'Increment'

  counter.on(counter.filters.CounterInc(), function (count) {
    setCounter(count)
  })

  document.body.appendChild(el)
  document.body.appendChild(button)

  setCounter()
}

run()
