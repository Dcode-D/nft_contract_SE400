const path = require('path')
require('dotenv').config({path: path.join(__dirname,'../.env')});
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const {PINATA_JWT} = process.env;
const JWT = `Bearer ${PINATA_JWT}`

const pinFileToIPFS = async (...srclist) => {
    const formData = new FormData();
    srclist.map((src,index)=>{
        const file = fs.createReadStream(src)
        formData.append('file'+index.toString(),file);
    })

    const options = JSON.stringify({
        cidVersion: 0,
    })
    formData.append('pinataOptions', options);

    try{
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: "Infinity",
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                Authorization: JWT
            }
        });
        console.log(res.data);
    } catch (error) {
        console.log(error);
    }
}
export default pinFileToIPFS