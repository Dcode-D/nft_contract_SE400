pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Complex_Attributes_Contract is ERC721URIStorage,IERC721Receiver, Ownable {

    //handle token storage for owner
    mapping (address => uint256[]) tokenIds;

    function balanceOf(address owner) public view virtual override returns (uint256) {
        return tokenIds[owner].length;
    }

    function tokenOfOwner(address owner) external view virtual returns (uint256[] memory) {
        return tokenIds[owner];
    }

    function _mint(address to, uint256 tokenId) internal virtual override {
        super._mint(to, tokenId);
        tokenIds[to].push(tokenId);
    }

    function _transfer(address from, address to, uint256 tokenId) internal virtual override {
        super._transfer(from, to, tokenId);
        uint256 index = _indexOf(tokenIds[from], tokenId);
        tokenIds[from][index] = tokenIds[from][tokenIds[from].length - 1];
        tokenIds[from].pop();
        tokenIds[to].push(tokenId);
    }

    function _burn (uint256 tokenId) internal virtual override {
        address owner = ownerOf(tokenId);
        uint256 index = _indexOf(tokenIds[owner], tokenId);
        tokenIds[owner][index] = tokenIds[owner][tokenIds[owner].length - 1];
        tokenIds[owner].pop();
        super._burn(tokenId);
    }

    function _indexOf(uint256[] storage array, uint256 element) private view returns (uint256) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == element) {
                return i;
            }
        }
        revert("Element not found in array");
    }
    //Structs
    struct Attribute {
        string name;
        string value;
    }

    //logic handling functions
    //these handle merging functions
    function compareArrays(uint[] memory a, uint[] memory b) public pure returns(bool){
        if(a.length != b.length){
            return false;
        }
        for(uint i=0; i<a.length; i++){
            if(!contains(b, a[i])){
                return false;
            }
        }
        return true;
    }

    function contains(uint[] memory arr, uint elem) pure private returns (bool){
        for(uint i=0; i<arr.length; i++){
            if(arr[i] == elem){
                return true;
            }
        }
        return false;
    }

    //mapping tokens to their attributes
    mapping (uint256 => Attribute[]) public tokenAttributes;
    //mapping original to stored parts
    mapping (uint256 => uint256[]) public storedParts;
    //mapping represent attributes to parent
    mapping (uint256 => mapping(uint256 => Attribute)) parentToRepresentAttribute;
    //Token ids counter
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("AttributesNFT", "ANFT") {}

    //main functions

    function mint(address to, string memory tokenURI, string[] memory attributes, string[] memory values) external onlyOwner{
        require(attributes.length == values.length, "Attributes and values must have the same length");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        for(uint256 i = 0; i < attributes.length; i++){
            tokenAttributes[newTokenId].push(Attribute(attributes[i], values[i]));
        }
    }

    function addTrait(uint256 traitToken,uint256 addto, string memory repname, string memory repvalue) external{
        require(_exists(traitToken), "Token does not exist");
        require(_exists(addto), "Token does not exist");
        require(ownerOf(traitToken) == msg.sender);
        require(ownerOf(addto) == msg.sender);
        require(keccak256(abi.encodePacked(tokenURI(traitToken))) == keccak256(abi.encodePacked(tokenURI(addto))),"Tokens must have the same tokenURI");
        require(tokenAttributes[traitToken].length > 0, "Trait token must have attributes");
        if(tokenAttributes[traitToken].length == 1){
            tokenAttributes[addto].push(tokenAttributes[traitToken][0]);
            storedParts[addto].push(traitToken);
            parentToRepresentAttribute[addto][traitToken] = tokenAttributes[traitToken][0];
            safeTransferFrom(msg.sender, address(this), traitToken);
        }else{
            require(keccak256(abi.encodePacked(repname)) != keccak256(abi.encodePacked("")) && keccak256(abi.encodePacked(repvalue)) != keccak256(abi.encodePacked("")), "Represent attribute must have a name and a value");
            tokenAttributes[addto].push(Attribute(repname, repvalue));
            storedParts[addto].push(traitToken);
            parentToRepresentAttribute[addto][traitToken] = Attribute(repname, repvalue);
            safeTransferFrom(msg.sender, address(this), traitToken);
        }
    }

    function getAttributes(uint256 tokenId) public view returns (string[] memory){
        require(_exists(tokenId), "Token does not exist");
        string[] memory result = new string[](tokenAttributes[tokenId].length);
        for(uint256 i = 0; i < tokenAttributes[tokenId].length; i++){
            result[i] = string(abi.encodePacked(tokenAttributes[tokenId][i].name,":", tokenAttributes[tokenId][i].value));
        }
        return result;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        return
        bytes4(
            keccak256("onERC721Received(address,address,uint256,bytes)")
        );
    }
}