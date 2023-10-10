// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyToken is ERC721 {

    uint public totalSupply;
    uint public tokenId = 0;
    string public tokenURIs;
    address public owner;
    uint public mintCost;

    constructor(uint _totalSupply, string memory tokenName, string memory tokenSym, uint _mintCost, string memory _tokenURIs) ERC721(tokenName, tokenSym) {
        totalSupply = _totalSupply;
        tokenURIs = _tokenURIs;
        owner = _msgSender();
        mintCost = _mintCost;
    }

    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        _requireMinted(_tokenId);
        return tokenURIs;
    }

    function mintNFT() payable public {
        require(msg.value >= mintCost, "Please pay the appropriate mint fee");

        payable(owner).transfer(mintCost);

        if(msg.value - mintCost > 0) {
           payable(_msgSender()).transfer(msg.value - mintCost); 
        }

        _safeMint(msg.sender, tokenId);
        tokenId +=1;
    }
}
