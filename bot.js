const rita = require('rita').RiTa;
const Twit = require('twit');
const T = new Twit(require('./t'));
const fs = require('fs');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
const dictionary = require('./dictionary.txt').split("\n");

function randomIndex(max, excepts){
    return Math.floor(Math.random()*(max+1));
}
Array.prototype.pick = function() {
    return this[Math.floor(Math.random()*this.length)];
}

const pickAdjective = function(firstLetter, length = 6){
    let word = dictionary.pick();
    while (!rita.getPosTags(word).includes('jj') || word.length < 3 || word.length > length || (firstLetter && word[0] != firstLetter.toLowerCase())) word = dictionary.pick();
    return word;
}

const findLines = function(adjective, secondCharIndex){
    let lines = [];
    for (var i = 0; i < adjective.length; i++) lines.push(pickAdjective(adjective[i]));
    return lines;
}

const buildAcrostic = function(){
    let acrostic = [], adjective = pickAdjective().toUpperCase().split(''), lines = findLines(adjective);
    let dontReplaceFirstCharIndex = randomIndex(adjective.length);
    for (var i = 0; i < adjective.length; i++){
        acrostic.push(adjective[i] + (i != dontReplaceFirstCharIndex ? lines[i].slice(1) : lines[i]));
    }
    return ['why yes im ' + adjective.join(''), acrostic.join('\n')].join('\n');
}

const tweetText = function(status){
    T.post('statuses/update', { status }, function(err, data, response) {
        console.log(data)
    })
}

const bot = function(){
    let status = buildAcrostic();
    while (status.length == 0 || status.length > 143) status = buildAcrostic();
    console.log(status)
    tweetText(status);
}
// bot();

setInterval(function() {
  try {
    bot();
  }
  catch (e) {
    console.log(e);
  }
}, 60000 * 60 * 9 * 1.1);