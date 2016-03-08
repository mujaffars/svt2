
$(function () {

    getRecords();

});

function getRecords() {
    $('.tblBody').html('');
    $.ajax({
        url: 'https://hello-world-mujaffar.c9users.io/hello-world.php',
        type: 'GET',
        dataType: 'json',
        async: true,
        error: function () {
        },
        success: function (resp) {

            $.each(resp, function (index, val) {
                var newTr = '<tr id="tr' + val.Call_No + '">';
                var inpSelected = '', comSelected = '';
                
                if(val.cbd_status === 'p'){
                    inpSelected = 'selected';
                }
                if(val.cbd_status === 'c'){
                    comSelected = 'selected';
                }
                newTr += '<td class="recordId">' + val.Call_No + '</td>'+
                        '<td><input type="text" class="clsDate" value="' + val.Call_Date + '"/></td>' +
                        '<td>' + val.Ac_Party_Mobile_No + '</td>' +
                        '<td>' + val.Ac_Name + '</td>' +
                        '<td>' + val.Problem + '</td>' +
                        '<td>' + val.City + '</td>' +                        
                        '<td>' +
                        '<select class="callStatus">' +
                        '<option value="p" '+inpSelected+' label="In-progress">In-progress</option>' +
                        '<option value="c" '+comSelected+' label="Complete">Complete</option>' +
                        '</select></td>' +
                        '<td><input type="button" name="save" id="btnSave" value="Save" class="btn btn-success"></td>';
                newTr += '</tr>';
                $('.tblBody').append(newTr);

                $("#tr" + val.Call_No).find(".clsDate").datepicker({
                    defaultDate: "+1w",
                    changeMonth: true,
                    changeYear: true,
                    numberOfMonths: 1,
                    dateFormat: "yy-mm-dd"
                });

                $("#tr" + val.Call_No).find("#btnSave").click(function () {
                    var fdata = {
                        Call_No: $(this).parent().parent().find('.recordId').text(),
                        date: $(this).parent().parent().find('.clsDate').val(),
                        status: $(this).parent().parent().find('.callStatus').val(),
                        mode: 'update'
                    };
                    $.ajax({
                        url: 'https://hello-world-mujaffar.c9users.io/hello-world.php',
                        type: 'POST',
                        dataType: 'json',
                        data: fdata,
                        async: true,
                        error: function () {
                        },
                        success: function (resp) {
                            if(resp.status == 'success'){
                                alert('Record saved :)');
                            }
                        }
                    });
                });

            });

        }
    });
}