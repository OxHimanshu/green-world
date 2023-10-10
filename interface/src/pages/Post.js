import axios from 'axios';
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react';
import { Web3Storage } from 'web3.storage'
import { useAlert, positions } from 'react-alert';
import Loading from '../components/Loading';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function getAccessToken () {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDIxQzc5Qjk4ZTE1ODIwNWEwNzMzMzM1NzEyZWIwMDRiRjhhN0Q0QzciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE2MzE4MDAxOTgsIm5hbWUiOiJTY2F0dGVyIn0.H0D97M3xr4g3eP7tn_8URf31vQYz5KrBT2NjB8gZB24";
}

function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
}

async function storeFiles(files) {
    const client = makeStorageClient()
    const cid = await client.put(files)
    console.log(cid)
    return cid
}

function Post() {
    const { address, isConnected } = useAccount()
    const [isLoading, setIsLoading] = useState(true)
    const [loggedIn, setloggedIn] = useState(false)
    const [videoData, setVideoData] = useState(null)
    const [fileType, setFileType] = useState(null)
    const [objectUrl, setObjectUrl] = useState(null)
    const [gated, setGated] = useState(false)
    const [data, setData] = useState(null)

    const alert = useAlert()

    useEffect(() => {
        if(isConnected) {
            try {
                (async () => {
                    const data = await (await fetch(`https://huddlegram-backend.onrender.com/api/profiles/${address}`,)).json();
                    if(data['data'] != null) {
                        setData(data['data'])
                        setloggedIn(true)
                    }
                    setIsLoading(false)
                })();
                setIsLoading(true)
            } finally {
                
            }
        } else {
            setIsLoading(false)
            setloggedIn(false)
        }
    },[isConnected])

    const uploadFiles = async () => {
        if(videoData) {
            console.log(videoData)
            let files = [];
            files.push(videoData);
            alert.info(<div>uploading...</div>, {
                timeout: 40000,
                position: positions.BOTTOM_RIGHT
            });
            console.log("Uploading Start")
            let ipfsLink = await storeFiles(files);
            console.log("Uploaded")
            alert.success(<div>file uploaded</div>, {
                timeout: 4000,
                position: positions.BOTTOM_RIGHT
            });
            const url = "https://" + ipfsLink + ".ipfs.w3s.link/" + videoData.name
            console.log("Url: ", url);
            try{
                const response = await axios.post(
                    'https://huddlegram-backend.onrender.com/api/posts',
                    {
                        id: address,
                        gated: gated,
                        url: url,
                        nftContract: data['nftContract'],
                        fileType: fileType
                    },
                    {
                      headers: {
                        'Content-Type': 'application/json',
                      }
                    }
                );
                alert.success(<div>data saved</div>, {
                    timeout: 4000,
                    position: positions.BOTTOM_RIGHT
                });
                console.log(response)
            } catch(error) {

            }
        }
    }

    const loadData = (e) => {
        const fileString = e.target.files[0].name.split(".");
        const fileName = fileString[fileString.length - 1].toUpperCase(); 
        if(['JPG','JPEG','PNG','IMG','HEIC'].includes(fileName)) {
            setFileType("image")
            setVideoData(e.target.files[0]); 
            setObjectUrl(URL.createObjectURL(e.target.files[0]))
        } 
        else if(["MKV","MP4"].includes(fileName)) {
            setFileType("video")
            setVideoData(e.target.files[0]); 
            setObjectUrl(URL.createObjectURL(e.target.files[0]))
        }

    }

    if(isLoading) return (
        <div className='text-white h-5/6 w-100 flex items-center justify-center'>
            <Loading/>
        </div>
    )

    if(!loggedIn) return (
        <div className='text-white h-5/6 w-100 flex items-center justify-center'>
            <ConnectButton chainStatus="icon" showBalance={false}/>
        </div>
    )

    return (
        <div className="flex flex-col items-center justify-center w-full h-5/6 space-y-4">
            {videoData ? fileType === 'video' ? <video src={objectUrl} width="750" height="500" controls>
            </video> : fileType === 'image' ? <div className='overflow-scroll w-[750px] h-[500px]'><img src={objectUrl} width="750" height="500" /></div> : "" : ""}
            <div className='flex flex-row space-x-2'>
                <label className="block">
                    <span className="sr-only">Choose media</span>
                    <input accept='image/png,image/jpg,image/jpeg,.mkv,.mp4' onChange={(e) => {loadData(e)}} type="file" className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100
                    "/>
                </label>
            </div>
            {videoData ? 
                <div className='flex flex-col space-y-4'>
                    <div className='flex flex-row space-x-2'> 
                        <input onChange={(e) => {setGated(e.target.checked)}} type="checkbox" class="default:ring-2 ..." /> 
                        <div>Premium</div>
                    </div>
                    <button className='rounded-md px-4 py-2 text-white bg-green-600 hover:bg-green-700' onClick={() => uploadFiles()}>Upload</button>
                </div> 
            : ""}
        </div>
    )
}
export default Post;
