// let csvToJson = require('convert-csv-to-json');

// let matchesInput = csvToJson.fieldDelimiter(',').getJsonFromCsv("data/matches.csv");



const matches = [];
const { Console } = require('console');
const csv = require('csv-parser');
const fs = require('fs');
const { mainModule } = require('process');
const { finished } = require('stream');

fs.createReadStream('data/matches.csv')
    .pipe(csv({})).on('data', (data) => matches.push(data))
    .on('end', () => {
        //console.log(matches);
        findNumberOfMatchesWinPerYear(matches);

    });

function findNumberOfMatchesWinPerYear(results) {
    var data = [];
    const season = [];
    for (var index = 0; index < results.length; index++) {
        if (!(season.includes(results[index].season))) {
            season.push(results[index].season)
        }
    }
    for (var j = 0; j < season.length; j++) {
        var map = new Map();
        for (var i = 0; i < results.length; i++) {
            let value = 1;
            if (season[j] === results[i].season) {
                if (map.has(results[i].winner)) {
                    value = map.get(results[i].winner) + 1;
                    map.set(results[i].winner, value);
                }
                else map.set(results[i].winner, value);
            }
        }
        // console.log(map);
        let ref = season[j];
        data.push(ref, Object.fromEntries(map));
    }


    const jsonContent = JSON.stringify(data);

    fs.writeFile("public/output/matchesWonPerTeamPerYear.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("File Uploaded");
    });
    // console.log(data);
}
