$(document).ready(function () {
    $('.select2').each(function () {
        $(this).select2({ dropdownParent: $(this).parent() });
    })

    initProductCategoryDropdown();  
    initDataTable();                
    bindEventHandlers();            
});

function initProductCategoryDropdown(callback) {
    $.ajax({
        url: "/Master/SubBrand/GetProductCategories",
        type: "GET",
        success: function (response) {
            let dropdown = $("#ddlProductCategory");
            dropdown.empty().append('<option value="">Select Category</option>');

            if (response.success && response.data.length > 0) {
                response.data.forEach(item => {
                    dropdown.append(`<option value="${item.id}">${item.text}</option>`);
                });
            }

            if (typeof callback === "function") {
                callback(); 
            }
        },
        error: function () {
            console.error("Failed to load Product Category.");
        }
    });
}

function initDataTable() {
    $('#subBrandTable').DataTable({
        processing: true,
        serverSide: false,
        ajax: {
            url: "/Master/SubBrand/GetSubBrandList",
            type: "GET",
            datatype: "json"
        },
        columns: [
            { data: "txtSubBrandCode", title: "SUB BRAND CODE" },
            { data: "txtSubBrandName", title: "SUB BRAND NAME" },
            { data: "txtSubBrandDesc", title: "BRAND NAME" },
            { data: "txtProductCategory", title: "PRODUCT CATEGORY" },
            {
                data: "bitActive",
                title: "ACTIVE",
                render: function (data) {
                    return data ? '<span class="badge bg-success">Active</span>' :
                        '<span class="badge bg-danger">Inactive</span>';
                }
            },
            {
                data: "intSubBrandId",
                title: "ACTION",
                render: function (data) {
                    return `<button class="btn btn-warning btn-sm btn-edit" data-id="${data}">Edit</button>`;
                }
            }
        ],
        language: { emptyTable: "No data available in table" }
    });
}

function bindEventHandlers() {
    $("#btnCreate").click(showCreateModal);
    $("#subBrandTable").on("click", ".btn-edit", showEditModal);
    $("#btnSave").click(saveOrUpdateSubBrand);
}

function showCreateModal() {
    resetForm();
    $("#subBrandModal .modal-title").text("Create Sub Brand");
    $("#btnSave").text("Save");
    $("#subBrandModal").modal("show");
}

function showEditModal() {
    resetForm();
    let id = $(this).data("id");

    $.ajax({
        url: `/Master/SubBrand/GetSubBrandById/${id}`,
        type: "GET",
        success: function (response) {
            if (response.success && response.data) {
                let data = response.data;

                initProductCategoryDropdown(() => {
                    populateForm(data);
                    $("#subBrandModal .modal-title").text("Edit Sub Brand");
                    $("#btnSave").text("Update");
                    $("#subBrandModal").modal("show");
                });
            } else {
                Swal.fire("Error", "Sub Brand not found.", "error");
            }
        },
        error: function () {
            Swal.fire("Error", "Failed to load data. Please try again.", "error");
        }
    });
}

function resetForm() {
    $("#subBrandForm")[0].reset();
    $("#subBrandForm").removeAttr("data-id");
    $("#ddlProductCategory").val(""); 
    $("#ProjectBrand").val("").trigger("change"); // Reset the dropdown to default
}

function populateForm(data) {
    $("#txtSubBrandCode").val(data.txtSubBrandCode);
    $("#txtSubBrandName").val(data.txtSubBrandName);
    $("#chkActive").prop("checked", data.bitActive);
    $("#subBrandForm").attr("data-id", data.intSubBrandId);

    let categoryDropdown = $("#ddlProductCategory");

    let matchingOption = categoryDropdown.find("option").filter(function () {
        return $(this).text().trim().toLowerCase() === data.txtProductCategory.trim().toLowerCase();
    });

    if (matchingOption.length > 0) {
        categoryDropdown.val(matchingOption.val()); 
    } else {
        categoryDropdown.val(""); 
    }
    $("#ProjectBrand").val(data.brandCode).trigger("change");
}

function saveOrUpdateSubBrand() {
    let id = $("#subBrandForm").attr("data-id") || 0;

    let formData = new FormData();
    formData.append("IntSubBrandId", id);
    formData.append("TxtSubBrandCode", $("#txtSubBrandCode").val());
    formData.append("TxtSubBrandName", $("#txtSubBrandName").val());
    formData.append("TxtProductCategory", $("#ddlProductCategory option:selected").text());
    formData.append("IntPmCategoryId", $("#ddlProductCategory").val());
    formData.append("BitActive", $("#chkActive").is(":checked"));
    formData.append("TxtSubBrandDesc", $("#ProjectBrand").val());

    $.ajax({
        url: "/Master/SubBrand/SaveOrUpdateSubBrand",
        type: "POST",
        processData: false,
        contentType: false,
        data: formData,
        success: function (response) {
            
            $("#subBrandModal").modal("hide");

            Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success",
                timer: 2000,
                showConfirmButton: false
            });

            $('#subBrandTable').DataTable().ajax.reload(null, false);
        },
        error: function (xhr) {
            console.error("❌ Save/Update Error:", xhr.responseText);
            Swal.fire({
                title: "Error!",
                text: "Failed to save/update data. Please try again.",
                icon: "error"
            });
        }
    });
}



