(function () {
    changeCss('body', 'font-size:' + fontSize + 'px;');
    changeCss('#modalShellBody .btn', 'font-size:' + btnFontSize + 'px;');
    changeCss('.modal-content .close', 'font-size:' + btnFontSize + 'px;');
    changeCss('.modal-content .modal-title', 'font-size:' + eval(eval(btnFontSize / 2) + (btnFontSize / 4)) + 'px;');
    changeCss('.btn', 'font-size:' + fontSize + 'px;');
    changeCss('.navbar-brand', 'font-size:' + eval(fontSize / 1.5) + 'px;');
    changeCss('#divCallRecords', 'font-size:' + recordFontSize + 'px;');
    changeCss('label.error', 'font-size:' + eval(fontSize / 1.5) + 'px;');
    changeCss('.imgLoader', 'height:' + eval(fontSize / 2) + 'px;');
    changeCss('#GridView1, #btnRefresh', 'font-size:' + eval(fontSize / 2.2) + 'px;');
    changeCss('.fa-check, .fa-check-circle, .fa-spinner, .fa-head', 'font-size:' + eval(30 * screenWidth / 360) + 'px;');

    var logedIn = localStorage.getItem("logedIn");
    
    if (logedIn === 'true' && localStorage.getItem("userId") !== null && 
            localStorage.getItem("userId") !== '' && localStorage.getItem("userId") !== undefined) {
        $('#divLoading').removeClass('hide');
        $('.tblLogin, .tblVerify').addClass('hide');
        $('.lnkLogOut, .fa-refresh').removeClass('hide');

        getRecords();
    }

    $('.lnkLogOut').click(function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            (navigator.app && navigator.app.exitApp()) || (device && device.exitApp());
        } else {
            localStorage.setItem("logedIn", "false");
            $('#divCallRecords').hide();
            $('.tblLogin').show();
            $('.lnkLogOut').addClass('hide');
            window.location.reload();
        }
    })
    $('.fa-refresh').click(function () {
        $('#divLoading').removeClass('hide');
        getRecords();
    })
})();

function initLocationLoop() {
    console.log('inside init app');
    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    var onSuccess = function (position) {
        var latLongDtls = 'Latitude: ' + position.coords.latitude + '\n' +
                'Longitude: ' + position.coords.longitude + '\n' +
                'Altitude: ' + position.coords.altitude + '\n' +
                'Accuracy: ' + position.coords.accuracy + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                'Heading: ' + position.coords.heading + '\n' +
                'Speed: ' + position.coords.speed + '\n' +
                'Timestamp: ' + position.timestamp + '\n';
//        alert(position.coords.latitude+" "+position.coords.longitude);
        localStorage.setItem("Latitude", position.coords.latitude);
        localStorage.setItem("Longitude", position.coords.longitude);
    };

    // onError Callback receives a PositionError object
    function onError(error) {
//        alert('code: ' + error.code + '\n' +
//                'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);

//    setTimeout(function () {
//        initLocationLoop();
//    }, 100000);
    //alert('Inside location loop');
}

$(function () {

    $("#btnSendCode").click(function () {

        $("#loginForm").validate({
            rules: {
                phoneNumber: {
                    required: true,
                    phoneIN: true,
                    minlength: 10,
                    maxlength: 10
                }
            },
            messages: {
                phoneNumber: {
                    required: "Mobile no required",
                    phoneIN: "Enter valid 10 digit mobile no",
                    minlength: "Enter valid 10 digit mobile no",
                    maxlength: "Enter valid 10 digit mobile no"
                }
            }
        });

        if ($("#loginForm").valid()) {
            generateOTP();
        }

    })

    $("#btnCheckPin").click(function () {
        checkOTP();

//        $("#tblVerify").validate({
//            rules: {
//                txtPin: {
//                    required: true
//                }
//            },
//            messages: {
//                txtPin: {
//                    required: "PIN required"
//                }
//            }
//        });
//
//        if ($("#tblVerify").valid()) {
//            checkOTP();
//        }

    })

});

function generateOTP() {
    $('#divLoading').removeClass('hide');
    var fdata = {
        data: $("#phoneNumber").val(),
        status: 0
    };
    $.ajax({
        url: serverHost,
        type: 'GET',
        dataType: 'html',
        data: fdata,
        async: true,
        error: function () {
        },
        success: function (resp) {
            $('#divUserId').html(resp);
            var checkHtml = $.trim($('#divUserId').find("div").eq(2).html());
            var splitHtml = checkHtml.split("<br>");
            console.log(splitHtml);
            var userId = parseInt(splitHtml[0]);
            if ($.isNumeric(userId)) {
                localStorage.setItem("userId", userId);
            }
            $(".enteredMNo").text($("#phoneNumber").val());
            $(".tblLogin").addClass('hide');
            $(".tblVerify").removeClass('hide');
            $('#divLoading').addClass('hide');
        }
    });
}

function checkOTP() {
    $('#divLoading').removeClass('hide');
    var fdata = {
        data: $("#phoneNumber").val(),
        status: 1,
        pin: $("#txtPin").val()
    };
    $.ajax({
        url: serverHost,
        type: 'GET',
        dataType: 'html',
        data: fdata,
        async: true,
        error: function () {
        },
        success: function (resp) {
            $('#divLoading').addClass('hide');
//            $( "li" ).eq( 2 )
            $('#divCheckPin').html(resp);
            var checkHtml = $.trim($('#divCheckPin').find("div").eq(2).html()).substr(0, 3);

            if (checkHtml === 'Yes') {
                localStorage.setItem("logedIn", "true");
                $('.lnkLogOut').removeClass('hide');
                $('.fa-refresh').removeClass('hide');
                localStorage.setItem("logedInMobile", fdata.data);
                localStorage.setItem("logedInPin", fdata.pin);
                getRecords();
            } else {
                alert('Invalid OTP please try again');
            }
        }
    });
}

function getRecords() {
    $('.tblBody').html('');
    var fdata = {
        call: 'P',
        id: localStorage.getItem("userId"),
        appVersion: appVersion
    };
    $.ajax({
        url: serverHost,
        type: 'GET',
        dataType: 'html',
        data: fdata,
        async: true,
        error: function () {
            $('#divLoading').addClass('hide');
            alert('Something went wrong! Please try again');
        },
        success: function (resp) {

            showAd();

            $('#divLoading').addClass('hide');
            $('#divCallRecords').html(resp);
            $('.tblVerify').addClass('hide');
            $('#divCallRecords').find('#GridView1').addClass('table table-bordered table-striped');

            $('#divCallRecords').find("#GridView1").find('tr').each(function () {
                $(this).find("th:nth-child(1)").hide();
                $(this).find("td:nth-child(1)").hide();
                if ($(this).find("td:nth-child(2)").text() !== 'Date') {
                    // $(this).find("td:nth-child(2)").append('<div class="fa fa-check"></div>').append('<div class="fa fa-spinner hide"></div>');

                    $(this).click(function () {
                        var theUpdatingTr = $(this);
                        var callId = parseInt($(this).find('td:nth-child(1)').text());
                        var modalSkeleton = genModalSkeleton();
                        $(modalSkeleton).modal("show");
                        setModalContent(modalSkeleton, 'markComplete', callId, theUpdatingTr);
                    })
                }
            });

        }
    });
}

function changeCss(className, classValue) {
    // we need invisible container to store additional css definitions
    var cssMainContainer = $('#css-modifier-container');
    if (cssMainContainer.length == 0) {
        var cssMainContainer = $('<div id="css-modifier-container"></div>');
        cssMainContainer.hide();
        cssMainContainer.appendTo($('head'));
    }

    // and we need one div for each class
    classContainer = cssMainContainer.find('div[data-class="' + className + '"]');
    if (classContainer.length == 0) {
        classContainer = $('<div data-class="' + className + '"></div>');
        classContainer.appendTo(cssMainContainer);
    }

    // append additional style
    classContainer.html('<style>' + className + ' {' + classValue + '}</style>');
}