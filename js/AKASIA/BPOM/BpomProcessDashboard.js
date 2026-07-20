//let currentViewMode = 'general';
//=======================
// DASHBOARD FUNCTIONS
//=======================
function f_LoadDashboardStats(viewMode) {
    debugger;
    viewMode = viewMode || 'general';
    console.log(window.currentViewMode);
    $.ajax({
        type: "POST",
        url: base_path + "/BPOMProcess/GetOutStandingReqBpom",
        data: {
            __RequestVerificationToken: $('input[name=__RequestVerificationToken]').val(),
            viewMode: viewMode
        },
        datatype: "json",
        beforeSend: function () {
            // Show skeleton loading
        },
        success: function (retDat, status, xhr) {
            if (xhr.responseText.includes("!DOCTYPE html")) {
                clsGlobal.swalWarningRedirect("Session anda Habis, silahkan Login", window.location.href);
            }
            else {
                if (retDat.bitSuccess == true) {
                    try {
                        const stats = JSON.parse(retDat.objData);
                        f_PopulateCards(stats);
                    } catch (e) {
                        console.error("Error parsing stats:", e);
                    }
                }
                else {
                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                        clsGlobal.swalWarning(retDat.objData);
                    }
                    else {
                        clsGlobal.swalError(retDat.txtMessage);
                    }
                }
            }
        },
        error: function (xhr, status, error) {
            console.error("GetOutStandingReqBpom error:", error);
        }
    });
}
window.currentViewMode = 'general';
function f_PopulateCards(stats) {
    // Total Card
    $("#cardBodyTotal").html(`
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <p class="text-dark mb-1 small fw-semibold">Total</p>
                <h4 class="mb-0 fw-bold">${stats.TotalDocs || 0}</h4>
            </div>
            <div class="avatar flex-shrink-0">
                <span class="avatar-initial rounded bg-label-primary">
                    <i class="ti ti-file-text ti-md"></i>
                </span>
            </div>
        </div>
    `);

    // Draft Card
    $("#cardBodyReq").html(`
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <p class="text-dark mb-1 small fw-semibold">Draft</p>
                <h4 class="mb-0 fw-bold">${stats.TotalRequested || 0}</h4>
            </div>
            <div class="avatar flex-shrink-0">
                <span class="avatar-initial rounded bg-label-secondary">
                    <i class="ti ti-edit ti-md"></i>
                </span>
            </div>
        </div>
    `);

    // On-Process Card
    $("#cardBodyProg").html(`
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <p class="text-dark mb-1 small fw-semibold">Inprocess</p>
                <h4 class="mb-0 fw-bold">${stats.TotalInProgress || 0}</h4>
            </div>
            <div class="avatar flex-shrink-0">
                <span class="avatar-initial rounded bg-label-info">
                    <i class="ti ti-clock ti-md"></i>
                </span>
            </div>
        </div>
    `);

   
    // Approved Card
    $("#cardBodyAppr").html(`
 
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <p class="text-dark mb-1 small fw-semibold">Approved</p>
                <h4 class="mb-0 fw-bold">${stats.TotalAppr || 0}</h4>
            </div>
            <div class="avatar flex-shrink-0">
                <span class="avatar-initial rounded bg-label-success">
                    <i class="ti ti-check ti-md"></i>
                </span>
            </div>
        </div>
    `);
}

//function f_FilterByCard(statusFilter) {
//    // Remove selected class from all cards
//    $("#dashboardCards .card").removeClass("card-selected");

//    // Add selected class to clicked card
//    $(`[data-status-filter="${statusFilter}"]`).find('.card').addClass("card-selected");

//    // Map status filter to search value
//    let searchValue = '';
//    if (statusFilter === 'BPOM_Draft') {
//        searchValue = 'BPOM-Draft';
//    } else if (statusFilter === 'BPOM_Inprocess') {
//        searchValue = 'BPOM-Inprocess';
//    } else if (statusFilter === 'BPOM_Approved') {
//        searchValue = 'BPOM-Approved';
//    }

//    // Set the search value in status search input
//    $("#StatusSearch").val(searchValue);

//    // Trigger datatable reload
//    BPOMProcessHeader.Init();
//}
function f_FilterByCard(statusFilter) {

    $("#dashboardCards .card").removeClass("card-selected");
    $(`[data-status-filter="${statusFilter}"]`).find('.card').addClass("card-selected");

    let searchValue = '';
    if (statusFilter === 'BPOM_Draft') {
        searchValue = 'BPOM-Draft';
    } else if (statusFilter === 'BPOM_Inprocess') {
        searchValue = 'BPOM-Inprocess';
    } else if (statusFilter === 'BPOM_Approved') {
        searchValue = 'BPOM-Approved';
    }

    $("#StatusSearch").val(searchValue);

    if (typeof oTable !== 'undefined' && oTable) {
        oTable.draw();
    }

    // refresh card stats sesuai view
    f_LoadDashboardStats(currentViewMode);
}
