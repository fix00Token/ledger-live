export type Exchange = [string, string, string];
         
         const exchanges: Exchange[] = [["arbitrum","0345544808417262697472756d050345544812","3045022100e32757654ee2698300d95793a7303ddc8132293afa3b88d6393516f956fa8051022014bc74cdb227190e16efa1b90f9a8d552f565ee6205fa6101325a8fc8048dfda"],["arbitrum_goerli","04744554480f417262697472756d20476f65726c6906047445544812","3045022100b43012383f4e4d3d8f946283e9e76e0c48bb5f0af6667c3a4c6a2050b0e1392302206bb04c3ec6b880cf629ab7888724bb63686a17585995100346e8e094246cfb65"],["astar","044153545205417374617206044153545212","30440220543ae352a6501481078f236f27bff7b4fc4ffd5ac97d7ab1c8074e2e2db1306a022017cd270b663853e1257ae7d5bd38d648fed03d875061c10a4a301038ddc80c9a"],["avalanche","0441564158094176616c616e63686506044156415812","304402201235c0f0c0e2826f2b037ce854513f967d4da19231ae5ce7c95d08c772fa504802200470cbe3eba86ede84ddb8b1998b91f660e8154211b62b52900abad18e782ebc"],["avalanche_c_chain","0441564158114176616c616e636865204320436861696e06044156415812","3045022100f2a735a9243cf6f68690374c0c7ead57f5ededbeddc97f0f18b20e7376a04b060220381e7d4dac5fa373c1a746baf303f54db0b86b18dbb800e91ef7c043949de513"],["avalanche_c_chain_fuji","057441564158164176616c616e636865204320436861696e2046756a690705744156415812","304402203b22772b3b5ad313136df9bfc94d494deae94f529c80815ea3a3bac78271e1b102203c2c6ab5410a45f38a179897b4403de2f507079058d9f8e22b17f2b2224309eb"],["base","034554480442617365050345544812","3044022022eff0d10eb2a97b7d04a740b78ae637b44aa8368401f73f741a127da4b63bea0220340ad2486208db28333b5e849e874962708610cb2ce5c4cd3e477518f939194c"],["base_goerli","04744554480b4261736520476f65726c6906047445544812","30440220137310c5ed6edaede424e1d099c97cbc7a9390b906c145ad5ba8ea497851829202206d349c890bed28a10e5b60d4d26b7bf1140cdb221574bff65ff11b8bee0e980c"],["bitcoin","0342544307426974636f696e00","304402200b83467e11f32d2b06d1c4c1e5cd52887cfcabc307c96566f6db2dbf8326384b02200fe6081320fb73ead7ea844d77d99e6c34b12301931b1e23852b7d4b17f2346d"],["bitcoin_cash","034243480c426974636f696e204361736800","304402203c15c51ca229812c7a1536bb28ddffac729057a708f0730764c3b7b7e446b77802204c3c899711f9724c6ebf5441b17072b4397cb15354dc743a929dec87319ac2f6"],["bitcoin_gold","034254470c426974636f696e20476f6c6400","3044022015bad22723e8601297eeebfed094be9287252c5ee48dea603fae1a16c6dd689302207581b1efccf4235b0bef602d77ded28e37ee8729e6dbbab1918a28c10576cf2a"],["bitcoin_testnet","04744254430f426974636f696e20546573746e657400","30450221008cdc4bde5e84c049a987e4f335661bc8a9e5d3b34a06944676b1ba0d69f468ef02203e86cdee09f47012bf10402cf3cd0fce7b723561ed29367a72fb740960fdba02"],["bittorrent","034254540a426974746f7272656e74050342545412","304402204acdb14809cffa74a1dfccefa68d08a05d79813ea2895515e76d88604ac3a162022019350c8bd5ae81033c0f5c1e75437ae8e522c9dba3ac32e74f993c5c74e6e2c9"],["bsc","03424e421342696e616e636520536d61727420436861696e0503424e4212","304402201c0c1dc591c56a43fd983d9e9f3cef9a8e0e8edaedd5d8a0055d716d8f5033c302207bc578fcca351e9b639d14db7f61b7707b90658654f31711b669e5fc028dd5fa"],["cardano","034144410743617264616e6f00","3044022051d25a3f5e5a39a7633a7a545781e529c6df9a1133e74ae740aec9b2c9300ecc022023bf366df44e5a3696a2f33689fc8e82f9a3654dbc9384fe0e8d99dff78354fa"],["cardano_devnet","04744144410e43617264616e6f204465766e657400","3044022072ac2891abce32fa071ca72ba91b08ce926c30b9e6e6d8dcd445f5744b5da0c2022018c76e062bf5d43a1e65609b510addc0861f8b7d8e5cf92ead531f08e1e34f39"],["cardano_testnet","04744144410f43617264616e6f20546573746e657400","3045022100b720b4bd15be4c172b15d64de3198f8b56923d143e0e6e29ade47b1132e9b7cc02204ce7746df9631098828e6f941798a81feee04800d681aa3d3779038d3cb5c2c3"],["celo","0443454c4f0443656c6f060443454c4f12","304402207650ee6d9d45f7a57bbd97baaba94c5d7f4eccfc107770c3a30d77a1df0c356e02207bc9bc56b9586e6e655e3da1c29ee544cff71c5e11b662ae315b37b6ea34dcd4"],["celo_alfajores","057443454c4f0e43656c6f20416c66616a6f72657307057443454c4f12","3045022100dd312948f14aab3d34a82f2876ad7cd1ce0b76d3abd477fff70084a747e203d5022028db3f5dba6324c58b733e13df34307552e779ec78d540dffe5f415ba3aaa5c6"],["cosmos","0441544f4d06436f736d6f7300","304502210099f14a8806d0f5de3e7c91139e59eccb8a7fa72222f27f26a5219ca7f0f426b702205ab1dad2163d938d863d9d765a1fc19c630085556a0a4abc36a895f1f65946b4"],["cronos","0343524f0643726f6e6f73050343524f12","3045022100f1e6235bc215f80e8f77179a0c7d8417cf3f9256716586077a8b51fbfbce09c40220106957ef9692f89cc36a7a1041b559bae1acd7d12e6606793005894e1c628f6b"],["cronos_testnet","047443524f0e43726f6e6f7320546573746e657406047443524f12","3045022100a24342c2c9d128bce8cdda06971fdddf05d7a0f7fbb10c161f474796e268fe9b02203b952b95dde610e0aedf6fd9a47633de5abfd3f55765e3de1611e48220475c3c"],["dash","0444415348044461736800","304402203d5e9cdde31003257d3f007ff48b1725746cda03af89012b8e65fa3399e3b99b022043ca2a833e74a0b5ff90636936ebb07bd5ab9e89dabf8083debf9990e1b2d855"],["digibyte","0344474208446967696279746500","3045022100a79850d879a1180f0f755079f0c502be7c451a7933455d8bd262fd7834743ffe0220442cfaa5ea9631af7f2e7b43627bf0ff6fde4db3781253eba6626a2664ca6aaa"],["dogecoin","04444f474508446f6765636f696e00","3044022058970b3ea13e887238b0492b749f8d29fe0380fd275b1f543f66bda539aa1fc702201c8c67a0e8c2db25778057ea120c7c7cd9af6825ed87b3ce4e511ca128aacd41"],["ethereum","0345544808457468657265756d050345544812","304402200f69a8c4ca7373f8844097c55b4006d59432d093a787e1213f1b72f59fd91ebf02200adecbc32e2bac59b826a6d2b4e0ec133f3af1100cabcc1be082f95bd981e544"],["ethereum_classic","0345544310457468657265756d20436c6173736963050345544312","3045022100c8bbba1a5d867ba07b7672030d547459b4fde39fb5b82e7030e8c953a0641ded02206631b04863ce7f42f4deb8aee462bc944472685ec385c80c0b188b51d87c0a8a"],["ethereum_goerli","04744554480f457468657265756d20476f65726c6906047445544812","3045022100f85572c6809a920f567a62f6480959b63b2b4e7b2e296e762bc68f8a9784b1d70220669b34e0f47a3ad9791eeb10708a25c3db81eaa4eea3c7376fa283997a330d81"],["ethereum_pow","04455448570c457468657265756d20506f7706044554485712","304402207b6e92a41fcca4aebbe5d1175858c379580dceb8c3dd2a36a3a69f6e783ff6090220109af1fc8630c5df5731d1e958acef405da2ac31473ae2fe3f349f69136cfd6c"],["ethereum_ropsten","047445544810457468657265756d20526f707374656e06047445544812","304402205c299393b1178702495ec98510a4f644bfd3dd3885683cae4f1c6c8a3982555c022064604155a86b325dfdeb101205e321f1511df36b27dcf8df3b9a7155d351bd36"],["ethereum_sepolia","047445544810457468657265756d205365706f6c696106047445544812","3045022100805c2996915981c2f236b49affa1e8fe0cd119ea2002e364dcf49b04eecb3d8d022037676f8a721f1eb33dfc39b35cfa31e4d904c73c184991e36a5caf5895c17b92"],["fantom","0346544d0646616e746f6d050346544d12","304402203606ddfe9b2180f71c8a7c9351ba0b8cae57f17a613e80cb0d7858a693a265b2022077a57ef416699915ae2e0c615f965cdb514f7fd8a4202e1b6282a9c64e6e6497"],["fantom_testnet","047446544d0e46616e746f6d20546573746e657406047446544d12","3045022100f307d30fc7b9593168753740728ee09ae9b96722a77bf984561594dd66a1d391022045670d8c07a6895bf0f54c895899c715ee9730211736d4d671ca146d07d99183"],["filecoin","0346494c0846696c65636f696e050346494c12","304402202995ed5d15b6d7e438702481d0c8176b31b93e48095f10ad3bcf93a7f8b24af2022061abbf3efeb93cd0fb6797ad17d54c93b26f2f294dc50d85e594a31de5fc730e"],["filecoin_calibration","047446494c1446696c65636f696e2043616c6962726174696f6e06047446494c12","3045022100f929f0721644ee53e69e9ab4fcb685289565bfe384645b29194fc8da2df1e402022042a1254f65e397cb00278a98a795e23585b156908780ee4758bbce3c5f65176d"],["flare","03464c5205466c6172650503464c5212","3045022100fae11f1a8a122257d472d8f8b6d3043fe2363f07a988fce41f9bdaf6e5f794210220181ff14d654f42d08ec8b64a3cee6f837d7ecc27d5d383f66bcd2c911eb868a2"],["flare_coston","0474464c520c466c61726520436f73746f6e060474464c5212","3045022100ef21522772582aa24f9c14c86d73f4fbeafedeba4de0552358a32fd2544bbfef02203be757b5649ab9841619982f3d83b58c40b73e4d1c97cdb50c8d6b6ab5a438ab"],["kava_evm","044b415641084b6176612045766d06044b41564112","3045022100a65f298c98543642be725368de32660939f7da1df07762d1b752e12080eb25b50220075b9b71d5427a77f86d28551a338547ee1db74461f2c02e8bba96879268f49c"],["kava_evm_testnet","05744b415641104b6176612045766d20546573746e65740705744b41564112","3045022100dc233a9a7f2c9410c7de970a4c27439191555ceb223148512f025bf3ecc4476602200ea3fdb9522fbbad9963bd7e96cc4b2097f7b51b834ee115a15c49e279b4793c"],["klaytn","044b4c4159064b6c6179746e06044b4c415912","304402206317c373b860a390d1ac2dfe54c9a2f635910b30cd37c81d80bccfb3c839742202207287c011ffdc95762bbdfaca1af0d7dff439c7d4ef22efcd8175b4bce2098de8"],["klaytn_baobab","05744b4c41590d4b6c6179746e2042616f6261620705744b4c415912","3044022022582799ee8a2135a5d0aa898c8f835ae763a6ebbe9ca97c1c302ec0cf66f9a102206ac000fddde83a37f757d97d9f64891c5ee6ad6c6d0f0ef395dbf9707d5d1a83"],["komodo","034b4d44064b6f6d6f646f00","3045022100998c7520e7031a8618a60f0315446ab7985dc4719904a98ae96755e01eb104280220309721be157e84a65b2968d65d36d47a41c4f019409172e941d8907b49718fb8"],["litecoin","034c5443084c697465636f696e00","30440220322ad96dca9725d91783f046fa61beac2a0a7ceed4347f688e2934669f829dc60220728779b6557ce39458ed160c8c0cde597ed90731836c3aa2d51cd48535dd51c4"],["metis","054d45544953054d6574697307054d4554495312","3045022100e9bbe3633886afe1dfb6901425a4965e764c86e725dc619eb47c3894a61051b902205b874a3768564a8a72a48c8ec942335c8ca3dfe52c0d7b21a87c2916775d97dc"],["moonbeam","04474c4d52084d6f6f6e6265616d0604474c4d5212","304502210092f982a1f9d58ac6f3954f6171a6acd5e20e6969b6d13b4ed62524482db1180d02207f6130f66e9b88913bca9bdcb099c358d64d47f0b4c38f7af2231e36ceb4f024"],["near","044e454152044e65617200","3045022100ec70eb4f7bab216159a71bc10708b821acb969d8903dcc8f1f5739f9ca1f92a40220119c3d9c588660057a5a5982911ae64fb0916e405989a55f6d261a24c383eca8"],["neutron","044e54524e074e657574726f6e00","304502210083504f240d27bd2cfefa2a091641a4e7568bc1a38f85b8707cec7cd9bee3c2a2022070a76efce6057368d1f9435300d2bb7bdd01575d08f5b48952437a147cf655af"],["onomy","034e4f4d054f6e6f6d7900","304502210093815ef234a71362eebeaf892df0a0390a2334fc88b3a60a9339e1289adb7ac702206556e1f6ee77924a77587f28b94b407476381daed34b0beb084fb28166c33bf3"],["optimism","03455448084f7074696d69736d050345544812","3045022100810e29da4ae9d070ed7005caf6243f62fd7bb358b105c797bd1cdfb2d90d18af02205ccad55d2bd241fc531f5a10a63ef36e1135f8d8cd63040ac9fbe7693c01ceb5"],["optimism_goerli","04744554480f4f7074696d69736d20476f65726c6906047445544812","3045022100df1dec6a35f6804de7c6fc1ff9890d087b9fbeadb557f4d2fee16b9a8c316b4d02205f0ab1df24d64c649bd91f9dc205a9386ee5984a19550d906dabbcc828409b3e"],["osmo","044f534d4f074f736d6f73697300","3045022100f859714313518ab4be706114b92320d8d620429eb374a28041b0d2d6fae776b80220288a13f348e4404342fae018b0ae37efcbd9a55aa390c8a874f8fa199cee7a5e"],["peercoin","035050430850656572636f696e00","3045022100a1ecf708a9d6c4c4141354dfff2c35a365e43b2b4966ac0eb318c65a825fcbe302202e763173a24206a1c472634d419f7aad7b41e081e7e0f2b6332ba5d9b9f58186"],["persistence","04585052540b50657273697374656e636500","304402207d61cfe13a549844490466bbdbc0956382fbf2adeb4c0fcec36194412c69729d022022d4cf9f48309d8f271367b0a39618ca6083ed399b7f2a0367a1275bc42a6278"],["pivx","0450495658045069767800","304402201300d39306040abb2a3df0d30d91314746c85d52171d39a549552c442df68b3c0220049f1f504f5b0b4f5aa422411a27c7e2024827ed85f34d61ffd4f608e06c6482"],["polkadot","03444f5408506f6c6b61646f7400","304402203adb6cab12b9898fa30a0a9e117cdac9ee060a366c9937b0b3511913c6efe37c02203544b787c5a0a57ad2f4e85ea69613db129fc72c8edc7a7ede2c93ea317a5ed1"],["polygon","054d4154494307506f6c79676f6e07054d4154494312","3045022100f6b273253fa71317f7e69e5279b6dd786280dbebeffde9fd5de6a1570d3d36200220279ef3549393761e9b59b51ddbe423ebc078dae65815a69aabac5cc98e7782ca"],["polygon_mumbai","06744d415449430e506f6c79676f6e204d756d6261690806744d4154494312","3045022100ab0ecc1aaf6db257c664127a6cb30626df2573e81d3461ff20f530f9098c29d30220066eed3b2f85c92fa85617adf08f2bbaa69bb09991122fc66cbfe8832a843d75"],["polygon_zk_evm","034554480e506f6c79676f6e205a6b2045766d050345544812","30450221009bdcf8b184293b2f2176449a9faa8096f6bbde9f1811305818c46a68adbce0ff02200cabeb76cb3d77454e9c610f6c5ae79b94ce828dc7c032ded44c01cbd39361c7"],["polygon_zk_evm_testnet","047445544816506f6c79676f6e205a6b2045766d20546573746e657406047445544812","3044022015df84b3ed72178a473d59ea39b1554c752b9d3fc6a1a607d8f1421a1313890a022061dcf5e7bd5bdad3b70abae61abc5850bcfed64d1702f5edb41bead5d78ef19b"],["qtum","045154554d045174756d00","3045022100bf917e0b24327719fa37f755ad7c1070a049d8d5f2752b0524a3581a56b9f0e002202a1ca31a42753fbc29c4b93c3a7b7290c764e5a0fb1d9fc298bbb9f51b9edeb2"],["quicksilver","0351434b0b517569636b73696c76657200","304402201caebcdd32765c569343b31e69bed4a518a8d8dcb3e3fa61f98efc4be75723ac022032026bde79ef070a30b9748895910ac3a71285bd33aefa6f886e0653ad185d55"],["ripple","035852500358525000","30450221008fb0ff1f9479b67c5ed560c49d70f4b41c946fb87c4c9f8364a207f5dc2f2d190220561b5e4483667d9196fa5624c2ba7a7364a40a6ee91dcd9675941222bf861161"],["rsk","04524254430352736b06045242544312","304402204f3f55acb8c9bf7b610c76702183771532d618a5965c15efb6d3a4781c0ef74102203771d0cc54245c523a2030db6fd5f80c6a2964df3973df64e0b6c1f73da16854"],["solana","03534f4c06536f6c616e6100","304402200b9d73926ef49cf6e3f775d4685cc1db7db95866d04b26bd384ae4f6185932ba0220574ec6e7a38d5fa827b541003947dda7ef51f721f162ed9d2bfe87b7457fdcf9"],["solana_devnet","0474534f4c0d536f6c616e61204465766e657400","304402201fd15de58ed9e160d4aaa3deaa4688eae86c2733bc120f2c6f17712408b5af63022054f779a9130fccfcf30b2a28bc0ac9be505735c7cac68511127c6f19bd510a26"],["solana_testnet","0474534f4c0e536f6c616e6120546573746e657400","3045022100f5429072d324201ec291cf1ba88a3834b0fafe2eb005e0d0378557e263baed940220611200f2f4c367e48dfb7bf6b4d073d1583e5acdbac3618d6d369e2878ae0521"],["songbird","0353474208536f6e6762697264050353474212","304402203c5ee34fe17bd801ed6d0da330927eb2a796a786aaf124134cb915c93c108a4802203372a9a47d52ac2c06afab3e618eca44eb6e7fce5ad860825cf41405c13bd1a4"],["stellar","03584c4d075374656c6c617200","30440220601a3941b0aece3fb970566252784343c4f3497f53dba3db8f74b5a66a43ea6f02201be00ca7def64829892e6a9c0affb361d58df2899109d70c039ce527b9ed9e33"],["stellar_testnet","0474584c4d0f5374656c6c617220546573746e657400","30440220213fc64616838003e4a2536bd991a8d4cca06ef46c8ff8c18e2ed1baf836bfab022044d68c200f40d761211c35bbe5265b33f7ca0ee5ddcde6b634e40c2ab325fc97"],["stratis","055354524154075374726174697300","304402203d571457df62e869038b5794024720fddca5f8ebd427958a79896554df833c7e02204914f131a398098146882655a3381fa84a6ebc7cc48744d58512a4d1a512eb6e"],["stride","04535452440653747269646500","3045022100cb0970b79775bb35b19cb1278a760ed2b2e0a880e563da36aa4c511237050ae3022005e68410e0729256d114ecdc105b66287b75ed2b7a49ed85247c942d06451c96"],["syscoin","0353595307537973636f696e050353595312","3044022060f554250c07d952773c07bf63190aaa56034a6cd1e733ef2b98b6cacb8bfc9102203c193387395ab7ebb3a65ef4c3a6922613cabdf5a8cf545a7f65046a61ed0539"],["tezos","0358545a0554657a6f7300","30440220410f671642478312444d3c20c0a6f76329218bcfc9906f2e58720f87dcafba5802200ffbd2ecb4fa1bbb283e81d36cf57857938fad01f2409c6a74b16cee8d327822"],["tomo","04544f4d4f04546f6d6f0604544f4d4f12","3044022042edfd8501902264d1ff11ac7422c7b6f71c7c3d7610d61ca9be36cc8430af1a0220181c14a7efb6c64ba5811cb82fd44a7aecc99c9232e8ef6075fd1c20c54271c7"],["tomo_testnet","0574544f4d4f0c546f6d6f20546573746e6574070574544f4d4f12","3044022057575b9a6c84525b81f71df56504d916f5b0043b67f0cc1a1d3dd134dab4886002207c21d1f04598f51381f57a076a7251f41745cb198331e5eab72cb4c9f7f313e4"],["tron","035452580454726f6e00","3045022100d2f2d807fb4f6df32a59b2ccd6462aff710bf1fb435e2695d6e8cf66e6d064a402205a00fe5fc6fc1b184eaf59b4b765be948f10867b929295a4049b4524c264476c"],["velas_evm","03564c580956656c61732045766d0503564c5812","3044022062902d424e29d1f206f0f342e22e4b19380866a0c6c248ba4c18d34f155147dc0220695442b7e1e17591d5184a950d418d475d367dd6b409a7b0794f6654548acfe1"],["vertcoin","035654430856657274636f696e00","3045022100bdbc975f4734e72986504684cb82e610bd46d2dbd7e628454c37a5afd7ffe1ae02202fbdd7880867632c068ee64f70e4207e2638ccac2d58357770c9b1c28d28cee6"],["viacoin","0356494107566961636f696e00","3044022013297952a9568e41d1c4195c1eafeb8248dfd45a0c55a9ba96f0209581316f6a0220124661c2026a1141be6e17bf56362f9f2892c784a8fc45a2595b28ec9210dd2b"],["westend","0474574e440757657374656e6400","3044022000ae68b4878f91c2d6df6933e287f845a86c54cdbf597518b593588cbfc530d402205713c4ee9da0552f07ba628a5aa41b311620e6e5d360896796298cdd09fc8f54"],["zcash","035a4543055a6361736800","3045022100d6d49d7b51935899672edf3760a36207dbc3172de2cb635d4af5322fab7c669a02206881ca3ad323e1e2334c4838fa9d17f105ecc574153078f578916eeca908d6fc"],["zencash","035a454e07486f72697a656e00","304402202ca9aab0a04fdb69443519d1d528bb890e3f2bd2a0a0842d62cce543ac00e7ed022001ec56b9710adb7ca7509dda6c095cf741fe00f5fbd17a1bb7201626f6337a42"]];
         
         export default exchanges;
         