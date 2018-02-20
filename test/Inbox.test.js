const assert = require('assert');
const ganache = require('ganache-cli');
// web3 constructor
const Web3 =  require('web3');
// now create instance of web3, connect to ganache local test network
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require('../compile');

// Testing necessary:
// deploy new contract - beforeEach
// manipulate contract - it
// make assertion about contract - it

let accounts;
let inbox;

beforeEach(async () => {
  // Get list of all accounts
  // Use ES6 features to avoid .then promise
  accounts = await web3.eth.getAccounts()
  // Use an account to deploy contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there'] })
    .send({ from: accounts[0], gas: '1000000' })

  inbox.setProvider(provider);
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    assert.ok(inbox.options.address);
  });
  it('has a default message', async () => {
    const message  = await inbox.methods.message().call();
    assert.equal(message,'Hi there');
  });
  it('can change the message', async () => {
    await inbox.methods.setMessage('bye').send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, 'bye');
  });
});
