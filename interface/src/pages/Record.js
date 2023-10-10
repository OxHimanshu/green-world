import axios from 'axios';
import { useAccount, useSignMessage } from 'wagmi'
import { useEffect, useState, useEventListner } from 'react';
import Loading from '../components/Loading';
import { HuddleIframe, iframeApi } from "@huddle01/iframe";
import {
    getAccessToken,
    getMessage,
  } from '@huddle01/auth';

function Record() {
    const { address, isConnected } = useAccount()
    const [isLoading, setIsLoading] = useState(true)
    const [loggedIn, setLoggedIn] = useState(false)
    const [roomUrl, setRoomUrl] = useState()  
    const [accessToken, setAccessToken] = useState("");
    const { signature, signMessage } = useSignMessage({
        onSuccess: async (data) => {
            const token = await getAccessToken(data, address);
            setAccessToken(token.accessToken);
        },
    });

    useEffect(() => {
        if(accessToken) {
            // iframeApi.connectWallet(accessToken)
            // iframeApi.initialize({
            //     background: "",
            //     wallets: ["metamask"]
            // });
            // setIsLoading(false)
        }
        console.log(accessToken)
    },[accessToken])

    useEffect(() => {
        console.log("Room id: ", roomUrl)
        if(roomUrl !== undefined && roomUrl.length > 0) {
            (async () => {
                // const message = await getMessage(address);
                // signMessage(message)
                iframeApi.initialize({
                    background: "",
                    wallets: ["metamask"]
                });
                setIsLoading(false)
            })();
        }
    },[roomUrl])

    useEffect(() => {
        if(isConnected) {
            try {
                (async () => {
                    const data = await (await fetch(`https://huddlegram-backend.onrender.com/api/profiles/${address}`,)).json();
                    if(data['data'] != null) {
                        try{
                            const response = await axios.post(
                                'https://iriko.testing.huddle01.com/api/v1/create-iframe-room',
                                {
                                  roomLocked: false,
                                  title: 'Greenverse',
                                  hostWallets: [address],
                                  muteOnEntry: true,
                                  videoOnEntry: true
                                },
                                {
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'x-api-key': "VwTZ4AGTxme9snANex9tep3NwvVMGfYd",
                                  }
                                }
                            );

                            const roomResponse = await axios.post(
                                'https://iriko.testing.huddle01.com/api/v1/join-room-token',
                                {
                                    roomId: response.data['data']['roomId'],
                                    userType: "host"
                                },
                                {
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'x-api-key': "VwTZ4AGTxme9snANex9tep3NwvVMGfYd",
                                  },
                                }
                              );
                            setRoomUrl(roomResponse.data['redirectUrl'])
                            setLoggedIn(true)
                        } catch (error) {

                        }
                    }
                })();
            } finally {
                
            }
        } else {
            setIsLoading(true)
            setLoggedIn(false)
        }
    },[isConnected])

    if(isLoading) return (
        <div className='text-white h-5/6 w-100 flex items-center justify-center'>
            <Loading/>
        </div>
    )
    
    if(!loggedIn) return (
        <div>
            Not loggedIn
        </div>
    )

    return (
        <div className='text-white'>
            <div className='w-full h-[600px] flex justify-center mt-3'>
                <HuddleIframe roomUrl={roomUrl} className="w-11/12 h-full"/>
            </div>
            <div className='w-full flex flex-row justify-center space-x-24 mt-8'>
                <button className='rounded-lg px-4 py-4 bg-blue-500 hover:bg-blue-600 text-white'  onClick={() => iframeApi.startRecording({uploadToIpfs: true})}>Start Recording</button>
           </div>
        </div>
    )
}
export default Record;
