var blurt = require('@blurtfoundation/blurtjs');

blurt.api.setOptions({ url: 'https://rpc.blurt.world', useAppbaseApi: true });
blurt.config.set('address_prefix','BLT');
blurt.config.set('chain_id','cd8d90f29ae273abec3eaa7731e25934c63eb654d55080caff2ebb7f5df6381f');
blurt.config.set('alternative_api_endpoints', ['https://rpc.blurt.world', 'https://rpc.blurt.world']);


const acc = 'nrg';
const wif = '';


function getlatestblock(){
  blurt.api.getDynamicGlobalProperties(function(err, result) {
    if(err)console.log('Error getting latest block number');
    if(result){
      console.log('successfully booted latest block');
      getblock(result.head_block_number)
    }
  });
}

function getblock(blockNum){
  blurt.api.getBlock(blockNum, function(err, result) {
    if(err) console.log('Error getting latest block');
    if(result)blockfilter(result.transactions, blockNum);
    if(!err && !result)setTimeout(getblock, 2000, blockNum);
  });
}

function blockfilter(ops, blockNum){
  for(var i=0;i<ops.length;i++){
    for(var j=0;j<ops[i].operations.length;j++){
      op = ops[i].operations[j];
      if(op[0]==='vote' && op[1].voter === 'blurtcurator'){
        op[1].voter = acc;
        broadcastvote(op);
      }
    }
  }
  blockNum++;
  getblock(blockNum);
}

function broadcastvote(op){
  blurt.broadcast.send({
    extensions: [],
    operations: [op]}, [wif], (err, result) => {
    console.log(err, result);
  });
}

getlatestblock();