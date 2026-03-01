/* Fuji Drama Template ver1.0 */

/* ========================================================
 news-list
 ======================================================== */
$(function () {
  var newsList = $('#js-newsList');
  var newsLimit = 3;
  var newsCloseText = 'とじる';
  var newsOpenText = 'もっとみる';
  var newsItem = newsList.children('li');
  var newsLength = newsItem.length;
  var newsMore = $('#js-newsMore');

  console.log(newsLength);
  if (newsLimit < newsLength) {
    newsLimiter();
  } else {
    newsMore.hide();
  }

  // newsLimitの数だけ表示
  function newsLimiter() {
    newsItem.hide();
    for (var i = 0; i < newsLimit; i++) {
      newsItem.eq(i).show();
    }
  }

  // ボタン押下時の処理
  newsMore.click(function () {
    if (!$(this).hasClass('js-newsOpen')) {
      newsItem.each(function () {
        newsItem.fadeIn();
      });
      $(this).addClass('js-newsOpen');
      $(this).text(newsCloseText);
    } else {
      $(this).removeClass('js-newsOpen');
      $(this).text(newsOpenText);
      newsLimiter();
    }
  });
})

/* ========================================================
 Photo Gallery
 ======================================================== */
var _galleryDataMax = $("#js-gallery").data("max"),
  _galleryDataType = $("#js-gallery").data("type"),
  _galleryDataDir = $("#js-gallery").data("dir");
if (_galleryDataMax > 0) {

  // ギャラリーDIVにデータ数の記述があった場合にulタグを追加
  var htmlStr = '<ul class="gallery__list clearfix"></ul>';
  $("#js-gallery").append(htmlStr);

  // 画像格納場所URLを作成
  var baseUrl = './' + _galleryDataDir + '/';

  // データ数の回数だけ画像の存在チェックを実施
  for (var i = 1; i <= _galleryDataMax; i++) {
    imagecheck(baseUrl, i);
  }
} else {

  // ギャラリーDIVにデータ数の記述がなかった場合に要素を削除
  $("div.gallery").remove();
}

/**
 * 画像の存在チェック
 *
 * @param {string} url 画像の格納場所
 * @param {number} num 何番目の画像か
 */
function imagecheck(url, num) {

  // 画像のパスを作成
  var overlayImageUrl = url + num + '.' + _galleryDataType;

  // 存在確認するためにImageを作成
  var newImage = new Image();
  newImage.src = overlayImageUrl;

  // 画像があった時の処理
  newImage.onload = function () {

    // サムネイル用画像のパスを作成
    var thumbnailImageUrl = url + num + '_th.' + _galleryDataType;

    // オーバーレイ表示用のサイズ計算（仮で画面サイズの８０％にしてあります）
    var overlayWidth = window.innerWidth * 0.8;
    var overlayHeight = newImage.height * overlayWidth / newImage.width;

    // オーバーレイで使用するHTMLを作成
    var imgHtml = encodeURIComponent('<img style="width:100%;height:auto;" src="' + overlayImageUrl + '" class="cx_imgProtect">');

    // ulタグに追加するli要素の作成
    var liHtml = '<li data-num="' + num + '">';
    liHtml += '<a class="popup" rel="group" href="javascript:fujitv.overlay(\'' + imgHtml + '\', \'' + overlayWidth + '\', \'' + overlayHeight + '\')">';
    liHtml += '<img src="' + thumbnailImageUrl + '" class="cx_imgProtect"></a></li>';

    // ulタグにliを追加
    $("ul.gallery__list").append(liHtml);

    // li要素の並び替え
    sortLi();
  };
}

/**
 * li要素の並び替え
 */
function sortLi() {

  // li要素の取得と並び替え
  var liItems = $('ul.gallery__list').children('li').clone();
  liItems.sort(function (a, b) {
    var vA = parseInt($(a).data("num"));
    var vB = parseInt($(b).data("num"))
    return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
  });

  // ul要素を初期化して並び替えたli要素を再挿入
  var ulItem = $('ul.gallery__list');
  ulItem.html("");
  liItems.each(function () {
    ulItem.append(this.outerHTML);
  });
}

/* ========================================================
 twitter include
 ======================================================== */
$(function () {
  // twitter枠があるか判定
  if ($('#js-twitter-include').length) {
    twitterID = $("#js-twitter-include").data("twitterid");
    if ($('body').hasClass('cx_smartphoneview')) {
      // SPの場合
      cx_getTwitter(twitterID, "js-twitter-include", { "firstView": 1, "more": false, "image": false, "endlink": ["続きはTwitterで", "https://twitter.com/" + twitterID], "fail": twitterAreaHide });
    } else {
      // PCの場合
      cx_getTwitter(twitterID, "js-twitter-include", { "firstView": 5, "more": true, "image": false, "moreView": 10, "fail": twitterAreaHide });
    }
    function twitterAreaHide() {
      $('#js-twitter-area').hide();
    }
  }
});

/* ========================================================
 SNS share button
 ======================================================== */
// エスケープ処理
$(function () {
  var str = '& < > ` " ' + "'";
  var escapeHtml = (function (String) {
    var escapeMap = {
      '&': '&amp;',
      "'": '&#x27;',
      '`': '&#x60;',
      '"': '&quot;',
      '<': '&lt;',
      '>': '&gt;'
    };
    var escapeReg = '[';
    var reg;
    for (var p in escapeMap) {
      if (escapeMap.hasOwnProperty(p)) {
        escapeReg += p;
      }
    }
    escapeReg += ']';
    reg = new RegExp(escapeReg, 'g');
    return function escapeHtml(str) {
      str = (str === null || str === undefined) ? '' : '' + str;
      return str.replace(reg, function (match) {
        return escapeMap[match];
      });
    };
  }(String));

  url = escapeHtml(location.href);
  pageTitle = document.title;

  // twitter
  if ($('#js-tw-auto').length) {
    var hashtags = $("#js-tw-auto").data("hashtags");
    $('#js-tw-auto').html('<a href="https://twitter.com/share?text=' + pageTitle + '&amp;hashtags=' + hashtags + '&amp;url=' + url + '" onclick="window.open(encodeURI(decodeURI(this.href)), \'tweetwindow\',\'width=650, height=470, personalbar=0, toolbar=0, scrollbars=1, sizable=1\'); return false;" rel="nofollow">Twitter</a></li>');
  }
  // facebook
  if ($('#js-fb-auto').length) {
    $('#js-fb-auto').html('<a href="http://www.facebook.com/sharer.php?u=' + url + '&t=' + pageTitle + '" target="_blank">Facebook</a>');
  }

  // line
  if ($('#js-li-auto').length) {
    $('#js-li-auto').html('<a href="http://line.me/R/msg/text/?' + pageTitle + ' ' + url + '" target="_blank">LINE</a>');
  }
});