var matches = [];
const { Console } = require('console');
const csv = require('csv-parser')
const fs = require('fs');
const { mainModule } = require('process');

fs.createReadStream('data/matches.csv')
    .pipe(csv({})).on('data', (data) => matches.push(data))
    .on('end', () => {

    });
var deliveries = [];
fs.createReadStream('data/deliveries.csv')
    .pipe(csv({})).on('data', (data) => deliveries.push(data))
    .on('end', () => {
        var matchIdList = matchId(matches);
        var bowlerCountBalls = new Map();
        var bowlerTotalRuns = new Map();
        var bowlerAndEconomy = new Map();
        bowlerTotalRuns = findBowlerAndRuns(matchIdList, deliveries);
        bowlerCountBalls = findBowlerAndBalls(matchIdList, deliveries);
        bowlerAndEconomy = findBowlersEconomy(bowlerTotalRuns,bowlerCountBalls);
        
    });


function matchId(matches) {
    var matchIdList = [];
    for (let index = 0; index < matches.length; index++) {
        if (matches[index].season === '2015') {
            matchIdList.push(matches[index].id);
        }
    }
    return matchIdList;
}

function findBowlerAndRuns(matchIdList, deliveries) {
    var map = new Map();
    for (var index = 0; index < deliveries.length; index++) {
        if (matchIdList.includes(deliveries[index].match_id)) {
            let totalRuns = parseInt(deliveries[index].total_runs);
            if (map.has(deliveries[index].bowler)) {
                totalRuns = totalRuns + map.get(deliveries[index].bowler);
                map.set(deliveries[index].bowler, totalRuns);
            }
            else map.set(deliveries[index].bowler, totalRuns);
        }
    }
    return map;
}
function findBowlerAndBalls(matchIdList, deliveries) {
    var map = new Map();
    for (var index = 0; index < deliveries.length; index++) {
        if (matchIdList.includes(deliveries[index].match_id)) {
            let value = 1;
            if (map.has(deliveries[index].bowler)) {
                value = map.get(deliveries[index].bowler) + 1;
                map.set(deliveries[index].bowler, value);
            }
            else map.set(deliveries[index].bowler, value);
        }
    }
    return map;
}

function findBowlersEconomy(BowlerRuns,BowlerBalls){
    var findEachBowlerEconomy = new Map();
    for (let key of BowlerRuns.keys()) {
        let economy = (BowlerRuns.get(key) / (BowlerBalls.get(key)));
        findEachBowlerEconomy.set(key,economy*6);
    }
    findEachBowlerEconomy = new Map([...findEachBowlerEconomy.entries()].sort((a, b) => a[1] - b[1]));
    // console.log(findEachBowlerEconomy);
    var topTenBowlers = new Map();
    let count = 0;
    for (let key of findEachBowlerEconomy.keys()) {
        if (count==10)
            break;
        topTenBowlers.set(key,findEachBowlerEconomy.get(key));
        count++;
    }
    console.log(topTenBowlers);

    const jsonContent = JSON.stringify(Object.fromEntries(topTenBowlers));

    fs.writeFile("public/output/topTenEconomicalBowlers2015.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("File Uploaded");
    });
}