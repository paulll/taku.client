function translation(sentence){
    if(!localStorage.language) this.languageTable = require(`@/languages/en.json`);
    else this.languageTable = require(`@/languages/${localStorage.language}.json`);
    let translatedSentence = this.languageTable[sentence];
    if (!translatedSentence) return sentence;
    return translatedSentence;
}

module.exports = translation;