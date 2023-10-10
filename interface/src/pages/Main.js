import { useNetwork, useAccount, erc20ABI, useProvider, useSigner } from 'wagmi';
import { useEffect, useState } from 'react';
import qs from 'qs';
import { ethers, utils } from "ethers";
import Loading from '../components/Loading';

function Main() {

    const[publicPosts, setPublicPosts] = useState([])
    const[loading,setLoading] = useState(true)

    useEffect(() => {
        try {
            (async () => {
                const publicData = await (await fetch(`https://huddlegram-backend.onrender.com/api/posts/public/`,)).json();
                console.log(publicData)
                setPublicPosts(publicData['data'])
                setLoading(false)
            })();
        } catch(error) {

        }
    }, [])


    const Posts = ({postList}) => {
        if (postList.length === 0) {
            return (
                <div className='flex items-center justify-center h-full'>
                    No Posts Yet
                </div>
            )
        }
        return (
            <div className='grid grid-cols-1 gap-1 h-full mt-10 space-y-4'>
                {postList.map(post => {
                    const source = post['url'];
                    return (
                        <div className='w-76 h-[400px] my-2 pb-6' key={post['_id']}>
                            <div className='flex flex-row items-center space-x-2 px-2 py-1'>
                                <div className='rounded-full w-14 h-14 p-1'>
                                    <img src={post['picture']}  className='rounded-full w-full h-full'/>
                                </div>
                                <div>
                                    <div className='font-semibold text-md'>{post['name']}</div>
                                    <div className='font-light text-xs'>{post['description']}</div>
                                </div>
                            </div>
                            {
                                post['filetype'] === 'video' ? 
                                    <video src={source} className="w-[450px] h-[350px]" type="video/mp4" controls></video>
                                :   <img src={source} className="w-[450px] h-[350px]" />
                            }
                        </div>
                    )
                })}
            </div>
        )
    } 

    return (
        <div className="flex flex-1 items-center justify-center h-[710px] overflow-y-scroll">
            { loading ? <div><Loading/></div> : <Posts postList={publicPosts}/>}
        </div>
    )
}
export default Main;
