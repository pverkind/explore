import { arTokRegex, arCharRegexWithSpace } from "../assets/js/openITI.js";

// extract the alignment from a milestone text
export const extractAlignment = (msText, startTok, endTok, token="word") => {
    let tokRegex;
    if (token === "word"){
      tokRegex = arTokRegex;
    } else {
      tokRegex = arCharRegexWithSpace;
    }
    console.log("TOKEN TYPE: "+token);
    console.log(tokRegex);
    // get the start index of each Arabic token in the milestone text:
    let tokenMatches = msText.matchAll(tokRegex);
    //console.log([...tokenMatches]);
    let tokenStartIndices = [];
    for (const m of tokenMatches) {
      tokenStartIndices.push(m.index);
    }
    
    // map the start and end tokens to characters in the text:
    const startChar = tokenStartIndices[startTok] || 0;
    const endChar = tokenStartIndices[endTok] ||  msText.length;
    const alignment = msText.slice(startChar, endChar);
    console.log(alignment);
   
    return [alignment, startChar, endChar];
  };
/*
// Split the text of a milestone to emphasize the alignment:
export const splitMilestone = (msText) => {

    // get the start and end token of the alignment:
    let startTok = bookNumber === 1 
      ? booksAlignment.bw1 
      : booksAlignment.bw2;  
    let endTok = bookNumber === 1 
      ? booksAlignment.ew1 
      : booksAlignment.ew2;

    // extract the alignment from the milestone text
    // (and get its start and end character index)
    let resp = extractAlignment(msText, startTok, endTok);
    let [alignment, startChar, endChar] = resp;

     // split the text:
    let beforeAlignment = msText.slice(0,startChar);
    let afterAlignment = msText.slice(endChar, msText.length);
 

    // set the book alignment string: 
    if (bookNumber === 1) {
      booksAlignment["s1"] = alignment;
    } else {
      booksAlignment["s2"] = alignment;
    }
    //setBooksAlignment(booksAlignment);

    return `${beforeAlignment}<br>ˇˇˇˇˇˇˇˇˇˇˇ<br>${alignment}<br>^^^^^^^^^^^^<br>${afterAlignment}`;
  }*/