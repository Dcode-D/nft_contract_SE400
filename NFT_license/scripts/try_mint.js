require("dotenv").config({path: "../.env"})
const API_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/License_Contract.sol/License_Contract.json")
const contractAddress = "0x08d18b03E62C288D227a14c061c15939dab9a589"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)
// nftContract.methods.getNextId().call().then(value => {console.log(value)})
async function mintNFT() {
    const nonce = await web3.eth.getTransactionCount("0x93a39FaD32632C4Ca68F901bDb55f6c52fDc4E28", "latest") //get latest nonce

    //the transaction
    const tx = {
        from: "0x93a39FaD32632C4Ca68F901bDb55f6c52fDc4E28",
        to: contractAddress,
        nonce: nonce,
        gas: 5000000,
        data: nftContract.methods.merge([3,4,5,6,7,8,9,10,11]).encodeABI(),
    }

    const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    signPromise
        .then((signedTx) => {
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
        })
        .catch((err) => {
            console.log(" Promise failed:", err)
        })
}
mintNFT()
