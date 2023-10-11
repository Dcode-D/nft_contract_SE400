require("dotenv").config({path: "../.env"})
const API_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const OTHER_PRIVATE_KEY = "7246e6968a6866ee03edf5588ebff9526ad73fa0bd1f45bdd554469e12139127"
const OTHER_ADDRESS = "0x7f2308223053c61cccc5461f3cf05780ee78a2a5"

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

//contract abi to interface with your contract
const contract = require("../artifacts/contracts/ERC721_Example.sol/ERC721_Example")
//deployed contract address here
const contractAddress = "0x9Ad5619C598581FA148D326E6F6355362F94a966"
//contract instance
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

async function mintNFT() {
    const nonce = await web3.eth.getTransactionCount(OTHER_ADDRESS, "latest") //get latest nonce
    const tx = {
        from: OTHER_ADDRESS,
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: nftContract.methods.mint(OTHER_ADDRESS, "https://www.mytokenlocation.com").encodeABI(),
        value: web3.utils.toWei("0.15", "ether"),
    }
    const signPromise = web3.eth.accounts.signTransaction(tx, OTHER_PRIVATE_KEY)
    signPromise
        .then(
            (signedTx) => {
                web3.eth.sendSignedTransaction(
                    signedTx.rawTransaction,
                    function (err, hash) {
                        if (!err) {
                            console.log(
                                "The hash of your transaction is: ",
                                hash,
                                "\nCheck Alchemy's Mempool to view the status of your transaction!"
                            )
                        } else {
                            console.log(
                                "Something went wrong when submitting your transaction:",
                                err
                            )
                        }
                    }
                )
            }
        )
        .catch((err) => {
            console.log("Promise failed:", err)
        })
}

mintNFT()