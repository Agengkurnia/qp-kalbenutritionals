"use strict";
const clsGlobal = new clsGlobalClass();

const Schedulling = (type = "") => {
    console.log('schedulling' + type);

    $.ajax({
        type: "POST",
        url: base_path + "/Systems/Job/scheduller",
        data: {
            __RequestVerificationToken: $('#formJob input[name=__RequestVerificationToken]').val(),
            id: type
        },
        datatype: "json",
        success: function (retDat, status, xhr) {
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    clsGlobal.swalSuccess(retDat.objData);
                } else {
                    clsGlobal.swalError(retDat.txtErrorMessage);
                }
                $("#txtGUID").val(retDat.txtGUID);
            }
        },
        error: function (xhr, status, error) {
            clsGlobal.swalError(xhr.responseText);
        }
    });
}

document.querySelectorAll('[data-type="trigermanual"]').forEach(ev => {
    ev.addEventListener('click', (e) => {
        e.preventDefault();

        let type = ev.getAttribute('data-source');

        Schedulling(type);
    });
});