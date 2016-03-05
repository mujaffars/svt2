
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
                var newTr = '<tr id="tr' + val.id + '">';
                var inpSelected = '', comSelected = '';
                if(val.CallStatus === 'in-progress'){
                    inpSelected = 'selected';
                }
                if(val.CallStatus === 'complete'){
                    comSelected = 'selected';
                }
                newTr += '<td class="recordId">' + val.id + '</td><td>' + val.FirstName + " " + val.LastName + '</td><td>' + val.Address + '</td>' +
                        '<td><input type="text" class="clsDate" value="' + val.call_date + '"/></td>' +
                        '<td>' +
                        '<select class="callStatus">' +
                        '<option value="in-progress" '+inpSelected+' label="In-progress">In-progress</option>' +
                        '<option value="complete" '+comSelected+' label="Complete">Complete</option>' +
                        '</select></td>' +
                        '<td><input type="button" name="save" id="btnSave" value="Save" class="btn btn-success"></td>';
                newTr += '</tr>';
                $('.tblBody').append(newTr);

                $("#tr" + val.id).find(".clsDate").datepicker({
                    defaultDate: "+1w",
                    changeMonth: true,
                    changeYear: true,
                    numberOfMonths: 1,
                    dateFormat: "yy-mm-dd"
                            //beforeShowDay:$.datepicker.noWeekends
                });

                $("#tr" + val.id).find("#btnSave").click(function () {
                    var fdata = {
                        id: $(this).parent().parent().find('.recordId').text(),
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