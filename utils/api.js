import axios from 'axios';
export async function getApi(url, data) {
    let newUrl = process.env.CORE_API_URL + url;
    // let newUrl = 'http://localhost:3000/api/v1/' + url;
    // let newUrl = 'https://29trx-online.vercel.app/api/v1/' + url;
    let res = await axios.post(
        // process.env.CORE_API_URL + 'auth/login',
        // 'http://localhost:3000/api/hello',
        // 'http://localhost:3000/api/v1/auth/login',
        // 'http://localhost:3001/api/v1/',
        newUrl,
        data,
        {
            headers: {
                'Content-Type': 'application/json',
                'rm-api-key': process.env.API_KEY
            }
        }
    )
    if (res.data) {
        return res.data;
    } else {
        return res;
    }
    // 'rm-api-key': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWV0cm9uLm1sIiwiaWF0IjoxNjUyNTUyNTk1LCJleHAiOjE2NjU3NzE3OTV9.G1zp--3ecthwUiMUeJH4i2Vj10Gr3-RsSSSBd0GAucw'
}
export async function getHomeDatas() {
    return {
        total_ballance: "2000"
    }
} 