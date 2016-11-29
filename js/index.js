(function () {
    changeCss('body', 'font-size:' + fontSize + 'px;');
    changeCss('.btn', 'font-size:' + fontSize + 'px;');
    changeCss('.navbar-brand', 'font-size:' + eval(fontSize / 2) + 'px;');
    changeCss('#divCallRecords', 'font-size:' + recordFontSize + 'px;');
    changeCss('label.error', 'font-size:' + eval(fontSize / 1.5) + 'px;');
    changeCss('.imgLoader', 'height:' + eval(fontSize / 2) + 'px;');

    var logedIn = localStorage.getItem("logedIn");
    if (logedIn === 'true') {
        $('#divLoading').removeClass('hide');
        $('.tblLogin, .tblVerify').addClass('hide');
        $('.lnkLogOut').removeClass('hide');

        getRecords();
    }

    $('.lnkLogOut').click(function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            (navigator.app && navigator.app.exitApp()) || (device && device.exitApp());
        }
        else {
            localStorage.setItem("logedIn", "false");
            $('#divCallRecords').hide();
            $('.tblLogin').show();
            $('.lnkLogOut').addClass('hide');
            window.location.reload();
        }
    })

})();

function onLoad() {
    if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
        document.addEventListener('deviceready', initApp, false);
    } else {
        initApp();
    }
}

function initApp() {
    // onSuccess Callback
    // This method accepts a Position object, which contains the
    // current GPS coordinates
    //
    var onSuccess = function (position) {
        /*alert('Latitude: ' + position.coords.latitude + '\n' +
         'Longitude: ' + position.coords.longitude + '\n' +
         'Altitude: ' + position.coords.altitude + '\n' +
         'Accuracy: ' + position.coords.accuracy + '\n' +
         'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
         'Heading: ' + position.coords.heading + '\n' +
         'Speed: ' + position.coords.speed + '\n' +
         'Timestamp: ' + position.timestamp + '\n');*/

        var latLongDtls = 'Latitude: ' + position.coords.latitude + '\n' +
                'Longitude: ' + position.coords.longitude + '\n' +
                'Altitude: ' + position.coords.altitude + '\n' +
                'Accuracy: ' + position.coords.accuracy + '\n' +
                'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
                'Heading: ' + position.coords.heading + '\n' +
                'Speed: ' + position.coords.speed + '\n' +
                'Timestamp: ' + position.timestamp + '\n';

        $('#latlongText').html(latLongDtls);
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: ' + error.code + '\n' +
                'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
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
    $.ajax({
        url: serverHost + '?call=P',
        type: 'GET',
        dataType: 'html',
        async: true,
        error: function () {
        },
        success: function (resp) {
            $('#divLoading').addClass('hide');
            $('#divCallRecords').html(resp);
            $('.tblVerify').addClass('hide');
            $('#divCallRecords').find('#GridView1').addClass('table table-bordered table-striped');
//            $.each(resp, function (index, val) {
//                var newTr = '<tr id="tr' + val.Call_No + '">';
//                var inpSelected = '', comSelected = '';
//
//                if (val.cbd_status === 'p') {
//                    inpSelected = 'selected';
//                }
//                if (val.cbd_status === 'c') {
//                    comSelected = 'selected';
//                }
//                newTr += '<td class="recordId">' + val.Call_No + '</td>' +
//                        '<td><input type="text" class="clsDate" value="' + val.Call_Date + '"/></td>' +
//                        '<td>' + val.Ac_Party_Mobile_No + '</td>' +
//                        '<td>' + val.Ac_Name + '</td>' +
//                        '<td>' + val.Problem + '</td>' +
//                        '<td>' + val.City + '</td>' +
//                        '<td>' +
//                        '<select class="callStatus">' +
//                        '<option value="p" ' + inpSelected + ' label="In-progress">In-progress</option>' +
//                        '<option value="c" ' + comSelected + ' label="Complete">Complete</option>' +
//                        '</select></td>' +
//                        '<td><input type="button" name="save" id="btnSave" value="Save" class="btn btn-success"></td>';
//                newTr += '</tr>';
//                $('.tblBody').append(newTr);
//
//                $("#tr" + val.Call_No).find(".clsDate").datepicker({
//                    defaultDate: "+1w",
//                    changeMonth: true,
//                    changeYear: true,
//                    numberOfMonths: 1,
//                    dateFormat: "yy-mm-dd"
//                });
//
//                $("#tr" + val.Call_No).find("#btnSave").click(function () {
//                    var fdata = {
//                        Call_No: $(this).parent().parent().find('.recordId').text(),
//                        date: $(this).parent().parent().find('.clsDate').val(),
//                        status: $(this).parent().parent().find('.callStatus').val(),
//                        mode: 'update'
//                    };
//                    $.ajax({
//                        url: 'https://hello-world-mujaffar.c9users.io/hello-world.php',
//                        type: 'POST',
//                        dataType: 'json',
//                        data: fdata,
//                        async: true,
//                        error: function () {
//                        },
//                        success: function (resp) {
//                            if (resp.status == 'success') {
//                                alert('Record saved :)');
//                            }
//                        }
//                    });
//                });
//
//            });

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