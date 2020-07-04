var vntk = require('vntk')
var stopwords = require('./stopwords');

const lib = {
  refineStopwords(text, isUseUnderscore) {
    const wordTokenizer = vntk.wordTokenizer();
    const tokenized = wordTokenizer.tag(text, isUseUnderscore)

    // const lstStopword = tokenized.filter(val => stopwords.includes(val))
    const santinizedStopword = tokenized.filter(val => !stopwords.includes(val))

    // console.log('List filtered stopwords of input text');
    // console.log('List words after santinized stopwords');

    return isUseUnderscore ? replaceUnderscore(santinizedStopword) : santinizedStopword;
  },
  tokenizer(text) {
    var tokenizer = vntk.tokenizer();
    // console.log('List words after tokenizer');

    return tokenizer.tokenize(text)
  },
  wordSegmentation(text, isUseUnderscore) {
    const wordTokenizer = vntk.wordTokenizer();
    // console.log('List words after word segmentation');

    return isUseUnderscore
      ? replaceUnderscore(wordTokenizer.tag(text))
      : wordTokenizer.tag(text)
  },
  posTagging(text, isUseUnderscore) {
    const pos_tag = vntk.posTag();
    // console.log('List words after POS tagging');

    return isUseUnderscore
      ? replaceUnderscoreTuple(pos_tag.tag(text))
      : pos_tag.tag(text)
  },
  chunking(text, isUseUnderscore) {
    var chunking = vntk.chunking();
    // console.log('List words after chunking');

    return isUseUnderscore
      ? replaceUnderscoreTuple(chunking.tag(text))
      : chunking.tag(text)
  },
  ner(text, isUseUnderscore) {
    var ner = vntk.ner();
    // console.log('List words after named entity recognition');

    return isUseUnderscore
      ? replaceUnderscoreTuple(ner.tag(text))
      : ner.tag(text)
  },
  utility(words, isUseUnderscore) {
    // console.log('List words after utility');
    var dictionary = vntk.dictionary();

    return dictionary.lookup(text);
  },
  tfidf(words) {
    var tfidf = new vntk.TfIdf();

    tfidf.addDocument('Tôi là HUSC BOT');
    tfidf.addDocument('Thời gian đăng ký trễ hạn là bao lâu?');
    tfidf.addDocument('Trường đại học Khoa Học Huế nằm ở đâu?');

    tfidf.tfidfs(words, function (i, measure) {
      console.log('document #' + i + ' is ' + measure);
    });
  },
  classifier(text) {
    try {
      var classifier = new vntk.BayesClassifier();

      const intents = [
        require('./intents/chao_hoi'),
        require('./intents/ket_thuc'),
        require('./intents/dang_ky_tin_chi'),
        require('./intents/huy_tin_chi'),
        require('./intents/ket_qua_hoc_tap'),
        require('./intents/ket_qua_ren_luyen'),
        require('./intents/hoc_bong'),
        require('./intents/lich_hoc'),
        require('./intents/tai_khoan_sinh_vien'),
        require('./intents/ngoai_le'),
      ]

      intents.forEach(intent => {
        intent.patterns.forEach(pattern => {
          classifier.addDocument(pattern, intent.intent);

          /**
          //  * Thêm vào document mẫu câu có sẵn dưới dạng in thường
           * Chuyển đổi câu đầu vào sang dạng in thường
           * Example:
           *    'Xin chào' -> 'xin chào'
           * 
           * NOTE: không dùng hàm toLowerCase() cho trường hợp dữ liệu chứa danh từ riêng
           * Example:
           *    'đại học Khoa Học' != 'đại học khoa học'
           */
          classifier.addDocument(pattern.toLowerCase(), intent.intent);
        })
      });

      classifier.train();

      return classifier.classify(text)
    } catch (error) {
      console.log(error);
    }
  },
  santinizeHtml(text) {
    var util = vntk.util();
    return util.clean_html(text)
  }
}

function replaceUnderscore(lst) {
  return lst.map(val => {
    return val.replace(' ', '_')
  })
}
function replaceUnderscoreTuple(lst) {
  return lst.map(([first, ...rest]) => {
    return [first.replace(' ', '_'), ...rest]
  })
}

module.exports = lib
