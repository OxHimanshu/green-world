import { useEffect, useState } from "react";
import { useAccount } from 'wagmi'
import { ethers } from 'ethers';
import contractAbi from '../nftABI.json';
import { useSigner, useProvider } from "wagmi";
import { waitForTransaction } from '@wagmi/core'
import { useAlert, positions } from 'react-alert';
import Loading from '../components/Loading';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function Search() {
    const { data: signer } = useSigner();
    const { data: provider } = useProvider();
    const { address, isConnected } = useAccount()
    const[loading, setLoading] = useState(true)
    const[loggedIn, setloggedIn] = useState(false)
    const[searchKey, setSearchKey] = useState("")
    const[profileData, setProfileData] = useState(null)
    const[showPosts, setShowPosts] = useState("public")
    const[publicPosts, setPublicPosts] = useState([])
    const[gatedPosts, setGatedPosts] = useState([])
    const[gatedAccess, setGatedAccess] = useState(false)
    const[myData, setMyData] = useState(null)

    const alert = useAlert()

    useEffect(() => {
        if(isConnected) {
            setloggedIn(true)
            try {
                (async () => {
                    const data = await (await fetch(`https://huddlegram-backend.onrender.com/api/profiles/${address}`,)).json();
                    if(data['data'] != null) {
                        setMyData(data['data'])
                        setloggedIn(true)
                    } else {
                        alert.error(<div>please create profile</div>, {
                            timeout: 4000,
                            position: positions.BOTTOM_RIGHT
                        });
                    }
                    setLoading(false)
                })();
            } catch(error) {

            }
        } else {
            setloggedIn(false)
        }
    },[isConnected])

    useEffect(() => {
        if(gatedAccess) {
            (async () => {
                const gatedData = await (await fetch(`https://huddlegram-backend.onrender.com/api/posts/gated/${profileData['_id']}`,)).json();
                console.log(gatedData)
                setGatedPosts(gatedData['data'])
            })();
        }
    }, [gatedAccess])

    useEffect(() => {
        if(profileData) {
            try {
                (async () => {
                    if(profileData["_id"] === myData["_id"]) {
                        setGatedAccess(true)
                    } else {
                        setGatedAccess(false)
                    }
                    const nftContract = new ethers.Contract(profileData["nftContract"],contractAbi.abi,provider);
                    const signedNftContract = await nftContract.connect(signer);
                    const balance = await signedNftContract.balanceOf(address);
                    console.log("Balance is: ", balance.toNumber())
                    if(balance.toNumber() > 0) {
                        setGatedAccess(true)
                    }
                })();
            } catch(error) {

            }
        }
    },[profileData])

    const searchProfile = async () => {
        setLoading(true)
        setGatedPosts([])
        try{
            const publicData = await (await fetch(`https://huddlegram-backend.onrender.com/api/profiles/username/${searchKey}`,)).json();
            const profiles = publicData['data']
            console.log(profiles)
            if(profiles.length === 0) {
                alert.error(<div>profile not found</div>, {
                    timeout: 4000,
                    position: positions.BOTTOM_RIGHT
                });
                setProfileData(null)
            } else {
                console.log("Profile data here: ", profiles[0])
                setProfileData(profiles[0])
                const publicData = await (await fetch(`https://huddlegram-backend.onrender.com/api/posts/public/${profiles[0]['_id']}`,)).json();
                console.log(publicData)
                setPublicPosts(publicData['data'])
                console.log(publicData['data'])

            }
            setLoading(false)
        } catch(error) {
            
        }

    }

    const mintNFT = async () => {
        const nftContract = new ethers.Contract(profileData["nftContract"],contractAbi.abi,provider);
        const signedNftContract = await nftContract.connect(signer);
        const txnReceipt = await signedNftContract.mintNFT({value: ethers.utils.parseUnits(profileData["contentCost"], "ether")});
        console.log(txnReceipt)
        alert.success(
            <div>
                <div>Minting Nft</div>
                <button className='text-xs' onClick={()=> window.open("https://hyperspace.filfox.info/en/tx/" + txnReceipt.hash, "_blank")}>View on explorer</button>
            </div>, {
            timeout: 0,
            position: positions.BOTTOM_RIGHT
        });
        setGatedAccess(true)
    }

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

    const ProfileTab = () => {
        return (
            <div className="flex flex-col items-center w-full h-full space-y-4">
                <div className="h-content flex flex-col items-center justify-center w-8/12">
                    <div className='flex flex-rows space-x-20 my-2 items-center'>
                        <div className='border border-2 rounded-full w-36 h-36 p-1'>
                            <img src={profileData["picture"]}  className='rounded-full w-full h-full'/>
                        </div>
                        <div className='space-y-2'>
                                <div className='flex flex-rows space-x-4'>
                                    {/* <div>Username: </div> */}
                                    <div className='font-normal text-2xl'>{profileData['name'] !==null ? profileData['name']: 'username not found'}</div>
                                    {/* <button className='rounded-lg border bg-blue-500 text-white px-2 py-2' onClick={() => setShowLoginPopup(true)}>Edit Profile</button> */}
                                </div>
                                <div className='flex flex-row space-x-2 font-medium text-md'>
                                    <div>{profileData['maxSupply']}</div><div className='font-light'>nfts</div>
                                    <div>{profileData['contentCost']}</div><div className='font-light'>tfil/nft</div>
                                </div>
                                <div className='flex flex-col'>
                                    <div className='text-sm font-semibold'>Description</div>
                                    <div className='text-xs font-light'>{profileData['description'] !==null ? profileData['description']: 'description not found'}</div>
                                </div>
                            </div>
                    </div>
                </div>
                <div className="h-[460px] w-full flex flex-col items-center">   
                    <div className='flex flex-rows w-8/12 border-t border-gray-600 justify-center space-x-28 my-2'>
                        <button className={`pt-4 h-10 w-24 font-semibold ${showPosts === 'public' ? 'border-t-2 border-white text-black' : 'text-gray-500' } flex justify-center items-center`} onClick = {() => setShowPosts('public')}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 96 960 960" width="28"><path fill="#FFFFFF" d="M200 936V271q0-24 18-42t42-18h440q24 0 42 18t18 42v665L480 816 200 936Zm60-91 220-93 220 93V271H260v574Zm0-574h440-440Z"/></svg>
                            <div className='text-sm ml-1'>Posts</div>
                        </button>
                        <button className={`pt-4 h-10 w-24 font-semibold ${showPosts === 'gated' ? 'border-t-2 border-white text-black' : 'text-gray-400' } flex justify-center items-center`} onClick = {() => setShowPosts('gated')}>
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
                            gatedAccess ? <Posts postList={gatedPosts}/> :
                            <div className="h-72 flex flex-col justify-center items-center space-y-4"> 
                                <div>Mint NFT To Gain Exclusive Access</div> 
                                <button className="rounded-md px-4 py-2 bg-blue-500 text-white hover:bg-blue-600" onClick={() => mintNFT()}>Mint</button>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center w-full h-[710px] text-black">
            <div className="flex flex-row space-x-4 my-4 ">
                <label class="relative block">
                    <span class="sr-only">Search</span>
                    <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="26"><path d="M796 935 533 672q-30 26-69.959 40.5T378 727q-108.162 0-183.081-75Q120 577 120 471t75-181q75-75 181.5-75t181 75Q632 365 632 471.15 632 514 618 554q-14 40-42 75l264 262-44 44ZM377 667q81.25 0 138.125-57.5T572 471q0-81-56.875-138.5T377 275q-82.083 0-139.542 57.5Q180 390 180 471t57.458 138.5Q294.917 667 377 667Z"/></svg>
                    </span>
                    <input onChange={(e) => {setSearchKey(e.target.value)}}   class="text-black placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-green-600 focus:ring-green-600 focus:ring-1 sm:text-sm" placeholder="Search for username..." type="text" name="search"/>
                </label>
                {/* <input type="text" className='border border-slate-300 rounded-sm text-sm shadow-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500' /> */}
                <button className="rounded-md px-4 bg-green-600 text-white hover:bg-green-700" onClick={() => searchProfile()}>Search</button>
            </div>
            <div className="h-[640px] w-full flex items-center justify-center">
                {
                    !loggedIn ? <div><ConnectButton chainStatus="icon" showBalance={false}/></div> : loading ? <div><Loading/></div> : !profileData ? <div> No Profiles Found.. </div> :
                    <div className="h-full w-full">
                        <ProfileTab />
                    </div>
                }
            </div>
        </div>
    )
}
export default Search;