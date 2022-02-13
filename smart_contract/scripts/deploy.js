//Here we are using Ethers.js to interact with the blockchain
const main = async () => {
    const favAlbumContractFactory = await hre.ethers.getContractFactory("FavAlbum");
    const favAlbumContract = await favAlbumContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.001"),
    });

    await favAlbumContract.deployed();

    console.log("FavAlbum address: ", favAlbumContract.address);
};

const runMain = async () => {
    try{
        await main();
        process.exit(0);
    } catch(error){
        console.log(error);
        process.exit(1);
    }
};

runMain();