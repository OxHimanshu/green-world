import '@rainbow-me/rainbowkit/styles.css';
import { useEffect } from 'react';
import {
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig, Chain } from 'wagmi';
import { filecoinCalibration } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import Main from './pages/Main';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Record from './pages/Record';
import Post from './pages/Post';
import Search from './pages/Search';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const opBNB = {
  id: 5611,
  name: 'opBNB Testnet',
  network: 'opBNB Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'opBNB Testnet',
    symbol: 'tBNB',
  },
  rpcUrls: {
    public: { http: ['https://opbnb-testnet-rpc.bnbchain.org'] },
    default: { http: ['https://opbnb-testnet-rpc.bnbchain.org'] },
  },
  blockExplorers: {
    etherscan: { name: 'SnowTrace', url: 'http://opbnbscan.com/' },
    default: { name: 'SnowTrace', url: 'http://opbnbscan.com/' },
  },
}

const { chains, provider } = configureChains([filecoinCalibration], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'greenverse',
  chains
});

const client = createClient({
  connectors,
  provider,
})

function App() {
  return (
      <WagmiConfig client={client}>
        <RainbowKitProvider chains={chains} theme={lightTheme({
        accentColor: '#16A34A ',
        accentColorForeground: 'white',
      })}>
          <div className="w-screen h-screen">
            <Router>
              <Navbar/>
              <Routes>
                <Route path='/' exact element={<Main/>} />
                <Route path='/profile' exact element={<Profile/>} />
                <Route path='/record' exact element={<Record/>} />
                <Route path='/post' exact element={<Post/>} />
                <Route path='/search' exact element={<Search/>} />
              </Routes>
            </Router>
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
  );
}

export default App;
