/*!
 * Lunr languages, `Kazakh` language
 * https://github.com/MihaiValentin/lunr-languages
 *
 * Copyright 2014, Mihai Valentin
 * http://www.mozilla.org/MPL/
 */
/*!
 * based on
 * Snowball JavaScript Library v0.3
 * http://code.google.com/p/urim/
 * http://snowball.tartarus.org/
 *
 * Copyright 2010, Oleg Mazko
 * http://www.mozilla.org/MPL/
 */

/**
 * export the module via AMD, CommonJS or as a browser global
 * Export code from https://github.com/umdjs/umd/blob/master/returnExports.js
 */
;
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory)
  } else if (typeof exports === 'object') {
    /**
     * Node. Does not work with strict CommonJS, but
     * only CommonJS-like environments that support module.exports,
     * like Node.
     */
    module.exports = factory()
  } else {
    // Browser globals (root is window)
    factory()(root.lunr);
  }
}(this, function() {
  /**
   * Just return a value to define the module export.
   * This example returns an object, but the module
   * can return a function as the exported value.
   */
  return function(lunr) {
    /* throw error if lunr is not yet included */
    if ('undefined' === typeof lunr) {
      throw new Error('Lunr is not present. Please include / require Lunr before this script.');
    }

    /* throw error if lunr stemmer support is not yet included */
    if ('undefined' === typeof lunr.stemmerSupport) {
      throw new Error('Lunr stemmer support is not present. Please include / require Lunr stemmer support before this script.');
    }

    /* register specific locale function */
    lunr.kk = function() {
      this.pipeline.reset();
      this.pipeline.add(
        lunr.kk.trimmer,
        lunr.kk.stopWordFilter,
        lunr.kk.stemmer
      );

      // for lunr version 2
      // this is necessary so that every searched word is also stemmed before
      // in lunr <= 1 this is not needed, as it is done using the normal pipeline
      if (this.searchPipeline) {
        this.searchPipeline.reset();
        this.searchPipeline.add(lunr.kk.stemmer)
      }
    };

    /* lunr trimmer function */
    lunr.kk.wordCharacters = "\u0400-\u0484\u0487-\u052F\u1D2B\u1D78\u2DE0-\u2DFF\uA640-\uA69F\uFE2E\uFE2F";
    lunr.kk.trimmer = lunr.trimmerSupport.generateTrimmer(lunr.kk.wordCharacters);

    lunr.Pipeline.registerFunction(lunr.kk.trimmer, 'trimmer-kk');

    /* lunr stemmer function */
    lunr.kk.stemmer = (function() {
      /* create the wrapped stemmer object */
      var Among = lunr.stemmerSupport.Among,
        SnowballProgram = lunr.stemmerSupport.SnowballProgram,
        st = new function(word) {
          // Барлығын кіші әріпке ауыстыру
          word = word.toLowerCase();

          // Жұрнақтарды алып тастаймыз (соңынан бастап)
          const suffixes = [
            'дың', 'дің', 'тың', 'тің', 'тың', 'тың', 'дың', 'дің',
            'лар', 'лер', 'дар', 'дер', 'тар', 'тер',
            'нан', 'нен', 'дан', 'ден', 'тан', 'тен',
            'мен', 'пен', 'бен',
            'сыз', 'сіз',
            'дық', 'дік', 'тық', 'тік',
            'ған', 'ген', 'қан', 'кен',
            'ушы', 'уші', 'ушының',
            'ғаның', 'гесін', 'лардан',
            'тын', 'тін', 'пын', 'пін',
            'ым', 'ім', 'м', 'сың', 'сің', 'быз', 'біз', 'сыз', 'сіз',
            'мын', 'мін', 'бын', 'бін',
            'ты', 'ті', 'ды', 'ді', 'ны', 'ні',
            'йық', 'йік', 'йықпыз', 'йікпіз'
          ];


          for (var i = 0; i < suffixes.length; i++) {
            var suffix = suffixes[i];
            if (word.endsWith(suffix) && word.length > suffix.length + 2) {
              return word.slice(0, word.length - suffix.length);
            }
          }

          return word;
        };;

      /* and return a function that stems a word for the current locale */
      return function(token) {
        // for lunr version 2
        if (typeof token.update === "function") {
          return token.update(function(word) {
            st.setCurrent(word);
            st.stem();
            return st.getCurrent();
          })
        } else { // for lunr version <= 1
          st.setCurrent(token);
          st.stem();
          return st.getCurrent();
        }
      }
    })();

    lunr.Pipeline.registerFunction(lunr.kk.stemmer, 'stemmer-kk');

    lunr.kk.stopWordFilter = lunr.generateStopWordFilter('болуы бұл мүмкін сөздер тілінде қазақ қайталап'.split(' '));

    lunr.Pipeline.registerFunction(lunr.kk.stopWordFilter, 'stopWordFilter-kk');
  };
}))