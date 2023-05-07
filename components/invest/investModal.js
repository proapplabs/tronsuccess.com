import useSWR from 'swr'
import React, { useState, useEffect } from 'react';
import { swrOptions } from '@utils/func'
export default function InvestModal() {
    const fetcher = (...args) => fetch(...args).then((res) => res.json())
    const { data, error } = useSWR('/api/datas', fetcher, swrOptions('datas'))
    if (error) return <div className="shareCard"><p>Failed to load</p></div>
    if (!data) return <div className="shareCard"><p>Loading...</p></div>
    return Result(data)
    function Result(data = null) {
        return (
            <>
                <section class="QR BasicAccount">
                    <div class="body">
                        <div class="address">
                            <img src="http://chart.googleapis.com/chart?chs=500x500&cht=qr&chl=address&choe=UTF-8" />
                            <div class="text">
                                <p>TRX Address</p>
                                <h4>address</h4>
                                <span data-address="address" class="copyAddress">Copy Address</span>
                                <div class="copied"><small>The address has been copied.</small> </div>
                            </div>
                        </div>
                        <div class="text">
                            <h1>Transfer To Basic Account</h1>
                            <p>
                                Please don’t recharge other non TRX assets. It will be recorded about 5~10 minutes after charging.
                            </p>
                            <p>
                                <b>If it hasn't arrived for a long time, please refresh this page. Minimum 5TRX investment.</b>
                            </p>
                        </div>
                    </div>
                </section>

                <style jsx>{`
.QR{display: none;}
.qrAccountModal{}
.qrAccountModal h1{font-size:30px;color:var(--text-white);}
.qrAccountModal .address{box-shadow: 0 3px 42px rgb(0 0 0 / 20%);background-color: white;border-radius: var(--radius);padding: 15px ;width: 80%;margin: -200px auto auto auto;display: flex;align-items:center;}
.qrAccountModal .address>*{width: 50%;}
.qrAccountModal .address img{display: block;margin: auto;}
.qrAccountModal .address .text{text-align: left;}
.qrAccountModal .address .text *{margin: 0;}
.qrAccountModal .address .text p{margin-bottom: 10px;font-size: 12px;}
.qrAccountModal .address .text span{cursor: pointer;display: inline-block;padding: 10px 20px;margin-top:15px;border-radius: var(--radius);background-color: /*#00bcd4*/ #444;color:White;}
.qrAccountModal .address .text span:hover{ background-color: #00bcd4;}
.qrAccountModal .address .text .copied{display: block;}
.qrAccountModal .address .text .copied small{color:#8bc34a;display: none;}
.qrAccountModal .swal2-html-container{overflow: inherit; }
.qrAccountModal .swal2-title{display: none !important;}
.qrAccountModal .btn-success{background-color: #8bc34a;padding: 20px 30px;border-radius: 100px;}
.qrAccountModal .swal2-modal{padding-bottom: 30px;
  background-image: url(https://trxtron.bet/static/images/img_dipan@2x.png);
  background-position: bottom center;
  background-size: auto 50%;
  background-repeat: no-repeat; ;
}
@media (max-width:960px) {
  .qrAccountModal .address{margin: -100px 0 0 0;width: 100%;display: block;}
  .qrAccountModal .address>*{width: 100%;}
  .qrAccountModal .address *{text-align: center;}
  .qrAccountModal .address img{width: 60%;}
  .qrAccountModal .address .text{text-align: center;}
  .qrAccountModal .address .text h4{font-size: 10px;}
  .qrAccountModal .address .text span{font-size: 14px;padding: 10px;}
  .qrAccountModal h1{font-size: 18px;}
  .qrAccountModal p{font-size: 14px;}
  .qrAccountModal .btn-success{padding: 15px;font-size: 14px;}
  .qrAccountModal .swal2-actions{margin: 0;}
  .qrAccountModal .swal2-modal{padding: 0 0 15px 0;}
  .qrAccountModal .swal2-close{position: absolute;right: 35px;top:-72px;}
}
    `}</style>

            </>
        )

    }
} 