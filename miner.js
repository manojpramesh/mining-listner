const express = require('express')
const request = require('request');
const chalk = require('chalk');

const app = express();
const time = chalk.cyan;

/**
 * Home route
 */
app.get('/', function(req, res) {
    res.send('Dark web!!');
});

/**
 * Generates DAG for new network
 */
jsonrpc.blockNumber((blockNumber) => {
    if (blockNumber.result == "0x30") {
        jsonrpc.startMining((status) => {
            console.log(time(new Date() + " : ") + chalk.yellow("Generating DAG.."));
        });
    }
});

/**
 * listnes for new transactions and starts/stops mining accordingly
 */
let history = 0;
setInterval(() => {
    jsonrpc.newPendingTransactionFilter((data) => {
        jsonrpc.getFilterChanges([data.result], (tx) => {
            if (tx.result && tx.result.length > 0) {
                history = 0;
                console.log(time(new Date() + " : ") + chalk.green(tx.result.length + "Transaction(s) found."));
                console.log(time(new Date() + " : ") + chalk.green(tx.result));
                jsonrpc.startMining((res) => {
                    console.log(time(new Date() + " : ") + chalk.green("Mining started.."));
                });
            } else {
                jsonrpc.stopMining((res) => {
                    if (history == 0) console.log(time(new Date() + " : ") + chalk.yellow("No transactions. Miner stopped."));
                    history = 1;
                });
            };
        });
    });
}, 2000);


/**
 * Makes request to 
 * 
 * @param {object} data 
 * @param {function} callback 
 */
var makeCurl = (data, callback) => {
    var options = {
        method: 'POST',
        url: process.env.rpc || "http://localhost:8545",
        headers: {
            'cache-control': 'no-cache',
            'content-type': 'application/javascript'
        },
        body: data
    };
    request(options, function(error, response, body) {
        if (error) throw new Error(error);
        callback(JSON.parse(body));
    });
};


var jsonrpc = {
    // curl -X POST --data '{"jsonrpc":"2.0","method":"eth_newPendingTransactionFilter","params":[],"id":73}'
    newPendingTransactionFilter: (cb) => {
        return makeCurl('{"jsonrpc": "2.0", "method": "eth_newPendingTransactionFilter", "params": [], "id": 73 }', cb);
    },
    // curl -X POST --data '{"jsonrpc":"2.0","method":"eth_getFilterChanges","params":["0x16"],"id":73}'
    getFilterChanges: (param, cb) => {
        param = JSON.stringify(param);
        return makeCurl('{"jsonrpc":"2.0","method":"eth_getFilterChanges","params":' + param + ',"id":73}', cb);
    },
    // curl -X POST --data '{"jsonrpc":"2.0","method":"miner_start","params":[1],"id":1}'    
    startMining: (cb) => {
        return makeCurl('{"jsonrpc":"2.0","method":"miner_start","params":[1],"id":1}', cb);
    },
    // curl -X POST --data '{"jsonrpc":"2.0","method":"miner_stop","params":[1],"id":1}'  
    stopMining: (cb) => {
        return makeCurl('{"jsonrpc":"2.0","method":"miner_stop","params":[1],"id":1}', cb);
    },
    // curl
    blockNumber: (cb) => {
        return makeCurl('{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":83}', cb);
    }
};


app.listen(3003, function() {
    console.log(chalk.blue('Listneing for transactions..'));
})