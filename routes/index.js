var express = require('express');
var router = express.Router();
var lib = require('../core')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
})

router.post('/:route', function (req, res, next) {
  try {
    const { text, useRefineStopword } = req.body;
    const { route } = req.params;

    const cleanHtml = true

    const maybeCleanHtml = cleanHtml ?
      lib.santinizeHtml(text)
      : text

    const maybeRefineStopwords = useRefineStopword === 'true'
      ? lib.refineStopwords(maybeCleanHtml).join(" ")
      : maybeCleanHtml

    const result = requestHandler(route, maybeRefineStopwords)

    console.log({ method: route });
    console.log({ useRefineStopword: useRefineStopword });

    console.log({ inputText: maybeCleanHtml });
    console.log({ result });
    console.log('\n\n');

    return res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).end(error)
  }
})

function requestHandler(route, text) {
  switch (route) {
    case 'refine-stopwords':
      return lib.refineStopwords(text)
    case 'tokenize':
      return lib.tokenizer(text)
    case 'word-segmentation':
      return lib.wordSegmentation(text)
    case 'pos-tagging':
      return lib.posTagging(text)
    case 'chunking':
      return Chunking_Take1And3(lib.chunking(text))
    case 'ner':
      return NER_Take1And4(lib.ner(text))
    case 'tfidf':
      return lib.tfidf(text)
    case 'classify':
      return lib.classifier(text)
    default:
      throw new Error("Unknown URL.")
  }
}

function NER_Take1And4(array = []) {
  return array.map(([text, , , entity]) => ([text, entity]))
}
function Chunking_Take1And3(array = []) {
  return array.map(([text, , entity]) => ([text, entity]))
}

module.exports = router;
