import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink as Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import leaves from '../leaves.png';

function Navbar () {

    const[selectedPage, setSelectedPage] = useState("feed");

    return (
        <div className="flex items-center justify-between w-full h-20 bg-white pr-8 border-b-2 border-green-700 bg-gray-100">
            <div className='flex flex-row items-center'>
                <img className='w-28 h-28' src={leaves} />
                <Link className="font-semibold text-3xl text-green-600" to='/'>
                    Greenverse
                </Link>
            </div>
            <div className="space-x-16 text-gray-600 font-normal text-lg">
                <Link className={`text-lg ${selectedPage === 'record' ? 'text-green-700 font-semibold' : ''} hover:text-green-700 hover:font-semibold`} to='/record' onClick={() => setSelectedPage('record')}>Record</Link>
                <Link className={`${selectedPage === 'post' ? 'text-green-700 font-semibold' : ''} hover:text-green-700 hover:font-semibold`} to='/post' onClick={() => setSelectedPage('post')}>Post</Link>
                <Link className={`${selectedPage === 'feed' ? 'text-green-700 font-semibold' : ''} hover:text-green-700 hover:font-semibold`} to='/' onClick={() => setSelectedPage('feed')}>Feed</Link>
                <Link className={`${selectedPage === 'search' ? 'text-green-700 font-semibold' : ''} hover:text-green-700 hover:font-semibold`} to='/search' onClick={() => setSelectedPage('search')}>Search</Link>
                <Link className={`${selectedPage === 'profile' ? 'text-green-700 font-semibold' : ''} hover:text-green-700 hover:font-semibold`} to='/profile' onClick={() => setSelectedPage('profile')}>Profile</Link>
                {/* <Link className="font-semibold text-lg" to='/stats'>Analytics</Link> */}
            </div>
            <div className="">
                <ConnectButton chainStatus="icon" showBalance={false} />
            </div>
        </div>
    )
}

export default Navbar;
