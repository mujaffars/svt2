var admobid = {}
if (/(android)/i.test(navigator.userAgent)) {  // for android & amazon-fireos
    admobid = {
        banner: 'ca-app-pub-3868593263837372/8649306643',
        interstitial: 'ca-app-pub-3868593263837372/4224486649',
    }
}

document.addEventListener('deviceready', function () {

    AdMob.setOptions({
        publisherId: admobid.banner,
        interstitialAdId: admobid.interstitial,
        bannerAtTop: false, // set to true, to put banner at top
        overlap: true, // set to true, to allow banner overlap webview
        offsetTopBar: false, // set to true to avoid ios7 status bar overlap
        isTesting: false, // receiving test ad
        autoShow: false  // auto show interstitial ad when loaded
    });

    AdMob.createBannerView({
        isTesting: false,
        autoShow: true,
    });

    AdMob.prepareInterstitial({
        interstitialAdId: admobid.interstitial,
        autoShow: false,
    })

    document.getElementById('showAd').disabled = true;

    document.getElementById('showAd').onclick = function () {
        AdMob.showInterstitial()
    }

}, false)

document.addEventListener('onFailedToReceiveAd', function (event) {
    console.log(event)
})

document.addEventListener('onReceiveInterstitialAd', function (event) {
    console.log(event)
    document.getElementById('showAd').disabled = false
})

document.addEventListener('onDismissInterstitialAd', function (event) {
    console.log(event)

    AdMob.prepareInterstitial({
        interstitialAdId: admobid.interstitial,
        autoShow: false,
    })
})

function showAd() {
    var random = Math.floor(Math.random() * 4) + 1;
    if (random === 1) {
        if (typeof AdMob !== "undefined") {
            if (AdMob) {
                AdMob.prepareInterstitial({adId: admobid.interstitialVideo, autoShow: true});
            }
        }
    }
}