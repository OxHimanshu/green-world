import { useAccount } from 'wagmi'
import ClickAwayListener from 'react-click-away-listener';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3Storage } from 'web3.storage';
import contractAbi from '../nftABI.json';
import { useSigner } from "wagmi";
import { useAlert, positions } from 'react-alert';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Loading from '../components/Loading';

function getAccessToken () {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDIxQzc5Qjk4ZTE1ODIwNWEwNzMzMzM1NzEyZWIwMDRiRjhhN0Q0QzciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjE2MzE4MDAxOTgsIm5hbWUiOiJTY2F0dGVyIn0.H0D97M3xr4g3eP7tn_8URf31vQYz5KrBT2NjB8gZB24";
}

function makeStorageClient () {
    return new Web3Storage({ token: getAccessToken() })
}

async function storeFiles(files) {
    const client = makeStorageClient()
    const cid = await client.put(files)
    return cid
}

function Profile() {
    const { data: signer, isError } = useSigner()
    const { address, isConnected } = useAccount()
    const [isLoading, setIsLoading] = useState(true)
    const [loggedIn, setloggedIn] = useState(false)
    const [showLoginPopup, setShowLoginPopup] = useState(false)
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("")
    const [pic, setPic] = useState(null)
    const [nft, setNft] = useState(null)
    const [data, setData] = useState({})
    const [showPosts, setShowPosts] = useState("public")
    const [contentCost, setContentCost] = useState(0)
    const [tokenName, setTokenName] = useState("")
    const [tokenSymbol, setTokenSymbol] = useState("")
    const [tokenSupply, setTokenSupply] = useState(0)
    const [publicPosts, setPublicPosts] = useState([])
    const [gatedPosts, setGatedPosts] = useState([])

    const alert = useAlert()

    useEffect(() => {
        if(isConnected) {
            try {
                (async () => {
                    const data = await (await fetch(`https://huddlegram-backend.onrender.com/api/profiles/${address}`,)).json();
                    if(data['data'] != null) {
                        // alert.info(<div>Login success</div>, {
                        //     timeout: 4000,
                        //     position: positions.BOTTOM_RIGHT
                        // });
                        console.log(data['data'])
                        setData(data['data'])
                        setloggedIn(true)

                        try{
                            const gatedData = await (await fetch(`https://huddlegram-backend.onrender.com/api/posts/gated/${data['data']['_id']}`,)).json();
                            console.log(gatedData)
                            setGatedPosts(gatedData['data'])
                        } catch(error) {
    
                        }
    
                        try{
                            const publicData = await (await fetch(`https://huddlegram-backend.onrender.com/api/posts/public/${data['data']['_id']}`,)).json();
                            console.log(publicData)
                            setPublicPosts(publicData['data'])
                        } catch(error) {
                            
                        }
                    } else {
                        // alert.info(<div>Please login</div>, {
                        //     timeout: 4000,
                        //     position: positions.BOTTOM_RIGHT
                        // });
                    }
                    setIsLoading(false)
                })();
            } finally {
                
            }
        } else {
            // alert.error(<div>Please login with wallet</div>, {
            //     timeout: 4000,
            //     position: positions.BOTTOM_RIGHT
            // });
            setIsLoading(true)
            setloggedIn(false)
        }
    },[isConnected])

    const Posts = ({postList}) => {
        if (postList.length === 0) {
            return (
                <div className='flex items-center justify-center h-full'>
                    No Posts Yet..
                </div>
            )
        }
        return (
            <div className='grid grid-cols-3 gap-1 h-full'>
                {postList.map(post => {
                    const source = post['url'];
                    return (
                        <div className='rounded-md w-76 h-72 border' key={post['_id']}>
                            {
                                post['filetype'] === 'video' ? 
                                    <video src={source} className="w-full h-full" type="video/mp4" controls></video>
                                :   <img src={source} className="w-full h-full" />
                            }
                        </div>
                    )
                })}
            </div>
        )
    } 

    const uploadToIPFS = async (file) => {
        if(file) {
            let files = [];
            files.push(file);
            let ipfsLink = await storeFiles(files);
            const url = "https://" + ipfsLink + ".ipfs.w3s.link/" + file.name
            return url

        } else {
            return ""
        }
    }

    const saveProfile = async () => {
        setShowLoginPopup(false)
        setIsLoading(true)

        console.log(name, desc, pic, nft)

        alert.info(<div>processing...</div>, {
            timeout: 6000,
            position: positions.BOTTOM_RIGHT
        });

        const picIpfs = await uploadToIPFS(pic)
        const nftIpfs = await uploadToIPFS(nft)

        alert.success(<div>uploaded to ipfs</div>, {
            timeout: 6000,
            position: positions.BOTTOM_RIGHT
        });

        console.log(picIpfs)
        console.log(nftIpfs)

        const factory = new ethers.ContractFactory(contractAbi.abi, contractAbi.bytecode, signer);
        const contract = await factory.deploy(tokenSupply, tokenName, tokenSymbol, ethers.utils.parseUnits(contentCost.toString(), "ether"), nftIpfs);
        alert.info(<div>contract getting deployed..</div>, {
            timeout: 0,
            position: positions.BOTTOM_RIGHT
        });
        await contract.deployed();
        console.log(contract.address)

        alert.success(
            <div>
                <div>contract deployed</div>
                <button className='text-xs' onClick={()=> window.open("https://hyperspace.filfox.info/en/address/" + contract.address, "_blank")}>View on explorer</button>
            </div>, {
            timeout: 0,
            position: positions.BOTTOM_RIGHT
        });

        try {
            (async () => {
                const requestOptions = {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin": "*",
                    },
                    body: JSON.stringify({
                        "_id": address,
                        "picture": picIpfs,
                        'description': desc,
                        'name': name,
                        'contentCost': contentCost,
                        'nftContract': contract.address,
                        'nftArtIpfs': nftIpfs,
                        'maxSupply': tokenSupply
                    })
                };
                const data = await (await fetch('https://huddlegram-backend.onrender.com/api/profiles/',requestOptions)).json();
                console.log(data['data'])
                if(data['data'] != null) {
                    setData(data['data'])
                    setloggedIn(true)
                    alert.success(<div>profile created</div>, {
                        timeout: 4000,
                        position: positions.BOTTOM_RIGHT
                    });
                }
            })();
        } catch (error) {
        } finally {
            setIsLoading(false)
        }
       
    }

    return (
        <div className="flex flex-1 justify-center h-[710px]">
            {
                !isConnected ? <div className='flex items-center'><ConnectButton chainStatus="icon" showBalance={false}/></div>  :
                isLoading ? <div className='flex items-center'><Loading/></div> :
                loggedIn ?
                <div className='flex w-full flex-col items-center space-y-4'>
                    <div className='flex flex-col h-72 justify-center'>
                        <div className='flex flex-rows space-x-20 my-10 items-center'>
                            <div className='rounded-full w-40 h-40 p-1'>
                                <img src={data["picture"]}  className='rounded-full w-full h-full'/>
                            </div>
                            <div className='space-y-2'>
                                <div className='flex flex-rows space-x-4'>
                                    {/* <div>Username: </div> */}
                                    <div className='font-normal text-2xl'>{data['name'] !==null ? data['name']: 'username not found'}</div>
                                    {/* <button className='rounded-lg border bg-blue-500 text-white px-2 py-2' onClick={() => setShowLoginPopup(true)}>Edit Profile</button> */}
                                </div>
                                <div className='flex flex-row space-x-2 font-medium text-md'>
                                    <div>{data['maxSupply']}</div><div className='font-light'>nfts</div>
                                    <div>{data['contentCost']}</div><div className='font-light'>tfil/nft</div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='text-sm font-semibold'>Description</div>
                                    <div className='text-xs font-light'>{data['description'] !==null ? data['description']: 'description not found'}</div>
                                </div>
                            </div>
                        </div>
                    </div> 
                    <div className='flex flex-rows w-8/12 border-t border-gray-600 justify-center space-x-28'>
                        <button className={`pt-4 h-10 w-24 font-semibold ${showPosts === 'public' ? 'border-t-2 border-white' : 'text-gray-500' } flex justify-center items-center`} onClick = {() => setShowPosts('public')}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28"><path fill="#FFFFFF" d="M200 936V271q0-24 18-42t42-18h440q24 0 42 18t18 42v665L480 816 200 936Zm60-91 220-93 220 93V271H260v574Zm0-574h440-440Z"/></svg>
                            <div className='text-sm ml-1'>Posts</div>
                        </button>
                        <button className={`pt-4 h-10 w-24 font-semibold ${showPosts === 'gated' ? 'border-t-2 border-white' : 'text-gray-400' } flex justify-center items-center`} onClick = {() => setShowPosts('gated')}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28"><path fill="#FFFFFF" d="m385 644 36-115-95-74h116l38-119 37 119h117l-95 74 35 115-94-71-95 71Zm-141 372V712q-45-47-64.5-103T160 496q0-136 92-228t228-92q136 0 228 92t92 228q0 57-19.5 113T716 712v304l-236-79-236 79Zm236-260q109 0 184.5-75.5T740 496q0-109-75.5-184.5T480 236q-109 0-184.5 75.5T220 496q0 109 75.5 184.5T480 756ZM304 932l176-55 176 55V761q-40 29-86 42t-90 13q-44 0-90-13t-86-42v171Zm176-86Z"/></svg>
                            <div className='text-sm ml-1'>Premium</div>
                        </button>
                    </div> 
                    <div className='w-full flex items-center justify-center overflow-y-scroll h-full'>
                        <div className='w-8/12 my-4 h-5/6'>
                            {
                            showPosts === 'public' ? 
                            <Posts postList={publicPosts}/>
                            :
                            <Posts postList={gatedPosts}/>
                            }
                        </div>
                    </div>
                </div>
                : <div className='flex items-center w-full justify-center'>
                        <button className='rounded-md px-6 py-4 hover:bg-green-600 bg-green-500 text-white font-semibold' onClick={() => setShowLoginPopup(true)}>Please login</button>
                        {
                            showLoginPopup && (
                                <ClickAwayListener onClickAway={() => setShowLoginPopup(false)}>
                                    <div className='drow-shadow-2xl border rounded-lg popup absolute p-4 text-xl space-y-4 bg-white pt-10'>
                                        <div className='flex flex-row space-x-10'>
                                            <div className='text-lg font-semibold w-44 text-end'>Profile Picture</div>
                                            <label className="block">
                                                <span className="sr-only">Choose profile photo</span>
                                                <input onChange={(e) => {setPic(e.target.files[0])}} type="file" accept="image/png, image/jpeg" className="block w-full text-sm text-slate-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100
                                                "/>
                                            </label>
                                        </div>
                                        <div className='flex flex-row space-x-10'>
                                            <div className='text-lg font-semibold w-44 text-end'>Username</div>
                                            <input onChange={(e) => {setName(e.target.value)}} type="text" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                                        </div>
                                        <div className='flex flex-row space-x-10'>
                                            <div className='text-lg font-semibold  w-44 text-end'>Description</div>
                                            <input onChange={(e) => {setDesc(e.target.value)}} type="text" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                                        </div>
                                        <div className='flex flex-row space-x-10'>
                                            <div className='text-lg font-semibold  w-44 text-end'>NFT Art</div>
                                            <label className="block">
                                                <span className="sr-only">Choose profile photo</span>
                                                <input onChange={(e) => {setNft(e.target.files[0])}} type="file" accept="image/png, image/jpeg" className="block w-full text-sm text-slate-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-violet-50 file:text-violet-700
                                                hover:file:bg-violet-100
                                                "/>
                                            </label>
                                        </div>
                                        <div className='flex flex-row space-x-10'>
                                            <div className='text-lg font-semibold w-44 text-end'>Token Name</div>
                                            <input onChange={(e) => {setTokenName(e.target.value)}} type="text" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                                        </div>
                                        <div className='flex flex-row space-x-10'>
                                            <div className='text-lg font-semibold w-44 text-end'>Token Symbol</div>
                                            <input onChange={(e) => {setTokenSymbol(e.target.value)}} type="text" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                                        </div>
                                        <div className='flex flex-row space-x-10'>
                                            <div className='text-lg font-semibold w-44 text-end'>Total Supply</div>
                                            <input onChange={(e) => {setTokenSupply(e.target.value)}} type="number" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                                        </div>
                                        <div className='flex flex-row space-x-10'>
                                            <div className='text-lg font-semibold w-44 text-end'>Gated Content Cost</div>
                                            <input onChange={(e) => {setContentCost(e.target.value)}} type="number" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' />
                                        </div>
                                        <div className='flex flex-rows justify-center space-x-4'>
                                            <button className='w-full mt-2 rounded-lg px-4 py-2 bg-green-500 hover:bg-green-600 text-white' onClick={() => saveProfile()}>Submit</button>
                                            {/* <button className='mt-2 rounded-lg px-4 py-2 bg-red-500 hover:bg-red-600 text-white' onClick={() => setShowLoginPopup(false)}>Close</button> */}
                                        </div>
                                    </div>
                                </ClickAwayListener>
                            )
                        }
                    </div>
            }
        </div>
    )
}
export default Profile;
