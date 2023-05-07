import TronWeb from "tronweb";

// const FULLHOST = "https://api.shasta.trongrid.io";
const FULLHOST = process.env.TRON_NETWORK;
const sideGatewayAddress = "TYv69UkpPFoL8UFkcGLoGZJB3D2LueKy2u";
const sideChainId = "41FBB3EC4B5A47AB538DE831F73B18D9E4373510D7";
const privateKey = "B5CBB20E936FF53946DCB4F6C4764FA155D43386ED87697296B0C237F49D4C09";
const tronApi = new TronWeb({
  fullHost: FULLHOST,
  privateKey: privateKey,
});
export function getTrx(amount, status = true) {
  if (status) {
    return Number(tronApi.toSun(amount))  // 10 -> 10000000
  } else {
    return Number(tronApi.fromSun(amount))  // 10000000 -> 10
  }
}
export async function getBalance(address) {
  try {
    const query = await tronApi.trx.getBalance(address);
    const data = {
      ballance: query,
      convert: tronApi.fromSun(query),
      unit: "trx",
    };
    return data;
  } catch (e) {
    return e;
  }
}
export async function getBalanceUsdt(address) {
  try {
    const CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
    const { abi } = await tronApi.trx.getContract(CONTRACT);
    const contract = tronApi.contract(abi.entrys, CONTRACT);
    const query = await contract.methods.balanceOf(address).call();
    const data = {
      ballance: Number(query.toString()),
      convert: Number(tronApi.fromSun(query.toString())),
      unit: "usdt",
    };
    return data;
  } catch (e) {
    return e;
  }

}

export async function addressCreate() {
  try {
    const query = await TronWeb.createAccount();
    const result = {
      data: {
        privateKey: query.privateKey,
        publicKey: query.publicKey,
        address: query.address.base58,
        addressHex: query.address.hex,
      }
    }
    return result;
  } catch (e) {
    return e;
  }
}
export async function testTron() {
  // return tronSend()
  const a = tronApi.trx.getTransaction("TVCdECPKJbEPRy53dR9sTWc8fKiqdK89ha", "all", 30, 0);
  return a
}
export async function getLevels(amount) {
  const amountConvert = tronApi.toSun(amount);
  return {
    amount,
    convert: amountConvert,
    levels: {
      1: {
        percent: 10,
        tron: amountConvert / 100 * 10,
        view: tronApi.fromSun(amountConvert / 100 * 10)
      },
      2: {
        percent: 5,
        tron: amountConvert / 100 * 5,
        vitronew: tronApi.fromSun(amountConvert / 100 * 5)
      },
      3: {
        percent: 2,
        tron: amountConvert / 100 * 2,
        view: tronApi.fromSun(amountConvert / 100 * 2)
      }
    }

  }
}
/*
 "userWallet": {
        "privateKey": "2B422EA087D3AA236C2C9574A087195BAE9C29BA43B9A1556F1E7035C2926605",
        "publicKey": "04B6359868931C3CDCE879A26024392B2709705D04013F8BD90D8A345FFC0864A75445D35BAAFB6BF51D80FDE5C473C859721E897C1A58C8D876FC912B76168D67",
        "address": "TVCdECPKJbEPRy53dR9sTWc8fKiqdK89ha",
        "addressHex": "41D2F4054AF0354DD3D60A7B32246F9A0F79217384"
    },
    "domainWallet": {
        "privateKey": "EEC14EC02C8CA6C08839AF8B8FA7AE94AEFC7609A1E483FAD0DED115D9208742",
        "publicKey": "0491CC6A2EECA146B400A3E9E7C89B63B3BF9F0DDAA6BC0A57412FF0452FA74D725847C4DECD4DAC1E8AE59CCE5FB64CFE410E78E62AAF2F1172E95A07B975441B",
        "address": "TCW9U5rdcfi9xPYPYaCoKtTxxvonjHYA4u",
        "addressHex": "411BCA324190688A448ACBA5485DB23F6CAD40C810"
    }
    */
export async function tronSend() {
  const wallet = {
    user: {
      privateKey: "2B422EA087D3AA236C2C9574A087195BAE9C29BA43B9A1556F1E7035C2926605",
      publicKey: "04B6359868931C3CDCE879A26024392B2709705D04013F8BD90D8A345FFC0864A75445D35BAAFB6BF51D80FDE5C473C859721E897C1A58C8D876FC912B76168D67",
      address: "TVCdECPKJbEPRy53dR9sTWc8fKiqdK89ha",
      addressHex: "41D2F4054AF0354DD3D60A7B32246F9A0F79217384"
    },
    domain: {
      privateKey: "EEC14EC02C8CA6C08839AF8B8FA7AE94AEFC7609A1E483FAD0DED115D9208742",
      publicKey: "0491CC6A2EECA146B400A3E9E7C89B63B3BF9F0DDAA6BC0A57412FF0452FA74D725847C4DECD4DAC1E8AE59CCE5FB64CFE410E78E62AAF2F1172E95A07B975441B",
      address: "TCW9U5rdcfi9xPYPYaCoKtTxxvonjHYA4u",
      addressHex: "411BCA324190688A448ACBA5485DB23F6CAD40C810"
    }
  }
  const amount = TronWeb.toSun(0.050)
  const tradeobj = await tronApi.transactionBuilder.sendTrx(wallet.domain.address, amount, wallet.user.address, new Date().getTime());
  const signedtxn = await tronApi.trx.sign(tradeobj, wallet.user.privateKey);
  const receipt = await tronApi.trx.sendRawTransaction(signedtxn);
  return receipt;
  // return tronWeb.trx.sendTransaction("TVDGpn4hCSzJ5nkHPLetk8KQBtwaTppnkr", 1000,’from_address_private’);
}

export async function trxSendTill(userAddress, userAddressSecret, siteAddress, amount = null) {
  if (amount == null) {
    amount = TronWeb.toSun(10)
  }
  try {
    const tapi = new TronWeb({
      fullHost: FULLHOST,
      privateKey: userAddressSecret,
    });
    const tradeobj = await tapi.transactionBuilder.sendTrx(siteAddress, amount, userAddress, new Date().getTime());
    const signedtxn = await tapi.trx.sign(tradeobj, userAddressSecret);
    const receipt = await tapi.trx.sendRawTransaction(signedtxn);
    return receipt;
  } catch (error) {
    return {
      error: error + ' CODE:5005'
    }
  }
}

export async function trxSendUser(userAddress, userAddressSecret, siteAddress, amount = null) {
  if (amount == null) {
    amount = TronWeb.toSun(10)
  } else {
    amount = TronWeb.toSun(amount)
  }
  try {
    const tapi = new TronWeb({
      fullHost: FULLHOST,
      privateKey: userAddressSecret,
    });
    const tradeobj = await tapi.transactionBuilder.sendTrx(siteAddress, amount, userAddress, new Date().getTime());
    const signedtxn = await tapi.trx.sign(tradeobj, userAddressSecret);
    const receipt = await tapi.trx.sendRawTransaction(signedtxn);
    return receipt;
  } catch (error) {
    return {
      error: error + ' CODE:5005'
    }
  }
}

export async function isAddress(address) {
  return await TronWeb.isAddress(address);
}
// export async function logList(address) {
//   return await TronWeb.trx.listNodes().then(result => { console.log(result) });
// }
// export async function getTransfer(address) {
//   return await TronWeb.trx.getTransactionaddress(address)
// }
// export async function getTransferInfo(address) {
//   return await TronWeb.trx.getTransactionInfo(address)
// }

export async function isConnected() {
  return await TronWeb.isConnected();
}


export async function tester() {
  const tapi = new TronWeb({
    fullHost: FULLHOST,
    privateKey: "2B422EA087D3AA236C2C9574A087195BAE9C29BA43B9A1556F1E7035C2926605",
  });
  const parameter = []
  const options = {
    feeLimit: 100000000,
    callValue: 0
  }
  const transaction = await tapi.transactionBuilder.triggerConfirmedConstantContract(
    "419e62be7f4f103c36507cb2a753418791b1cdc182",
    "name()",
    options,
    parameter,
    "41D2F4054AF0354DD3D60A7B32246F9A0F79217384"
  );
  return transaction
}