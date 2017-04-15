const rita = require('rita').RiTa;
const Twit = require('twit');
const fs = require('fs');
require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};
const dictionary = require('./dictionary.txt').split("\n");

Array.prototype.pick = function() {
    return this[Math.floor(Math.random()*this.length)];
}
const pickAdjective = function(){
    let word = dictionary.pick();
    while (rita.getPosTags(word) != 'jj' || word.length > 6) word = dictionary.pick();
    console.log(word, rita.getPosTags(word));
    return word;
}
pickAdjective()