const main = async () => {
    const favAlbumContractFactory = await hre.ethers.getContractFactory("FavAlbum");
    //This deploy's the contract with 0.1 eth
    const favAlbumContract = await favAlbumContractFactory.deploy({
        value: hre.ethers.utils.parseEther("0.1"),
    })
    await favAlbumContract.deployed();
    console.log("Contract addy:", favAlbumContract.address)

    //Get contract balance
    let contractBalance = await hre.ethers.provider.getBalance(favAlbumContract.address);
    console.log("Contract balance", hre.ethers.utils.formatEther(contractBalance));


    let submissionCount;
    submissionCount = await favAlbumContract.getTotalSubmissions();
    console.log(submissionCount.toNumber());

    //Submit an album
    let submissionTxn = await favAlbumContract.submitAlbum("url")
    await submissionTxn.wait(); //Wait for the transaction to be mined

    //Get  contract balance to see what happened
    contractBalance = await hre.ethers.provider.getBalance(favAlbumContract.address);
    console.log("Contract balance", hre.ethers.utils.formatEther(contractBalance));

    let allSubmissions = await favAlbumContract.getAllSubmissions();
    console.log(allSubmissions);

};

const runMain = async () => {
    try{
        await main();
        process.exit(0);
    } catch (error){
        console.log(error);
        process.exit(1);
    }
};

runMain();

