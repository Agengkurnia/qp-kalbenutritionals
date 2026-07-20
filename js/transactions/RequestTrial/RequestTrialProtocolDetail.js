"use strict";
//=======================
// VARIABLE GLOBAL
//=======================


//=======================
// ON PAGE LOAD
//=======================

function onInitProtocol() {
    $('#dataTableProtocol').DataTable({
    });

    getProtocolDetail();
}

function getProtocolDetail() {
    if (requestProtocolDetail !== "") {
        let dataJSON = requestProtocolDetail.replace(/&quot;/g, '"');

        let parsedData = JSON.parse(dataJSON);

        parsedData.forEach(data => {
            protocolTrialDetail.push({
                protocolGuid: data.ProtocolGuid,
                protocolHeaderGuid: data.ProtocolHeaderGuid,
                protocolHeaderNo: data.ProtocolHeaderNo,
                protocolNo: data.ProtocolNo,
                summary: data.Summary,
                formulaDescription: data.FormulaDescription,
                formulaNo: data.FormulaNo,
                itemCode: data.ItemCode,
                included: data.Included,
                remarks: data.Remarks
            });
        });

        let jsonString = JSON.stringify(protocolTrialDetail);
        $('#requestProtocolDetail').val(jsonString);
        updateTableProtocol();
    }
}

function handleSwitchChange(protocolGuid, checkbox) {
    const index = protocolTrialDetail.findIndex(item => item.protocolGuid === protocolGuid); // Dapatkan index

    if (index !== -1) { // Pastikan item ditemukan
        const data = protocolTrialDetail[index];

        if (data.included && !checkbox.checked) {
            Swal.fire({
                title: 'Are you sure?',
                text: "Changing this will disable the protocol. Please provide remarks.",
                icon: 'warning',
                input: 'text',
                inputPlaceholder: 'Enter remarks here...',
                inputValidator: (value) => {
                    if (!value) {
                        return 'Remarks are required!';
                    }
                },
                showCancelButton: true,
                confirmButtonText: 'Yes, disable it!',
                cancelButtonText: 'No, keep it enabled',
            }).then((result) => {
                if (result.isConfirmed) {
                    const remarks = result.value;
                    protocolTrialDetail[index].included = checkbox.checked;
                    protocolTrialDetail[index].remarks = remarks;
                    updateIncludedProtocol(data.protocolHeaderGuid, data.protocolGuid, checkbox.checked, remarks);
                } else {
                    protocolTrialDetail[index].included = true;
                    checkbox.checked = true;
                }
            });
        } else {
            protocolTrialDetail[index].included = checkbox.checked;
            protocolTrialDetail[index].remarks = "";
            updateIncludedProtocol(data.protocolHeaderGuid, data.protocolGuid, checkbox.checked, "");
        }
    }
}



function updateIncludedProtocol(headerGuid, guid, included, remarks) {
    $.ajax({
        url: '/RequestTrial/UpdateIncludedProtocol',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            protocolHeaderGuid: headerGuid,
            protocolGuid: guid,
            included: included,
            remarks: remarks
        }),
        success: function (data) {
            updateTableProtocol();
        },
        error: function (xhr, status, error) {
            showMessageError(error);
        }
    });
}

function updateTableProtocol() {
    debugger;
    var dataTable = $('#dataTableProtocol').DataTable();
    dataTable.clear();

    var status = $('#StatusEvaluationTrial').val();
    var isActive = status === "" || status === "DRAFT" || status === "PROTOCOL REVISED" || status === "EVALUATION REVISED";

    dataTable.rows.add(protocolTrialDetail.map((data, index) => {
        var protBtn = `
            <a href="#" onclick="redirectButton('${data.protocolGuid}'); return false;">${data.protocolNo}</a>
        `;
        var actionButtons = `
            <label class="switch">
                <input type="checkbox" 
                       ${data.included ? "checked" : ""}
                       ${isActive ? "" : "disabled"}
                       onchange="handleSwitchChange('${data.protocolGuid}', this)">
                <span class="slider round"></span>
            </label>`;
        return [
            protBtn,
            data.itemCode,
            data.formulaNo ?? "",
            data.formulaDescription,
            data.remarks ?? "",
            actionButtons,
        ];
    }));

    dataTable.draw();
}

function redirectButton(param) {
    window.location.href = base_path + `/RequestTrial/Protocol?param=${encodeURIComponent(param)}`;
}
