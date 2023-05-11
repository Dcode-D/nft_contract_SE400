require('dotenv').config();
const axios = require('axios');
const {PINATA_JWT} = process.env;
const JWT = `Bearer ${PINATA_JWT}`
const uploadJson = async (objectData)=> {
    const data = JSON.stringify(objectData);

    const config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': JWT
        },
        data: data
    };

    const res = await axios(config);

    console.log(res.data);
}

export default uploadJson