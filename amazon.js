// Creating the "require" function
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Requiring big.js to be able to use arbitrarily Large numbers.
const Large = require('big.js');

// Importing d3-dsv to use its TSV parser.
import { tsvParseRows } from 'd3-dsv';

let helpfulVoteCount = new Large(0);
let totalVoteCount = new Large(0);
let lineCt = new Large(0);

const inputFile = "amazon_reviews_us_Mobile_Apps_v1_00.tsv";

let fileLineReader = require("readline").createInterface({
    input: require('fs').createReadStream(inputFile)
});

fileLineReader.on("line", function (line) {
    if (lineCt.toNumber() > 0) {
        let read = tsvParseRows(line);
        // Get helpful vote and total vote count.
        helpfulVoteCount = helpfulVoteCount.plus(parseInt(read[0][8]));
        totalVoteCount = totalVoteCount.plus(parseInt(read[0][9]));
    }
    lineCt = lineCt.plus(1);
});

fileLineReader.on("close", function () {
    let totalUnhelpfulVoteCount = new Large(totalVoteCount.minus(helpfulVoteCount));
    let avgHelpful = new Large(helpfulVoteCount.div(lineCt.minus(1)));
    let avgUnhelpful = new Large(totalUnhelpfulVoteCount.div(lineCt.minus(1)));
    // Using .toString so we don't lose precision.
    console.log("Average helpful votes: ", avgHelpful.toString());
    console.log("Average unhelpful votes: ", avgUnhelpful.toString());
});
//OUTPUT:

//total number of helpful votes divided by total number of reviews
//total number of unhelpful votes divided by total number of reviews