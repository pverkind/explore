import { config } from "../config";
const { GITHUB_BASE_URL, GITHUB_BASE_RAW_URL } = config;

const pad = (n, width, z) => {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

/** Get the highest value for a key in an array of objects
 * 
 * @param {Array} arr 
 * @param {String} key 
 * @returns Integer
 */
function getHighestValueInArrayOfObjects(arr, key){
  let highest = -Infinity;
  for (let i=0; i<arr.length; i++){
    let n = parseInt(arr[i][key]);
    if (n > highest) {
      highest = n;
    }
  }
  return highest;
}

/*
function to  takes author death date as the parameter to return a padded repo URL
*/
const getGHRepo = (date) =>
  GITHUB_BASE_URL + "/" + pad(Math.ceil(date / 25) * 25, 4) + "AH/tree/master/data/";

const getGitHubRepoURL = (uri, type) => {
  if (uri) {
    const title = uri.split(".")[1];
    const author = uri.split(".")[0];
    const author_title = author + "." + title;
    const date = uri.substring(0, 4);

    if (type === "v") {
      return (
        GITHUB_BASE_URL +
        pad(Math.ceil(date / 25) * 25, 4) +
        "AH/tree/master/data/" +
        uri.split(".")[0] +
        "/" +
        author_title
      );
    }
    if (type === "a") {
      return (
        GITHUB_BASE_URL +
        pad(Math.ceil(date / 25) * 25, 4) +
        "AH/tree/master/data/" +
        author
      );
    }
  }
};

export const getGitHubRepoURLRaw = (uri, type) => {
  if (uri) {
    const title = uri.split(".")[1];
    const author = uri.split(".")[0];
    const author_title = author + "." + title;
    const date = uri.substring(0, 4);

    if (type === "v") {
      return (
        GITHUB_BASE_RAW_URL +
        pad(Math.ceil(date / 25) * 25, 4) +
        "AH/master/data/" +
        uri.split(".")[0] +
        "/" +
        author_title
      );
    }
    if (type === "a") {
      return (
        GITHUB_BASE_RAW_URL +
        pad(Math.ceil(date / 25) * 25, 4) +
        "AH/master/data/" +
        author
      );
    }
  }
};

/**
 * function to  take a object (obj) and object for newKeys and rename the keys before return the object e.g. change 'text_uri' to 'Text URI'
 */
const renameKeys = (obj, newKeys) => {
  const keyValues = Object.keys(obj).map((key) => {
    const newKey = newKeys[key] || key;
    return { [newKey]: obj[key] };
  });
  return Object.assign({}, ...keyValues);
};
const deleteKey = (key, { [key]: deletedKey, ...others }) => others;

const convertNumberToMillions = (labelValue) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
    : Math.abs(Number(labelValue));
};

// page number formatting of books in books section of visualization page
// THIS FUNCTION REPLACES ALL PAGE NUMBERS IN AN I.MECH FILE WITH THE PAGE NUMBER OF THE FIRST PAGE IN IT!
/*function pageNumberFormat(text) {
  var re = /(Page)(V\d{2})(P\d+\s)/g;
  var match = re.exec(text);
  //Vol. 5, p.22
  if (match) {
    var volnumber = parseInt(match[2].replace("V", ""), 10);
    var pagenumber = parseInt(match[3].replace("P", ""), 10);
  }
  text = text.replace(
    re,
    "<br/><a style='font-size: 14px; color: #059669;' title='archive.org' href='https://archive.org/' target='_blank'>" +
      "Vol." +
      volnumber +
      ", p." +
      pagenumber +
      "</a> <br/>"
  );

  return text;
}*/

function pageNumberFormat(text) {
  let pageTag ='<div class="pageNo">';
  //"<a style='font-size: 14px; color: #059669;' href='https://archive.org/' target='_blank'>";
  let re = /PageV0*([^P]+)P0*(\d+[AB]?)/g;
  //text = text.replace(re, `<br/>${pageTag}Vol. $1, p. $2</a> <br/>`);
  text = text.replace(re, `${pageTag}Vol. $1, p. $2</div>`);
  return text;
}

// Quran's ayat formatting in books section of visualization page

function quranVerseFormat(text) {
  var re = /@QB@(.*)@QE@/g;
  var match = re.exec(text);
  if (match) {
    text = text.replace(re, "<span class='quran-verse'>$1</span>");
  }
  return text;
}

// milestone formatting in book section of visualization
function imechToHtml(text) {
  console.log("imechToHtml");
  // new lines and paragraphs:
  text = text.replace(/\(@\)/g, "<br>"); // "\n" encoded as "(@)" in i.mech
  text = text.replace(/\(@@\)/g, "#"); // "#" encoded as "(@@)" in i.mech
  text = text.replace(/(?:\n|<br>)# /g, "<br>");
  text = text.replace(/(?:\n|<br>)~~/g, " ");
  // paratext / editorial tags:
  text = text.replace(/### \|([A-Z]+)\|/g, "<br/>($1)<br/>"); 
  // section titles:
  text = text.replace(
    /### (?<pipes>\|+)(?<titleText>[^<]+)(?:<br>)*/g,
    function (match, pipes, titleText) {
      let nPipes = pipes.length;
      return `<h${nPipes}>${titleText}</h${nPipes}>`;
    }
  );
  // dictionary entry titles: 
  text = text.replace(/### \$+ ([^<]*)(?:<br\/?>)*/g, "<h3>$1</h3>")

  text = pageNumberFormat(text);
  text = quranVerseFormat(text);
  text = text.replace(/ +/g, " ");
  text = text.replace(/(?:<br\/?>)+/g, "<br/>");
  return text;
}

// milestone formatting in book section of visualization
function cleanImech(text) {
  text = text.replace(/\(@@\)/g, "<br/>");
  text = text.replace(/[ ()|@#$~-]+/g, " "); 
  text = text.replace(/ +/g, " ");
  return text;
}

function cleanBeforeDiff(text, normalizeAlif, normalizeYa, normalizeHa, removePunct, removeTags) {
  text = cleanImech(text);
  if (normalizeAlif) {
    text = text.replace(/[أإآٱ]/g, "ا");
  }
  if (normalizeYa){
    // normalize Persian ya and alif maqsura to Arabic ya:
    text = text.replace(/[یى]/g, "ي");
  }
  if (normalizeHa){
    // normalize ta marbuta to ha:
    text = text.replace(/ة/g, "ه");
  }
  if (removePunct) {
    // replace poetry marker "..." with OpenITI poetry marker:
    text = text.replace(/ \.\.\. /g, " %~% ")
    // remove footnote markers:
    text = text.replace(/[«([/]\d+[»)\]/]/g, "");
    // remove punctuation:
    text = text.replace(/[.?!:،,’*"'%«»-]+/g, " ")
  }
  if (removeTags) {
    // poetry markers:
    text = text.replace(/ *%~% */g, " ... ");
    // structural tags:
    text = text.replace(/### \|[A-Z]*\|* ?/g, "");
    text = text.replace(/[$~#]+/g, "");
    // semantic tags:
    text = text.replace(/@[a-zA-Z@\d]+/g, "");
    // page numbers:
    text = text.replace(/[\n ]*PageV[^P]+P\d+[a-bA-B]?[\n ]*/g, " ");
    text = text.replace(/ *\[ *ص? *\d+[ أابوظ]*\] */g, " ");
  }
  // remove double spaces:
  text = text.replace(/ +/g, " ");

  return text;
}



// parse i.mech string (each line consists of <milestone_no><tab><milestone_text>)
const parseImech = (s) => {
  //let cleanedStr = imechToHtml(s);

  // create an object (keys: milestone number, values: milestone text)
  var val = {};
  s.split("\n").forEach(function (row) {
    if (row) {
      row = row.split("\t");
      var chunkNumber = Number(row[0].replace(/ms[A-Z]*/, ""));
      val[chunkNumber] = row[1];
    }
  });
  return val;
};

// get the index where you should insert a number in a sorted array:
// https://stackoverflow.com/a/21822316
function bisectLeft(array, value) {
	var low = 0,
		high = array.length;

	while (low < high) {
		var mid = low + high >>> 1;  // binary right shift, i.e., dividing by 2
		if (array[mid] < value) low = mid + 1;
		else high = mid;
	}
	return low;
}

export {
  getHighestValueInArrayOfObjects,
  pad,
  renameKeys,
  deleteKey,
  getGHRepo,
  getGitHubRepoURL,
  convertNumberToMillions,
  pageNumberFormat,
  quranVerseFormat,
  imechToHtml,
  cleanImech,
  parseImech,
  cleanBeforeDiff,
  bisectLeft
};
