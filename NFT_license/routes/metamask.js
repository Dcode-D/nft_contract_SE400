var express = require('express');
var router = express.Router();
const path = require('path');
// async function getmetamask() {
//     console.log("function executed")
//     const {ethers} = require('ethers');
//     const deploy = require('../scripts/deploy_license');
//     if(window.ethereum) {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         await deploy(signer);
//     }
// }

router.get('/',function timeLog(req, res) {
  return res.sendFile(path.join(__dirname, '../views/metamask.html'));
});
module.exports = router;