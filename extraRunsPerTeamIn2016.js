const matches = [];
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
        var matchIdList = findMatchIdOf2016(matches);
        findExtraRunsConcededByTeam(matchIdList, deliveries);
    });

function findMatchIdOf2016(matches) {
    var matchIdList = [];
    for (let index = 0; index < matches.length; index++) {
        if (matches[index].season === '2016') {
            matchIdList.push(matches[index].id);
        }
    }
    return matchIdList;
}

function findExtraRunsConcededByTeam(matchIdList, deliveries) {
    var extraRunsByTeams = new Map();
    for (var index = 0; index < deliveries.length; index++) {
        if (matchIdList.includes(deliveries[index].match_id)) {
            let extraRuns = parseInt(deliveries[index].extra_runs);
            if (extraRunsByTeams.has(deliveries[index].bowling_team)) {
                extraRuns = extraRuns + extraRunsByTeams.get(deliveries[index].bowling_team);
                extraRunsByTeams.set(deliveries[index].bowling_team, extraRuns);
            }
            else extraRunsByTeams.set(deliveries[index].bowling_team, extraRuns);
        }
    }
    console.log(extraRunsByTeams);
    
    const jsonContent = JSON.stringify(Object.fromEntries(extraRunsByTeams));

    fs.writeFile("public/output/extraRunsPerTeamIn2016.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("File Uploaded");
    });
}