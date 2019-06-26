var serverHost = 'http://www.shivinfotech.co.in/getdata.aspx';
var recordUpdateHost = 'http://www.shivinfotech.co.in/getdata.aspx';
var recordForwardHost = 'http://www.shivinfotech.co.in/getcallforward.aspx';

//var serverHost = 'http://localhost:56927/wwwroot/getdata.aspx';
//http://vas.mobilogi.com/api.php?username=stipls&password=pass12345&route=1&sender=STIPLS&mobile[]=9503426967&message[]=TEST SMS';

//serverHost = 'https://hello-world-mujaffar.c9users.io/hello-world.php';

var screenHeight = parseInt($(window).height());
var screenWidth = parseInt($(window).width());
if (screenWidth > screenHeight) {
    screenWidth = screenHeight;
}
var fontSize = parseInt(eval(eval(screenWidth * 7) / 100));
var btnFontSize = parseInt(eval(eval(screenWidth * 6) / 100));
var recordFontSize = parseInt(eval(eval(screenWidth * 4) / 100));
var logedIn = false;

var appVersion = 1.1;


function genModalSkeleton() {
    var modalSkeleton = $("<div />", {
        "class": "modal fade bs-example-modal-sm noselect",
        tabindex: "-1",
        role: "dialog",
        'aria-labelledby': "mySmallModalLabel",
        keyboard: false,
        'data-backdrop': "true"
    });
    var modal = $("<div />", {
        "class": "modal-dialog modal-sm"
    });
    var modalHeader = $("<div />", {
        "class": "modal-header"
    });

    $(modalHeader).append('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>\n\
          <h4 class="modal-title" id="myModalLabel">Change call status</h4>');
    var modalContent = $("<div />", {
        "class": "modal-content"
    });
    var modalBody = $("<div />", {
        "id": "modalShellBody",
        "class": "modal-body"
    }).html('Loading...');
    modalContent.append(modalHeader);
    modalContent.append(modalBody);
    modal.append(modalContent);
    modalSkeleton.append(modal);

    return modalSkeleton;
}

function setModalContent(modalSkeleton, forwhat, callId, theUpdatingTr) {
    switch (forwhat) {
        case 'markComplete':
            $.ajax({
                url: 'markComplete.html',
                type: 'GET',
                dataType: 'html',
                async: true,
                error: function () {
                },
                success: function (resp) {
                    $(modalSkeleton).find('#modalShellBody').html('').append(resp);
                    $(modalSkeleton).find('#btnComplete').attr('callId', callId);
                    $(modalSkeleton).find('#myModalLabel').text($(theUpdatingTr).find("td:nth-child(3)").text());

                    $(modalSkeleton).find('#btnComplete').click(function () {


                        if ($(this).hasClass('btn-success')) {
                            var objBtn = $(this);
                            document.addEventListener("deviceready", completeTask(objBtn, theUpdatingTr), false);
                        }
                    })

                }
            });
            break;
        case 'forward':
            $.ajax({
                url: 'forward.html',
                type: 'GET',
                dataType: 'html',
                async: true,
                error: function () {
                },
                success: function (resp) {
                    $(modalSkeleton).find('#modalShellBody').html('').append(resp);
                    $(modalSkeleton).find('#btnForward').attr('callId', callId);
                    $(modalSkeleton).find('#myModalLabel').text($(theUpdatingTr).find("td:nth-child(3)").text());

                    $(modalSkeleton).find('#btnForward').click(function () {
                        var forwardText = $(modalSkeleton).find('#forwardText').val();
                        var objBtn = $(this);
                        forwardTask(objBtn, theUpdatingTr, forwardText);
                    })

                }
            });
            break;
        default :

            break;
    }
}

function completeTask(objBtn, theUpdatingTr) {
    navigator.geolocation.getCurrentPosition(
            function (position) {
                $(objBtn).removeClass('btn btn-success');
                $(objBtn).text('saving ...');
                var fdata = {
                    userId: localStorage.getItem("userId"),
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    call_no: $(objBtn).attr('callId'),
                    status: 'C'
                };
                $.ajax({
                    url: recordUpdateHost,
                    type: 'GET',
                    dataType: 'html',
                    data: fdata,
                    async: true,
                    error: function () {
                        alert('Record not saved, Try again');
                    },
                    success: function (resp) {
                        if (resp !== 'success') {
                            $('.bs-example-modal-sm').modal('hide');
                            $(theUpdatingTr).remove();
                        } else {
                            $(objBtn).text('Complete');
                            $(objBtn).addClass('btn btn-success');
                            alert('Record not saved, Try again');
                        }
                    }
                });
            },
            function (error) {
                alert('Enable to get location, Allow access from location settings');
                $(objBtn).text('Complete');
                $(objBtn).addClass('btn btn-success');
            }, {
        enableHighAccuracy: true
        , timeout: 5000
    }
    );
}

function forwardTask(objBtn, theUpdatingTr, forwardText) {
    //?flag=F&&emp_id=1068&&call_no=12514&&call_date=2017-09-14&&reason=TimePass

    var fdata = {
        flag: 'F',
        emp_id: '',
        call_no: $(objBtn).attr('callId'),
        call_date: '',
        reason: forwardText
    }
    $.ajax({
        url: recordForwardHost,
        type: 'GET',
        dataType: 'html',
        data: fdata,
        async: true,
        error: function () {
            alert('Record not saved, Try again');
        },
        success: function (resp) {
            if (resp !== 'success') {
                $('.bs-example-modal-sm').modal('hide');
                $(theUpdatingTr).remove();
            } else {
                $(objBtn).text('Complete');
                $(objBtn).addClass('btn btn-success');
                alert('Record not saved, Try again');
            }
        }
    });
}