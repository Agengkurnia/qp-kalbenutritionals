"use strict";
//=======================
// VARIABLE GLOBAL
//=======================
var clsGlobal = new clsGlobalClass();
var bitLoading = false;
let oTableVariantSKU;
let oTableContentClaim;
let oTableNutriFact;
let oTableNutriFactRfv;
let oTableProductionPlan;
let temStepCode = [];
let lovId;
let StepCodeExist;
let TaskTable;
let PICTable;
var Data = {};
var SelectRow = {};
var lastValTargetBasedOn = "";
var lastValTemplateName = "";
let TaskSimulationData = [];
let SelectedPIC = {};
let PICList = [];
let CheckedDept = [];
let btnActionStat = '';
var conceptOrder = {};
let usrDept = '';
let LatestProjectData = {};
let oldVariantSKU = {};
//=======================
// ON PAGE LOAD
//=======================
$(document).ready(function () {
    oldVariantSKU = {};
    usrDept = $("#usrDept").val();

    $(".select2").select2({
        width: "100%"
    });

    $(".select2-modal").select2({
        width: "100%",
        dropdownParent: $(".modal-content")
    });

    $('.numericonly').on('input', function (event) {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    $('#projectBackground').summernote({
        height: 300,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['para', ['ul', 'ol']],
            ['insert', ['picture']],
            ['view', []]
        ]
    });
    
    $('#btnAddVarianSKU').on('click', function (e) {
        e.preventDefault();

        TableSKUVariant.Add();

        $('#ProjectSKUVarianModal').modal('toggle');
    });

    $('#btnAddProdPlanDtl').on('click', function (e) {
        e.preventDefault();

        TableProductionPlan.Add();

        $('#ProjectProductionPlanModal').modal('toggle');
    });

    $('#btnSaveVariantSKUModal').on('click', function (e) {
        e.preventDefault();

        TableSKUVariant.Save();
        TableSKUVariant.Add();

        $('#ProjectSKUVarianModal').modal('toggle');
    });

    $('#btnSaveProdPlanModal').on('click', function (e) {
        e.preventDefault();

        if (TableProductionPlan.Save()) {
            TableProductionPlan.Add();

            $('#ProjectProductionPlanModal').modal('toggle');
        }
    });

    $('#btnSave').on('click', function (e) {
        e.preventDefault();

        ProjectHeader.CollectData();

        if (Data.ModelProject.ProjectHeader.VariantSkuList.length == 0) {
            clsGlobal.swalWarning("Variant or SKU can`t be empty, please fill at least 1 !");
            return;
        }

        if (Data.ModelProject.ProjectHeader.ProjectStatus != null
            && Data.ModelProject.ProjectHeader.ProjectStatus.toUpperCase() == "APPROVED")
        {
            clsGlobal.swalWarning("Ilegal Action Save After Project Approved !");
            return;
        }

        if (Data.ModelProject.ProjectHeader.ProjectStatus != null
            && Data.ModelProject.ProjectHeader.ProjectStatus.toUpperCase() == "REJECT") {
            clsGlobal.swalWarning("Ilegal Action Save After Project Reject !");
            return;
        }

        if (Data.ModelProject.ProjectHeader.ProjectStatus != null
            && Data.ModelProject.ProjectHeader.ProjectStatus.toUpperCase() == "HOLD") {
            clsGlobal.swalWarning("Ilegal Action Save After Project Hold !");
            return;
        }

        const isvalid = ProjectHeader.Validation();

        if (isvalid) {
            Swal.fire({
                title: "Are you sure to save data?",
                icon: "warning",
                showCancelButton: true,
                showDenyButton: false,
                showConfirmButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                buttonsStyling: true,
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    ProjectHeader.SaveData();
                }
            });
        }
        
    });

    $('#btnBack').on('click', function (e) {
        e.preventDefault();
        
        Swal.fire({
            title: "The data have not been saved. Are you sure you want to go back to the home page?",
            icon: "warning",
            showCancelButton: true,
            showDenyButton: false,
            showConfirmButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: true,
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $('#ProjectId').val('');
                ProjectHeader.Init();
                GridProjectHeader.ShowList();
                GridProjectHeader.Render();
                $('#FormState').val("CREATE")
            }
        });

        
    });

    $('#btnDownlaodNutFact').on('click', function (e) {
        e.preventDefault();
        let trgtBasedOn = $("#targetBasedOn").find(":selected").val();
        let templateExcelType = $("#templateExcelType").find(":selected").val();

        if (trgtBasedOn === null || trgtBasedOn === "" || trgtBasedOn === undefined) {
            clsGlobal.swalWarning("Please choose ( Target Based On ) First !");
            return false;
        }
        else if (templateExcelType === null || templateExcelType === "" || templateExcelType === undefined) {
            clsGlobal.swalWarning("Please choose ( Template Type ) First !");
            return false;
        }

        ProjectDetail.DownloadTemplateNutriFact();
    });

    $('#btnUploadNutFact').on('click', function (e) {
        e.preventDefault();

        let prodType = $("#productType").find(":selected").val();
        let trgtBasedOn = $("#targetBasedOn").find(":selected").val();
        let algGroup = $("#algGroup").find(":selected").val();
        let algRegist = $("#algRegist").find(":selected").val();
        let servingSuggest = numeral($("#servingSuggestion").val()).value();
        let templateExcelType = $("#templateExcelType").find(":selected").val();

        if (prodType === null || prodType === "" || prodType === undefined) {
            clsGlobal.swalWarning("Please choose ( Product Type ) First !");
            return false;
        }
        else if (trgtBasedOn === null || trgtBasedOn === "" || trgtBasedOn === undefined) {
            clsGlobal.swalWarning("Please choose ( Target Based On ) First !");
            return false;
        }
        else if (algGroup === null || algGroup === "" || algGroup === undefined) {
            clsGlobal.swalWarning("Please choose ( ALG Group ) First !");
            return false;
        }
        else if (algRegist === null || algRegist === "" || algRegist === undefined) {
            clsGlobal.swalWarning("Please choose ( ALG Registration ) First !");
            return false;
        }
        else if (servingSuggest === null || servingSuggest === "" || servingSuggest === undefined) {
            clsGlobal.swalWarning("Please choose ( Serving Suggestion ) First !");
            return false;
        }
        else if (templateExcelType === null || templateExcelType === "" || templateExcelType === undefined) {
            clsGlobal.swalWarning("Please choose ( Template Type ) First !");
            return false;
        }

        ProjectDetail.UploadTemplateNutriFact();

        $("#templateUploadNutriFact").val(null);
    });

    $('#ProjectSubBrand').change(function () {
        if ($('#ProjectSubBrand').val()) {
            var DataSubBrand = ($('#ProjectSubBrand').val()).split('||');
            $('#SubBrandCode').val(DataSubBrand[0]);
            $('#ProjectBrand').val(DataSubBrand[1]);
        }
        
    });

    $('#foodCategory').change(function () {
        if ($('#foodCategory').val()) {
            var foodname = $("#foodCategory option:selected").text();
            $('#foodCategoryName').val(foodname);
        }

    });

    $('#btnClearAllNutriFact').on('click', function (e) {
        e.preventDefault();

        clsGlobal.getConfirmation(`Would you like to delete all data Nutrition Fact?`, function (result) {
            if (result) {
                if ($.fn.DataTable.isDataTable('#nutritionFactTable')) {
                    oTableNutriFact.clear();
                    oTableNutriFact.destroy();

                    oTableNutriFact = undefined;

                    Data.ModelProject.ProductSpec.DetailNutricionFact = "[]";
                }
                else {
                    return clsGlobal.swalWarning("Data Nutrition Fact is empty");
                }
            }
            else {
                return false;
            }
        });

    });

    $("#btnSaveProductSpec").on('click', (e) => {
        e.preventDefault();

        ProjectDetail.ProjectSpecSaveData();
    });

    $("#btnSaveProductPlan").on('click', (e) => {
        e.preventDefault();

        ProjectDetail.ProjectPlanSaveData();
    });

    $("#btnSaveProjectCost").on('click', (e) => {
        e.preventDefault();

        ProjectDetail.ProjectCostSaveData();
    });

    $("#btnSavePICModal").on('click', (e) => {
        e.preventDefault();

        TableProjectPIC.Save();
    });

    $("#targetBasedOn").on("select2:select", (e) => {
        e.preventDefault();
        ////
        let selectedval = $("#targetBasedOn").find(":selected").val();

        if (selectedval != "") {
            if (lastValTargetBasedOn != selectedval) {
                clsGlobal.getConfirmation(`Are you sure you want to change the Target Based on? This action will delete all data in the table.`, function (result) {
                    if (result) {
                        if ($.fn.DataTable.isDataTable('#nutritionFactTable')) {
                            oTableNutriFact.clear();
                            oTableNutriFact.destroy();

                            oTableNutriFact = undefined;

                            Data.ModelProject.ProductSpec.DetailNutricionFact = "[]";

                            lastValTargetBasedOn = selectedval;
                        }
                        else {
                            Data.ModelProject.ProductSpec.DetailNutricionFact = "[]";

                            lastValTargetBasedOn = selectedval;
                        }
                    }
                    else {
                        return false;
                    }
                });
            }
        }
    });

    $("#templateExcelType").on("select2:select", (e) => {
        e.preventDefault();
        ////
        let selectedval = $("#templateExcelType").find(":selected").val();

        if (selectedval != "") {
            if (lastValTemplateName != selectedval) {
                clsGlobal.getConfirmation(`Are you sure you want to change the Template Type on? This action will delete all data in the table.`, function (result) {
                    if (result) {
                        
                        ProjectDetail.GettingDefParamTemplateNutriFact();

                        if ($.fn.DataTable.isDataTable('#nutritionFactTable')) {
                            oTableNutriFact.clear();
                            oTableNutriFact.destroy();

                            oTableNutriFact = undefined;

                            Data.ModelProject.ProductSpec.DetailNutricionFact = "[]";

                            lastValTemplateName = selectedval;


                        }
                        else {
                            Data.ModelProject.ProductSpec.DetailNutricionFact = "[]";

                            lastValTemplateName = selectedval;
                        }
                    }
                    else {
                        return false;
                    }
                });
            }
        }
    });

    $('#ProjectType').on('change', function () {
        // Clear Project Description Fields when Project Type changes
        $('#ProjectDescription').val("").trigger("change");
        $('#ProjectDescription').empty();

        $.ajax({
            type: "POST",
            url: "/I2MS/GetProjectDesc",
            async: false,
            data: {
                ProjectType: $('#ProjectType').val() + "_",
                __RequestVerificationToken: $('#ProjectPanel input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {

                        const DataProjectDesc = JSON.parse(retDat.objData);

                        $('#ProjectDescription').select2({
                            data: DataProjectDesc,
                        });

                        if (Data.ModelProject.ProjectHeader.ProjectDesc) {
                            $('#ProjectDescription').val(Data.ModelProject.ProjectHeader.ProjectDesc).trigger('change');
                        } else {
                            $('#ProjectDescription').val("").trigger('change');
                        }
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    });

    $('#PICDept').on('change', function () {
        // Clear Project Description Fields when Project Type changes
        $('#PICAssignment').val("").trigger("change");
        $('#PICAssignment').empty();
        if ($(this).val() !== "" && $(this).val() !== null && $(this).val() !== undefined) {
            $.ajax({
                type: "POST",
                url: "/I2MS/GetPICDept",
                data: {
                    Dept: $('#PICDept').val(),
                    __RequestVerificationToken: $('#PICTaskModalForm input[name=__RequestVerificationToken]').val()
                },
                datatype: "json",
                success: function (retDat, status, xhr) {
                    clsGlobal.hideLoading();
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                    }
                    else {
                        if (retDat.bitSuccess == true) {

                            const DataAssignee = JSON.parse(retDat.objData);

                            $('#PICAssignment').select2({
                                data: DataAssignee,
                                dropdownParent: $("#ProjectPICModal")
                            });

                            if ($("#PICDept").val() !== null || $("#PICDept").val() !== undefined || $("#PICDept").val() !== "") {
                                $('#PICAssignment').val(SelectedPIC.PicAssignment).trigger('change');
                            } else {
                                $('#PICAssignment').val("").trigger('change');
                            }
                        }
                        else {
                            if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                clsGlobal.swalWarning(retDat.txtMessage);
                            }
                            else {
                                clsGlobal.swalError(retDat.txtMessage);
                            }
                        }
                    }
                },
                error: function (xhr, status, error) {
                    clsGlobal.hideLoading();
                    clsGlobal.swalError(xhr.responseText);
                }
            });
        }
        
    });

    $("#btnSubmit").on('click', (e) => {
        e.preventDefault();
        if ($('#FormState').val() == "Revise") {
            clsGlobal.swalWarning("Please Save Header First After Changing Variant or SKU !");
            return;
        }

        if (Data.ModelProject.ProjectHeader.ProjectStatus != null
            && Data.ModelProject.ProjectHeader.ProjectStatus.toUpperCase() == "APPROVED") {
            clsGlobal.swalWarning("Ilegal Action Save After Project Approved !");
            return;
        }

        if (Data.ModelProject.ProjectHeader.ProjectStatus != null
            && Data.ModelProject.ProjectHeader.ProjectStatus.toUpperCase() == "REJECT") {
            clsGlobal.swalWarning("Ilegal Action Save After Project Reject !");
            return;
        }

        if (Data.ModelProject.ProjectHeader.ProjectStatus != null
            && Data.ModelProject.ProjectHeader.ProjectStatus.toUpperCase() == "HOLD") {
            clsGlobal.swalWarning("Ilegal Action Save After Project Hold !");
            return;
        }

        ProjectHeader.CollectData();
        ProjectDetail.CollectDataInput();

        let iSValid = ProjectHeader.Validation();

        iSValid = ProjectDetail.SubmitValidation(iSValid);

        if (iSValid == true) {
            Swal.fire({
                title: "Are you sure to Submit data?",
                icon: "warning",
                showCancelButton: true,
                showDenyButton: false,
                showConfirmButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                buttonsStyling: true,
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#FormState').val("UPDATE");

                    Data.ModelProject.ProjectHeader.ProjectStatus = "SUBMITTED";

                    ProjectHeader.SaveData();

                }
            });
        }
    });

    $("#btnHold").on('click', (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Are you sure to Hold data?",
            icon: "warning",
            showCancelButton: true,
            showDenyButton: false,
            showConfirmButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: true,
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $('#FormState').val("UPDATE");
                Data.ModelProject.ProjectHeader.ProjectStatus = "HOLD";

                ProjectHeader.SaveData();

            }
        });

        
    });

    $("#btnReject").on('click', (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Are you sure to Reject data?",
            icon: "warning",
            showCancelButton: true,
            showDenyButton: false,
            showConfirmButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: true,
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $('#FormState').val("UPDATE");
                Data.ModelProject.ProjectHeader.ProjectStatus = "REJECT";

                ProjectHeader.SaveData();

            }
        });


    });

    $("#btnApprove").on('click', (e) => {
        e.preventDefault();
        if ($('#FormState').val() == "Revise") {
            clsGlobal.swalWarning("Please Save Header First After Changing Variant or SKU !");
            return;
        }

        ProjectHeader.CollectData();
        ProjectDetail.CollectDataInput();

        let iSValid = ProjectHeader.Validation();

        iSValid = ProjectDetail.SubmitValidation(iSValid);

        if (iSValid == true) {
            Swal.fire({
                title: "Are you sure to Approve data?",
                icon: "warning",
                showCancelButton: true,
                showDenyButton: false,
                showConfirmButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                buttonsStyling: true,
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#FormState').val("UPDATE");
                    Data.ModelProject.ProjectHeader.ProjectStatus = "APPROVED";

                    ProjectHeader.SaveData();

                }
            });
        }
    });

    $("#btnRevise").on('click', (e) => {
        e.preventDefault();

        Swal.fire({
            title: "Are you sure to Revise data?",
            icon: "warning",
            showCancelButton: true,
            showDenyButton: false,
            showConfirmButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            buttonsStyling: true,
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-secondary'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                $('#FormState').val("UPDATE");
                Data.ModelProject.ProjectHeader.ProjectStatus = "REVISE";

                ProjectHeader.SaveData();

            }
        });
    });

    $("#btnSubmitNextStage").on('click', (e) => {
        e.preventDefault();
        if ($('#FormState').val() == "Revise") {
            clsGlobal.swalWarning("Please Save Header First After Changing Variant or SKU !");
            return;
        }

        if (Data.ModelProject.ProjectHeader.ApprovalStatus == null || Data.ModelProject.ProjectHeader.ApprovalStatus == "") {
            Data.ModelProject.ProjectHeader.ApprovalStatus = "1";
        }

        let CurrentStage = (parseFloat(Data.ModelProject.ProjectHeader.ApprovalStatus)) * 1000;
        let NextStage = (parseFloat(Data.ModelProject.ProjectHeader.ApprovalStatus) + 1) * 1000;

        if (TaskSimulationData.filter(f => f.ProjectTaskReq.toString().toLowerCase() == "mandatory"
            && f.ProjectTaskType.includes("Task") && f.ProjectTaskVoid == false
            && parseFloat(f.ProjectTaskSeq) < NextStage
            && parseFloat(f.ProjectTaskSeq) >= CurrentStage
        ).length > 0
        ) {
            let dtcurrentstage = TaskSimulationData.filter(f => f.ProjectTaskReq.toString().toLowerCase() == "mandatory"
                && f.ProjectTaskType.includes("Task") && f.ProjectTaskVoid == false
                && parseFloat(f.ProjectTaskSeq) < NextStage
                && parseFloat(f.ProjectTaskSeq) >= CurrentStage
            );

            let isValidTask = true;

            dtcurrentstage.forEach((data, index) => {
                //console.log(data.ProjectTaskTarget.toString())

                if (!data.ProjectTaskTarget || data.ProjectTaskTarget.toString().trim() == "Invalid Date") {
                    isValidTask = false;
                    clsGlobal.swalWarning(`Please Check your Stage ${Data.ModelProject.ProjectHeader.ApprovalStatus} data task mandatory, Actual Date or Target must be filled !`);
                    return;
                } else if (!data.ProjectTaskActual || data.ProjectTaskActual.toString().trim() == "Invalid Date") {
                    isValidTask = false;
                    clsGlobal.swalWarning(`Please Check your Stage ${Data.ModelProject.ProjectHeader.ApprovalStatus} data task mandatory, Actual Date or Target must be filled !`);
                    return;
                }
            });

            if (!isValidTask) {
                clsGlobal.swalWarning(`Please Check your Stage ${Data.ModelProject.ProjectHeader.ApprovalStatus} data task mandatory, Actual Date or Target must be filled !`);
                return;
            } else {
                Swal.fire({
                    title: "Are you sure to Submit Next Stage?",
                    icon: "warning",
                    showCancelButton: true,
                    showDenyButton: false,
                    showConfirmButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    buttonsStyling: true,
                    customClass: {
                        confirmButton: 'btn btn-primary',
                        cancelButton: 'btn btn-secondary'
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        $('#FormState').val("UPDATE");

                        if (TaskSimulationData.filter(f => parseFloat(f.ProjectTaskSeq) >= NextStage).length > 0) {
                            Data.ModelProject.ProjectHeader.ApprovalStatus = (parseFloat(Data.ModelProject.ProjectHeader.ApprovalStatus) + 1).toString();
                        } else {
                            Data.ModelProject.ProjectHeader.ApprovalStatus = "DONE";
                        }

                        ProjectDetail.ProjectTaskSubmitNextStage();

                    }
                });
            }

        } else {
            Swal.fire({
                title: "Are you sure to Submit Next Stage?",
                icon: "warning",
                showCancelButton: true,
                showDenyButton: false,
                showConfirmButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                buttonsStyling: true,
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#FormState').val("UPDATE");

                    if (TaskSimulationData.filter(f => parseFloat(f.ProjectTaskSeq) >= NextStage).length > 0) {
                        Data.ModelProject.ProjectHeader.ApprovalStatus = (parseFloat(Data.ModelProject.ProjectHeader.ApprovalStatus) + 1).toString();
                    } else {
                        Data.ModelProject.ProjectHeader.ApprovalStatus = "DONE";
                    }

                    ProjectDetail.ProjectTaskSubmitNextStage();

                }
            });
        }
        
    });

    // Get all radio buttons with the name 'ConceptType'
    const conceptRadios = document.querySelectorAll('input[name="ConceptType"]');

    // Add change event listener to each radio button
    conceptRadios.forEach(radio => {
        //console.log(`Selected: ${radio.value}`);
        radio.addEventListener('change', () => {
            conceptOrder = {
                'No Concept': 0,
                'Ideation': 1,
                'Draft': 2,
                'Pre-Final': 3,
                'Final': 4
            };

            //console.log("Tets")

            if (radio.checked) {
                 
                ProjectHeader.ConceptRadio(conceptRadios, conceptOrder, radio.value);
                // You can also do other things here, like updating the UI
            }
        });
    });

    $('#ProjectRef').select2({
        // Configuration for AJAX data source
        ajax: {
            type: "POST",
            url: "/I2MS/GetRefProjectDropdown", // Your server-side endpoint
            dataType: 'json',
            delay: 250, // Throttle search requests
            data: function (params) {
                var query =  {
                    __RequestVerificationToken: $('#ProjectPanel input[name=__RequestVerificationToken]').val(),
                    term: params.term, // Search term
                    page: params.page // For pagination
                };

                return query;
            },
            processResults: function (data, params) {
                // Use Array.map() to convert custom fields to 'id' and 'text'
                //console.log(data);

                var results = data.objData.map(function (item) {
                    return {
                        id: item.id,    // Your primary key/value
                        text: item.text // The text to display
                    };
                });

                // Return the final Select2 structure. Omit the 'pagination' object.
                return {
                    results: results
                };
            },
        },
        minimumInputLength: 3,
        // Other common options
        placeholder: 'Search Project (min 3 characters)',
        allowClear: true,
    });


    Data.ModelProject = {};
    ProjectHeader.Init();


    document.querySelector('button[data-bs-target="#form-tabs-Task"]').addEventListener('shown.bs.tab', function () {
        if (TaskSimulationData != null) {
            $('#taskListTable').DataTable().columns.adjust().draw();
        }

    });

    $('#ProjectSpecTblNFRfv').on('shown.bs.modal', function () {
        // Perintahkan semua DataTable yang terlihat untuk menyesuaikan lebar kolomnya
        // Ini cara yang aman untuk menargetkan tabel di dalam modal yang baru tampil
        $('#nutritionFactTableRfv').DataTable().columns.adjust().draw();
    });

    $("#btnSaveProjectSpecTblNFRfvModal").on("click", function (e) {
        e.preventDefault();

        TableNutritionFactRfv.Save();
    });

    $("#btnCreateVerFor").on("click", function (e) {
        e.preventDefault();

        ProjectDetail.CreateVerForHeader();
    });

    $("#btnCreateRegal").on("click", function (e) {
        e.preventDefault();

        ProjectDetail.CreateRegalHeader();
    });

    $("#servingSize").on("change", function (e) {
        e.preventDefault();

        let valSer = $(this).val();

        if (valSer !== "") {
            let satServ = $("#servingSizeSatuan").val();

            if (satServ == null) {
                clsGlobal.setMessageWarning("Select Satuan Serving Size");
            } 
        }
    })
});

var ProjectHeader = {
    Init: function () {
        $('#FormDetailProject').hide();
        TaskSimulationData = [];
        SelectedPIC = {};
        PICList = [];
        CheckedDept = [];
        LatestProjectData = {};
        oldVariantSKU = {};
        SelectRow = {};

        btnActionStat = '';
        document.getElementById('btnSave').classList.remove('d-none');
        document.getElementById('btnApprove').classList.add('d-none');
        document.getElementById('btnSubmit').classList.add('d-none');
        document.getElementById('btnHold').classList.add('d-none');
        document.getElementById('btnRevise').classList.add('d-none');
        document.getElementById('btnReject').classList.add('d-none');
        document.getElementById('btnSubmitNextStage').classList.add('d-none');
        document.getElementById('btnTaskSimulation').classList.remove('d-none');

        Data.ModelProject = JSON.parse($('#hdDataHeader').val());
        $('#mappinghold').hide();
        $('#mappingsubmit').hide();

        Data.ModelProject.ProjectHeader.VariantSkuList = [];
        LatestProjectData = {};
        $('#FormDetailProjectTab').hide();
        $('#tabsdetailProject button:first').tab('show');

        // Adding Logic Remove is-invalid class
        var elementsIsInvalid = $(".is-invalid");
        elementsIsInvalid.removeClass("is-invalid");
    },
    Create: function () {
        $('#FormState').val("CREATE");
        const newId = crypto.randomUUID();
        Data.ModelProject = JSON.parse($('#hdDataHeader').val());
        Data.ModelProject.ProjectHeader.VariantSkuList = [];
        document.getElementById('btnAddVarianSKU').classList.remove('d-none');

        Data.ModelProject.ProjectHeader.ProjectId = newId;
        $('#ProjectId').val(newId);
        $('#ProjectName').val("");
        $('#ProjectNumber').val("");
        $('#ProjectStatus').val("");
        $('#ProjectType').val("").trigger("change");
        $('#ProjectDescription').val("").trigger("change");
        Helper.setRadioValue('ConceptCategory', "New Concept");
        Helper.setRadioValue('ConceptType', "No Concept");
        $('#ProjectRef').val("").trigger("change");
        $('#Remarks').val("");
        $('#ProjectStatus').val(""); 

        $('#ProjectSubBrand').val(null).trigger("change");

        $('#dtmCreatedDate').val("");
        $('#ProjectBrand').val("");
        $('#SubBrandCode').val(""); 

        TableSKUVariant.Render();
        ProjectHeader.Enable();
    },
    CollectData: function () {
        if ($('#FormState').val() == 'Create') {
            Data.ModelProject.ProjectHeader.ProjectId = crypto.randomUUID();
            $('#ProjectId').val(Data.ModelProject.ProjectHeader.ProjectId);
        } else {
            Data.ModelProject.ProjectHeader.ProjectId = $('#ProjectId').val();
        }

        Data.ModelProject.ProjectHeader.ProjectName = $('#ProjectName').val();
        Data.ModelProject.ProjectHeader.ProjectNumber = $('#ProjectNumber').val();
        Data.ModelProject.ProjectHeader.ProjectStatus = $('#ProjectStatus').val();
        Data.ModelProject.ProjectHeader.ProjectType = $('#ProjectType').val();
        Data.ModelProject.ProjectHeader.ProjectDesc = $('#ProjectDescription').val();
        Data.ModelProject.ProjectHeader.ConceptCategory = document.querySelector('input[name="ConceptCategory"]:checked').value;
        Data.ModelProject.ProjectHeader.ConceptType = document.querySelector('input[name="ConceptType"]:checked').value;
        Data.ModelProject.ProjectHeader.RefConcept = $('#ProjectRef').val();
        Data.ModelProject.ProjectHeader.Remarks = $('#Remarks').val();
        Data.ModelProject.ProjectHeader.SubBrand = $('#SubBrandCode').val();
        Data.ModelProject.ProjectHeader.VariantSku = JSON.stringify(Data.ModelProject.ProjectHeader.VariantSkuList);

        ProjectDetail.CollectDataInput();
        //console.log(Data.ModelProject.ProjectHeader);
    },
    GetData: function () {
        TaskSimulationData = [];
        SelectedPIC = {};
        PICList = [];
        CheckedDept = [];
        LatestProjectData = {};
        oldVariantSKU = {};
        SelectRow = {};
        $('.action-project').removeClass('d-none');

        $.ajax({
            type: "POST",
            url: "/I2MS/GetProjectById",
            async: true,
            data: {
                id: Data.ModelProject.ProjectHeader.ProjectId,
                __RequestVerificationToken: $('#ProjectPanel input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {

                        const DataProjectDetailAll = JSON.parse(retDat.objData);

                        ProjectHeader.MappingData(DataProjectDetailAll.ProjectHeader);

                        ProjectDetail.ProjectDescMapping(DataProjectDetailAll.ProjectDesc);
                        ProjectDetail.ProjectInfoMapping(DataProjectDetailAll.ProjectInfo);


                        if (DataProjectDetailAll.ProductSpec) {
                            ProjectDetail.ProjectSpecMapping(DataProjectDetailAll.ProductSpec);
                        }

                        if (DataProjectDetailAll.ProjectCost) {
                            ProjectDetail.ProjectCostMapping(DataProjectDetailAll.ProjectCost);
                        }
                        if (DataProjectDetailAll.ProjectPlan) {
                            ProjectDetail.ProjectPlanMapping(DataProjectDetailAll.ProjectPlan)
                        }

                        $('#PICDept').val("").trigger("change");
                        $('#PICDept').empty();

                        const DataDept = JSON.parse(DataProjectDetailAll.PICProject);

                        $('#PICDept').select2({
                            data: DataDept,
                            dropdownParent: $("#ProjectPICModal")
                        });
                        ProjectDetail.ProjectPICMapping(DataProjectDetailAll.ProjectPic);

                        ProjectDetail.ShowDetail();

                        ProjectDetail.ShowHideButtonVerfor();
                        ProjectDetail.ShowHideButtonRegal();

                        if (ProjectHeader.CheckEligible() == false) {
                            $('.action-project').addClass('d-none');
                            ProjectDetail.DisableInput();
                        } 


                        if (DataProjectDetailAll.ProjectTasks !== null && DataProjectDetailAll.ProjectTasks !== undefined
                            
                        ) {
                            TableProjectTask.Render(JSON.stringify(DataProjectDetailAll.ProjectTasks));

                            if (TaskSimulationData != null
                                && TaskSimulationData.length > 0
                                && Data.ModelProject.ProjectHeader.ProjectStatus != "DRAFT") {

                                document.getElementById('btnTaskSimulation').classList.add('d-none');


                                $("#manufacturingSites").attr("disabled", "disabled");

                                $("#primaryPackaging").attr("disabled", "disabled");

                            } else {

                                if (TaskSimulationData != null
                                    && TaskSimulationData.length > 0) {
                                    $("#manufacturingSites").attr("disabled", "disabled");

                                    $("#primaryPackaging").attr("disabled", "disabled");

                                } else {

                                    $("#manufacturingSites").removeAttr("disabled");

                                    $("#primaryPackaging").removeAttr("disabled");

                                }
                            }

                            ProjectDetail.ShowHideButtonVerfor();
                            ProjectDetail.ShowHideButtonRegal();
                        }

                        
                        

                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    SaveData: function () {
        if ($('#FormState').val().toLowerCase() == 'create') {
            clsGlobal.showLoading();
            $.ajax({
                type: "POST",
                url: "/I2MS/CreateProject",
                async: true,
                data: {
                    req: Data.ModelProject,
                    __RequestVerificationToken: $('#FormDetailProject input[name=__RequestVerificationToken]').val()
                },
                datatype: "json",
                success: function (retDat, status, xhr) {
                    clsGlobal.hideLoading();
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                    }
                    else {
                        if (retDat.bitSuccess == true) {
                            if (retDat.objData) {
                                let datarst = JSON.parse(retDat.objData);
                                clsGlobal.swalSuccess("Success to Save !\n Project Number :" + datarst.ProjectNumber);

                                $("#FormState").val("Edit");
                                ProjectHeader.GetData();
                            } else {
                                clsGlobal.swalWarning(retDat.txtMessage);
                            }
                            
                        }
                        else {
                            if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                clsGlobal.swalWarning(retDat.txtMessage);
                            }
                            else {
                                clsGlobal.swalError(retDat.txtMessage);
                            }
                        }
                    }
                },
                error: function (xhr, status, error) {
                    clsGlobal.hideLoading();
                    clsGlobal.swalError(xhr.responseText);
                }
            });
        }
        else {
            ProjectDetail.CollectDataInput();

            if (ProjectDetail.ValidationSatuanServingSize()) {
                clsGlobal.showLoading();
                $.ajax({
                    type: "POST",
                    url: "/I2MS/UpdateProject",
                    async: true,
                    data: {
                        req: Data.ModelProject,
                        __RequestVerificationToken: $('#FormDetailProject input[name=__RequestVerificationToken]').val()
                    },
                    datatype: "json",
                    success: function (retDat, status, xhr) {
                        clsGlobal.hideLoading();
                        if (xhr.responseText.includes("!DOCTYPE html")) {
                            clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                        }
                        else {
                            if (retDat.bitSuccess == true) {
                                clsGlobal.swalSuccess("Success to save data !");
                                $("#FormState").val("Edit");
                                ProjectHeader.GetData();
                            }
                            else {
                                if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                    clsGlobal.swalWarning(retDat.txtMessage);
                                }
                                else {
                                    clsGlobal.swalError(retDat.txtMessage);
                                }
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        clsGlobal.hideLoading();
                        clsGlobal.swalError(xhr.responseText);
                    }
                });
            }
        }
    },
    ShowDetail: function (id) {
        Data.ModelProject.ProjectHeader.ProjectId = id;
        clsGlobal.showLoading();
        ProjectHeader.GetData();
        clsGlobal.hideLoading();
    },
    MappingData: function (data) {
        document.getElementById('btnApprove').classList.add('d-none');
        document.getElementById('btnSubmit').classList.add('d-none');
        document.getElementById('btnHold').classList.add('d-none');
        document.getElementById('btnSave').classList.add('d-none');
        document.getElementById('btnRevise').classList.add('d-none');
        document.getElementById('btnReject').classList.add('d-none');
        document.getElementById('btnSubmitNextStage').classList.add('d-none');

        $('.note-image-btn').addClass('d-none');

        Data.ModelProject.ProjectHeader = data;
        Data.ModelProject.ProjectHeader.VariantSkuList = [];
        $('#ProjectId').val(Data.ModelProject.ProjectHeader.ProjectId);
        $('#ProjectName').val(Data.ModelProject.ProjectHeader.ProjectName);
        $('#ProjectNumber').val(Data.ModelProject.ProjectHeader.ProjectNumber);
        $('#ProjectStatus').val(Data.ModelProject.ProjectHeader.ProjectStatus);
        $('#ProjectType').val(Data.ModelProject.ProjectHeader.ProjectType).trigger("change");
        $('#ProjectDescription').val(Data.ModelProject.ProjectHeader.ProjectDesc).trigger("change");
        Helper.setRadioValue('ConceptCategory', Data.ModelProject.ProjectHeader.ConceptCategory);
        Helper.setRadioValue('ConceptType', Data.ModelProject.ProjectHeader.ConceptType);
        $('#ProjectRef').val(Data.ModelProject.ProjectHeader.RefConcept).trigger("change");
        $('#Remarks').val(Data.ModelProject.ProjectHeader.Remarks); 
        $('#ProjectStatus').val(Data.ModelProject.ProjectHeader.ProjectStatus); 
        $('#projectBackground').summernote('enable');

        const dropdown = document.querySelector('select[id="ProjectSubBrand"]');
        // Collect all values from the dropdown options
        const optionValues = Array.from(dropdown.options).map(opt => opt.value);
        const partialMatch = optionValues.find(val => val.includes(Data.ModelProject.ProjectHeader.SubBrand));

        $('#ProjectSubBrand').val(partialMatch).trigger("change");
        const formatted = moment(Data.ModelProject.ProjectHeader.CreatedDate).isValid() ? moment(Data.ModelProject.ProjectHeader.CreatedDate).format("YYYY-MMM-DD HH:mm") : "";
        $('#dtmCreatedDate').val(formatted);

        $("#FormState").val("Edit");
        Data.ModelProject.ProjectHeader.VariantSkuList = JSON.parse(Data.ModelProject.ProjectHeader.VariantSku);
        
        ProjectHeader.Disable();

        if (Data.ModelProject.ProjectHeader.ProjectStatus == 'DRAFT')
        {
            document.getElementById('btnSave').classList.remove('d-none');
            document.getElementById('btnSubmit').classList.remove('d-none');
            ProjectDetail.EnableInput();
            btnActionStat = ' ';
        }
        else if (Data.ModelProject.ProjectHeader.ProjectStatus == 'SUBMITTED') {
            document.getElementById('btnApprove').classList.remove('d-none');
            document.getElementById('btnRevise').classList.remove('d-none');
            ProjectDetail.DisableInput();
            $("#btnAddPIC").removeAttr("disabled");

            document.getElementById('btnSubmitNextStage').classList.remove('d-none');
            $("#btnSubmitNextStage").removeAttr("disabled");
            $("#btnSaveProjectTask").removeAttr("disabled");

            $("#btnCreateVerFor").removeAttr("disabled");
            $("#btnCreateRegal").removeAttr("disabled");
            

            $("#manufacturingSites").attr("disabled", "disabled");

            $("#primaryPackaging").attr("disabled", "disabled");
        }
        else if (Data.ModelProject.ProjectHeader.ProjectStatus == 'HOLD')
        {
            $('#projectBackground').summernote('disable');
            ProjectDetail.DisableInput();
            btnActionStat = ' disabled ';
        }
        else if (Data.ModelProject.ProjectHeader.ProjectStatus == 'APPROVED')
        {
            $('#projectBackground').summernote('disable');
            document.getElementById('btnHold').classList.remove('d-none');
            document.getElementById('btnRevise').classList.remove('d-none');
            document.getElementById('btnReject').classList.remove('d-none');
            ProjectDetail.DisableInput();
            btnActionStat = ' disabled ';
            $("#btnAddPIC").removeAttr("disabled");
            document.getElementById('btnSubmitNextStage').classList.remove('d-none');
            $("#btnSubmitNextStage").removeAttr("disabled");
            $("#btnSaveProjectTask").removeAttr("disabled");

            $("#btnCreateVerFor").removeAttr("disabled");
            $("#btnCreateRegal").removeAttr("disabled");


            $("#manufacturingSites").attr("disabled", "disabled");

            $("#primaryPackaging").attr("disabled", "disabled");
        }
        else if (Data.ModelProject.ProjectHeader.ProjectStatus.includes('REJECT'))
        {
            $('#projectBackground').summernote('disable');
            ProjectDetail.DisableInput();
            btnActionStat = ' disabled ';
        }
        else if (Data.ModelProject.ProjectHeader.ProjectStatus == 'REVISE') {
            document.getElementById('btnSave').classList.remove('d-none');
            document.getElementById('btnSubmit').classList.remove('d-none');
            document.getElementById('btnReject').classList.remove('d-none');
            document.getElementById('btnSubmitNextStage').classList.remove('d-none');
            ProjectDetail.EnableInput();
            btnActionStat = ' ';
            $("#btnSaveProjectTask").removeAttr("disabled");

            ProjectHeader.GetPreviousHist();

            $("#manufacturingSites").attr("disabled", "disabled");

            $("#primaryPackaging").attr("disabled", "disabled");
        }
        
        if (Data.ModelProject.ProjectHeader.ApprovalStatus == "DONE") {
            document.getElementById('btnSubmitNextStage').classList.add('d-none');
        }

        $("#btnExportTask").removeAttr("disabled");

        TableSKUVariant.Render();

        GridProjectHeader.ShowDetail();
        ProjectDetail.ShowDetail();
        if (Data.ModelProject.ProjectHeader.RefConcept != null) {
            var newOption = `<option value="${Data.ModelProject.ProjectHeader.RefConcept}" selected="selected">${Data.ModelProject.ProjectHeader.RefConcept}</option>`;
            $('#ProjectRef').append(newOption).trigger('change');
        }
    },
    Validation: function () {
        let isValid = true;
        const errorMessages = [];

        const fieldDisplayNames = {
            // 'txtSampleNumber': 'Sample Number',
            'ProjectSubBrand': 'Sub Brand',
            'ProjectName': 'Project Name',
            'ProjectType': 'Project Type',
            'ProjectDescription': 'Project Description',
            'ConceptCategory': 'Concept Category',
            'ConceptType': 'Concept Type',
        };

        const requiredFields = [
            // 'txtSampleNumber',
            'ProjectSubBrand', 'ProjectName', 'ProjectType', 'ProjectDescription', 'ConceptCategory', 'ConceptType'
        ];

        requiredFields.forEach(fieldId => {
            const element = $('#' + fieldId);
            let value = element.val();

            if (element.prop('multiple')) {
                if (!value || value.length === 0) {
                    isValid = false;
                    const displayName = fieldDisplayNames[fieldId] || fieldId;
                    errorMessages.push(`${displayName} is required`);
                    element.addClass('is-invalid');
                } else {
                    element.removeClass('is-invalid');
                }
            }
            else {
                if (!value && !fieldId.includes("Concept")) {
                    isValid = false;
                    const displayName = fieldDisplayNames[fieldId] || fieldId;
                    errorMessages.push(`${displayName} is required`);
                    element.addClass('is-invalid');
                }
                else if (fieldId.includes("Concept") && document.querySelector('input[name="' + fieldId + '"]:checked').value === null) {
                    isValid = false;
                    errorMessages.push(`${displayName} is required`);
                }
                else {
                    element.removeClass('is-invalid');
                }
            }
        });

        if (!isValid) {
            toastr.error(errorMessages.join('<br>'), 'Validation Error', { timeOut: 5000 });
        }

        return isValid;
    },
    Disable: function () {
        // Select the div element (adjust selector to match your layout)
        const div = document.getElementById('elProjectHeader');

        // Disable all form-related child elements
        div.querySelectorAll('input, button, select, textarea').forEach(el => {
            el.disabled = true;
        });
    },
    Enable: function () {
        // Select the div element (adjust selector to match your layout)
        const div = document.getElementById('elProjectHeader');

        // Disable all form-related child elements
        div.querySelectorAll('input, button, select, textarea').forEach(el => {
            el.disabled = false;
        });

        $('#dtmCreatedDate').attr("disabled", "disabled");
        $('#ProjectBrand').attr("disabled", "disabled");
        $('#ProjectNumber').attr("disabled", "disabled");
        $('#ProjectStatus').attr("disabled", "disabled");
    },
    Hold: function () {
        $("#ProjectStatus").val("HOLD");

        ProjectHeader.SaveData();
    },
    ConceptRadio: function (conceptRadios, conceptOrders, selectedval) {
        //console.log(Data.ModelProject.ProjectHeader.ProjectStatus);
        // Find the currently selected (checked) radio button

        //console.log("masoook")
        const selectedRadio = (Data.ModelProject.ProjectHeader.ProjectStatus === null) ? "No Concept" : Data.ModelProject.ProjectHeader.ConceptType;

        // If nothing is selected, we can't enforce a flow yet, so exit
        if (!selectedRadio) {
            return;
        }

        conceptOrders = {
            'No Concept': 0,
            'Ideation': 1,
            'Draft': 2,
            'Pre-Final': 3,
            'Final': 4
        };

        // Get the progression index of the selected value
        const selectedIndex = conceptOrders[selectedRadio];

        // Loop through all radio buttons to apply the logic
        conceptRadios.forEach(radio => {
            const radioValue = radio.value;
            const radioIndex = conceptOrders[radioValue];

            // If the radio button's index is LESS THAN the selected index,
            // it means it's an "older value" and must be disabled.
            if (radioIndex < selectedIndex) {
                radio.disabled = true;
                // Optionally uncheck it if it happens to be the 'old' checked value
                if (radio.checked) {
                    radio.checked = false;
                }
            } else {
                // If it's the same or a "newer value," ensure it's enabled
                radio.disabled = false;
            }
        });
    },
    GetPreviousHist: function () {
        clsGlobal.showLoading();

        $.ajax({
            type: "POST",
            url: "/I2MS/GetStatusPrevious",
            data: {
                ProjectId: Data.ModelProject.ProjectHeader.ProjectId,
                ProjectStatus: Data.ModelProject.ProjectHeader.ProjectStatus,
                __RequestVerificationToken: $('#ProjectPanel input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        LatestProjectData = {};
                        LatestProjectData = JSON.parse(retDat.objData);

                        if (LatestProjectData != null && LatestProjectData.ProjectStatus == "APPROVED") {
                            $('.rbconcept').removeAttr('disabled');
                            //$('input[name="ConceptType"][value="' + Data.ModelProject.ProjectHeader.ConceptType + '"]').prop('checked', true).trigger('change');
                            const conceptRadios = document.querySelectorAll('input[name="ConceptType"]');
                            conceptOrder = {
                                'No Concept': 0,
                                'Ideation': 1,
                                'Draft': 2,
                                'Pre-Final': 3,
                                'Final': 4
                            };
                            ProjectHeader.ConceptRadio(conceptRadios, conceptOrder, Data.ModelProject.ProjectHeader.ConceptType);
                        }
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });

        return LatestProjectData;
    },
    CheckEligible: function () {
        debugger;
        let isValid = false;

        if (Data.ModelProject.ProjectHeader.ProjectStatus == "HOLD") {
            isValid = false;
        } else if (Data.ModelProject.ProjectHeader.ProjectStatus == "REJECT") {
            isValid = false;
        }
        else if (Data.ModelProject.ProjectHeader.CreatedBy == $("#LoginUserNameSystem").val()) {
            isValid = true;
        }
        else if (PICList.filter(x => x.PicAssignment == $("#LoginUserNameSystem").val()
            && x.PicDept == "OWNER").length > 0) {
            isValid = true;
        }

        return isValid;
    }
}

var ProjectDetail = {
    ShowDetail: function () {
        $('#FormDetailProjectTab').show();

        //$('#tabsdetailProject button:first').tab('show');
    },
    CollectDataInput: function () {
        ProjectDetail.ProjectInfoCollectData();
        //ProjectDetail.ProjectPICCollectData();
        ProjectDetail.ProjectDescCollectData();
        ProjectDetail.ProjectSpecCollectData();
        ProjectDetail.ProjectCostCollectData();
        ProjectDetail.ProjectPlanCollectData();
    },
    ProjectInfoMapping: function (data) {
        if (data == null || data == undefined) {
            Data.ModelProject.ProjectInfo = {};
            Data.ModelProject.ProjectInfo.ProjectBackGround = "";
            Data.ModelProject.ProjectInfo.ProjectRegisType = "";
            Data.ModelProject.ProjectInfo.IsNeedVerifFormula = false;
            Data.ModelProject.ProjectInfo.ProjectInfoId = crypto.randomUUID();
            data = Data.ModelProject.ProjectInfo;
        } else {
            Data.ModelProject.ProjectInfo = data;
        }

        if (data.ProjectBackGround == '' || data.ProjectBackGround == null || data.ProjectBackGround == undefined) {
            $('#projectBackground').summernote('code', '');
        } else {
            $('#projectBackground').summernote('code', data.ProjectBackGround);
        }

        $('#projectRegistrationType').val(data.ProjectRegisType).trigger("change"); 

        $('#verificationFormula').val((data.IsNeedVerifFormula ? "YES" : "NO")).trigger("change"); 

        $('#ProjectInfoId').val(data.ProjectInfoId);

        ProjectDetail.ShowHideButtonVerfor();
        ProjectDetail.ShowHideButtonRegal();
    },
    ProjectInfoSaveData: function () { 
        if ($('#FormState').val() == "Revise") {
            clsGlobal.swalWarning("Please Save Header First After Changing Variant or SKU !");
            return;
        }

        ProjectDetail.ProjectInfoCollectData();

        $.ajax({
            type: "POST",
            url: "/I2MS/UpdateProjectInfo",
            data: {
                req: Data.ModelProject,
                __RequestVerificationToken: $('#projectFormInfo input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        clsGlobal.swalSuccess("Success to save Data !");
                        ProjectDetail.ProjectInfoMapping(JSON.parse(retDat.objData));
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    ProjectInfoCollectData: function () {
        
        const backgroundContent = $('#projectBackground').summernote('code');
        const registrationType = document.getElementById('projectRegistrationType').value;
        const formulaNeeded = document.getElementById('verificationFormula').value;

        Data.ModelProject.ProjectInfo.ProjectId = $('#ProjectId').val();

        if (Data.ModelProject.ProjectInfo.ProjectDescId) {
            Data.ModelProject.ProjectInfo.ProjectInfoId = $('#ProjectInfoId').val();
        } else {
            Data.ModelProject.ProjectInfo.ProjectInfoId = crypto.randomUUID();
        }

        Data.ModelProject.ProjectInfo.ProjectBackGround = backgroundContent;
        Data.ModelProject.ProjectInfo.ProjectRegisType = registrationType;
        Data.ModelProject.ProjectInfo.IsNeedVerifFormula = (formulaNeeded == "YES") ? true : false;
    },
    ProjectPICMapping: function (data) {
        TableProjectPIC.Render(data);
    },
    ProjectPICSaveData: function () {
        if ($('#FormState').val() == "Revise") {
            clsGlobal.swalWarning("Please Save Header First After Changing Variant or SKU !");
            return;
        }
    },
    ProjectDescMapping: function (data) {

        if (data == null || data == undefined) {
            Data.ModelProject.ProjectDesc = {};
            Data.ModelProject.ProjectDesc.ContentClaimList = [];
            Data.ModelProject.ProjectDesc.ProjectDescId = crypto.randomUUID();
            Data.ModelProject.ProjectDesc.FoodCategoryId = "";
            Data.ModelProject.ProjectDesc.OtherClaim = "";
            Data.ModelProject.ProjectDesc.FunctionalClaim = "";
            Data.ModelProject.ProjectDesc.OtherBenefit = "";
            Data.ModelProject.ProjectDesc.Benchmark = "";
            Data.ModelProject.ProjectDesc.TargetMarket = "";
            Data.ModelProject.ProjectDesc.FoodCategoryName = "";
            data = Data.ModelProject.ProjectDesc; 
        } else {
            Data.ModelProject.ProjectDesc = data;
            if (Data.ModelProject.ProjectDesc.ContentClaim == ''
                || Data.ModelProject.ProjectDesc.ContentClaim == null
                || Data.ModelProject.ProjectDesc.ContentClaim == undefined) {
                Data.ModelProject.ProjectDesc.ContentClaimList = [];
            } else {
                Data.ModelProject.ProjectDesc.ContentClaimList = JSON.parse(Data.ModelProject.ProjectDesc.ContentClaim);
            }
        }

        $('#ProjectDescId').val(data.ProjectDescId);
        $('#foodCategory').val(data.FoodCategoryId).trigger("change");
        $('#otherClaim').val(data.OtherClaim);
        $('#functionalClaim').val(data.FunctionalClaim);
        $('#otherBenefit').val(data.OtherBenefit);
        $('#benchmark').val(data.Benchmark);
        $('#targetMarket').val(data.TargetMarket);
        $('#foodCategoryName').val(data.FoodCategoryName);

        TableContentClaim.Render();
    },
    ProjectDescSaveData: function () {
        if ($('#FormState').val() == "Revise") {
            clsGlobal.swalWarning("Please Save Header First After Changing Variant or SKU !");
            return;
        }
        ProjectDetail.ProjectDescCollectData();

        $.ajax({
            type: "POST",
            url: "/I2MS/UpdateProjectDesc",
            data: {
                req: Data.ModelProject,
                __RequestVerificationToken: $('#descriptionForm input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        clsGlobal.swalSuccess("Success to save Data !");
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    DownloadTemplateNutriFact: function () {
        // Getting Data Code
        let templateExcelType = $("#templateExcelType").find(":selected").val();

        $.ajax({
            type: "POST",
            url: "/I2MS/ExportTemplateNutriFact",
            data: {
                __RequestVerificationToken: $('#productSpect input[name=__RequestVerificationToken]').val(),
                Code: templateExcelType
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        window.open(`/I2MS/DownloadTemplateNutriFact?file=${encodeURIComponent(retDat.objData)}`);
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    UploadTemplateNutriFact: function () {
        if ($('#FormState').val() == "Revise") {
            clsGlobal.swalWarning("Please Save Header First After Changing Variant or SKU !");
            return;
        }
        var formData = new FormData($('#productSpect')[0]);
        var targetBasedOn = $('#targetBasedOn').find(":selected").val();
        let projectID = $("#ProjectId").val();
        let algGroup = $("#algGroup").find(":selected").val();
        let algRegist = $("#algRegist").find(":selected").val();
        let servingSuggest = numeral($("#servingSuggestion").val()).value();
        let prodType = $("#productType").find(":selected").val();
        let templateExcelType = $("#templateExcelType").find(":selected").val();

        var FileVisualTemuan = undefined;

        $.each($('input[type=file]'), (index, value) => {
            if (value.id == 'templateUploadNutriFact') {
                $.each($('input[type=file]')[index].files, (index, value) => {
                    FileVisualTemuan = value;
                    formData.append("UploadNutriFact", FileVisualTemuan);
                });
            }
        })
        formData.append('TargetBasedOn', targetBasedOn);
        formData.append('AlgGroup', algGroup);
        formData.append('AlgRegist', algRegist);
        formData.append('ServingSuggest', servingSuggest);
        formData.append('ProjectId', projectID);
        formData.append('ProductType', prodType);
        formData.append('TemplateExcelType', templateExcelType);

        $.ajax({
            type: "POST",
            url: "/I2MS/UploadTemplateNutriFact",
            data: formData,
            processData: false,
            contentType: false,
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        TableNutritionFactRfv.Render(retDat.objData.data);
                        //if (retDat.objData.errorMessages != "") {
                        //    clsGlobal.getConfirmationHTMLCustom('Yes, continue!', `Would you like to proceed without this data? <br> The target value for Parameter <br> ${retDat.objData.errorMessages} ${targetBasedOn} is still missing`, function (result) {
                        //        if (result == true) {
                        //            ////
                        //            if ($.fn.DataTable.isDataTable('#nutritionFactTable')) {
                        //                oTableNutriFact.clear();
                        //                oTableNutriFact.destroy();

                        //                oTableNutriFact = undefined;

                        //                Data.ModelProject.ProductSpec.DetailNutricionFact = "[]";
                        //            }

                        //            Data.ModelProject.ProductSpec.DetailNutricionFact = retDat.objData.data;
                        //            TableNutritionFact.Render();
                        //        }
                        //        else {
                        //            return false;
                        //        }
                        //    });
                        //}
                        //else {
                        //    if ($.fn.DataTable.isDataTable('#nutritionFactTable')) {
                        //        oTableNutriFact.clear();
                        //        oTableNutriFact.destroy();

                        //        oTableNutriFact = undefined;

                        //        Data.ModelProject.ProductSpec.DetailNutricionFact = "[]";
                        //    }

                        //    Data.ModelProject.ProductSpec.DetailNutricionFact = retDat.objData.data;
                        //    TableNutritionFact.Render();
                        //}
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
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    ProjectDescCollectData: function () {
        if (Data.ModelProject.ProjectDesc.ProjectDescId) {
            Data.ModelProject.ProjectDesc.ProjectDescId = $('#ProjectDescId').val();
        } else {
            Data.ModelProject.ProjectDesc.ProjectDescId = crypto.randomUUID();
        }
        Data.ModelProject.ProjectDesc.ProjectId = $('#ProjectId').val();
        Data.ModelProject.ProjectDesc.FoodCategoryId = $('#foodCategory').val();
        Data.ModelProject.ProjectDesc.OtherClaim = $('#otherClaim').val();
        Data.ModelProject.ProjectDesc.FunctionalClaim = $('#functionalClaim').val();
        Data.ModelProject.ProjectDesc.OtherBenefit = $('#otherBenefit').val();
        Data.ModelProject.ProjectDesc.Benchmark = $('#benchmark').val();
        Data.ModelProject.ProjectDesc.TargetMarket = $('#targetMarket').val();
        Data.ModelProject.ProjectDesc.FoodCategoryName = $('#foodCategoryName').val();
        Data.ModelProject.ProjectDesc.ContentClaim = JSON.stringify(Data.ModelProject.ProjectDesc.ContentClaimList);
    },
    ProjectSpecMapping: function (data) {
        let txtParamPrimary = [];
        let txtParamSecondary = [];
        let txtParamTetriary = [];

        if (data == null || data == undefined) {
            Data.ModelProject.ProductSpec = {};
            Data.ModelProject.ProductSpec.ProductType = "";
            Data.ModelProject.ProductSpec.PrimaryPackaging = "";
            Data.ModelProject.ProductSpec.SecondaryPackaging = "";
            Data.ModelProject.ProductSpec.TertiaryPackaging = "";
            Data.ModelProject.ProductSpec.ShelflifeTarget = 0;
            Data.ModelProject.ProductSpec.AlgRegulationId = 0;
            Data.ModelProject.ProductSpec.AlgRegulationLampiran = "";
            Data.ModelProject.ProductSpec.AlgGroupId = 0;
            Data.ModelProject.ProductSpec.AlgGroupName = "";
            Data.ModelProject.ProductSpec.ServingSize = 0;
            Data.ModelProject.ProductSpec.SatuanServingSize = "";
            Data.ModelProject.ProductSpec.AddedWater = 0;
            Data.ModelProject.ProductSpec.Density = 0;
            Data.ModelProject.ProductSpec.ServingSuggestion = 0;
            Data.ModelProject.ProductSpec.Notes = "";
            Data.ModelProject.ProductSpec.TargetBasedOn = "";
            Data.ModelProject.ProductSpec.TemplateName = "";

            Data.ModelProject.ProductSpec.ProjectId = $('#ProjectId').val();
        } else {
            Data.ModelProject.ProductSpec = data;
        }

        if (Data.ModelProject.ProductSpec.PrimaryPackaging != null &&
            Data.ModelProject.ProductSpec.PrimaryPackaging != "") {
            txtParamPrimary = Data.ModelProject.ProductSpec.PrimaryPackaging.split(",");
        }

        if (Data.ModelProject.ProductSpec.SecondaryPackaging != null &&
            Data.ModelProject.ProductSpec.SecondaryPackaging != "") {
            txtParamSecondary = Data.ModelProject.ProductSpec.SecondaryPackaging.split(",");
        }

        if (Data.ModelProject.ProductSpec.TertiaryPackaging != null &&
            Data.ModelProject.ProductSpec.TertiaryPackaging != "") {
            txtParamTetriary = Data.ModelProject.ProductSpec.TertiaryPackaging.split(",");
        }

        $('#ProducSpecId').val(Data.ModelProject.ProductSpec.ProductSpecId);
        $("#primaryPackaging").val(txtParamPrimary).trigger("change");
        $("#secondaryPackaging").val(txtParamSecondary).trigger("change");
        $("#tertiaryPackaging").val(txtParamTetriary).trigger("change");
        $("#productType").val(Data.ModelProject.ProductSpec.ProductType).trigger("change");
        $("#shelfLifeTarget").val(Data.ModelProject.ProductSpec.ShelflifeTarget).trigger("blur");
        $("#algRegist").val(Data.ModelProject.ProductSpec.AlgRegulationId).trigger("change");
        $("#algGroup").val(Data.ModelProject.ProductSpec.AlgGroupId).trigger("change");
        $("#servingSize").val(Data.ModelProject.ProductSpec.ServingSize).trigger("blur");
        $("#servingSizeSatuan").val(Data.ModelProject.ProductSpec.SatuanServingSize);
        $("#addedWater").val(Data.ModelProject.ProductSpec.AddedWater).trigger("blur");
        $("#density").val(Data.ModelProject.ProductSpec.Density).trigger("blur");
        $("#servingSuggestion").val(Data.ModelProject.ProductSpec.ServingSuggestion).trigger("blur");
        $("#notes").text(Data.ModelProject.ProductSpec.Notes);
        $("#targetBasedOn").val(Data.ModelProject.ProductSpec.TargetBasedOn).trigger("change");
        $("#templateExcelType").val(Data.ModelProject.ProductSpec.TemplateName).trigger("change");

        lastValTargetBasedOn = Data.ModelProject.ProductSpec.TargetBasedOn;
        lastValTemplateName = Data.ModelProject.ProductSpec.TemplateName;

        TableNutritionFact.Render();
    },
    ProjectSpecCollectData: function () {
        // Binding Data ModelProject
        Data.ModelProject.ProductSpec.ProjectId = $('#ProjectId').val();

        if (Data.ModelProject.ProductSpec) {
            Data.ModelProject.ProductSpec.ProductSpecId = $('#ProducSpecId').val();
        }
        else {
            Data.ModelProject.ProductSpec.ProductSpecId = crypto.randomUUID();
        }

        let txtParamPrimary = [];
        let txtParamSecondary = [];
        let txtParamTetriary = [];

        // Looping Param Primary Packaging
        $.each($("#primaryPackaging").find(":selected"), function (index, item) {
            txtParamPrimary.push(item.value);
        });
        // Looping Param Secondary Packaging
        $.each($("#secondaryPackaging").find(":selected"), function (index, item) {
            txtParamSecondary.push(item.value);
        });
        // Looping Param Tetriary Packaging
        $.each($("#tertiaryPackaging").find(":selected"), function (index, item) {
            txtParamTetriary.push(item.value);
        });

        

        Data.ModelProject.ProductSpec.ProductType = $("#productType").find(":selected").val();
        Data.ModelProject.ProductSpec.PrimaryPackaging = clsGlobal.parseToString(txtParamPrimary);
        Data.ModelProject.ProductSpec.SecondaryPackaging = clsGlobal.parseToString(txtParamSecondary);
        Data.ModelProject.ProductSpec.TertiaryPackaging = clsGlobal.parseToString(txtParamTetriary);
        Data.ModelProject.ProductSpec.ShelflifeTarget = numeral($("#shelfLifeTarget").val()).value();
        Data.ModelProject.ProductSpec.AlgRegulationId = $("#algRegist").find(":selected").val();
        Data.ModelProject.ProductSpec.AlgRegulationLampiran = $("#algRegist").find(":selected").text();
        Data.ModelProject.ProductSpec.AlgGroupId = $("#algGroup").find(":selected").val();
        Data.ModelProject.ProductSpec.AlgGroupName = $("#algGroup").find(":selected").text();
        Data.ModelProject.ProductSpec.ServingSize = numeral($("#servingSize").val()).value();
        Data.ModelProject.ProductSpec.SatuanServingSize = $("#servingSizeSatuan").find(":selected").val();
        Data.ModelProject.ProductSpec.AddedWater = numeral($("#addedWater").val()).value();
        Data.ModelProject.ProductSpec.Density = numeral($("#density").val()).value();
        Data.ModelProject.ProductSpec.ServingSuggestion = numeral($("#servingSuggestion").val()).value();
        Data.ModelProject.ProductSpec.Notes = $("#notes").val();
        Data.ModelProject.ProductSpec.TargetBasedOn = $("#targetBasedOn").find(":selected").val();
        Data.ModelProject.ProductSpec.TemplateName = $("#templateExcelType").find(":selected").val();
    },
    ProjectSpecSaveData: function () {
        if ($('#FormState').val() == "Revise") {
            clsGlobal.swalWarning("Please Save Header First After Changing Variant or SKU !");
            return;
        }
        ProjectDetail.ProjectSpecCollectData();
        if (ProjectDetail.ValidationSatuanServingSize()) {
            $.ajax({
                type: "POST",
                url: "/I2MS/UpdateProjectSpec",
                data: {
                    req: Data.ModelProject,
                    __RequestVerificationToken: $('#productSpect input[name=__RequestVerificationToken]').val()
                },
                datatype: "json",
                success: function (retDat, status, xhr) {
                    clsGlobal.hideLoading();
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                    }
                    else {
                        if (retDat.bitSuccess == true) {
                            clsGlobal.swalSuccess("Success to save Data !");
                        }
                        else {
                            if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                clsGlobal.swalWarning(retDat.txtMessage);
                            }
                            else {
                                clsGlobal.swalError(retDat.txtMessage);
                            }
                        }
                    }
                },
                error: function (xhr, status, error) {
                    clsGlobal.hideLoading();
                    clsGlobal.swalError(xhr.responseText);
                }
            });
        }
    },
    ProjectCostMapping: function (data) {
        ////
        Data.ModelProject.ProjectSpec = data;

        $('#TargetPriceId').val(data.ProjectCostId);
        $("#cogsVal").val(data.CostVal).trigger("blur");
        $("#hpjVal").val(data.HpjVal).trigger("blur");
        $("#cbpVal").val(data.CbpVal).trigger("blur");
    },
    ProjectCostCollectData: function () {
        // Binding Data ModelProject
        Data.ModelProject.ProjectCost.ProjectId = $('#ProjectId').val();

        if (Data.ModelProject.ProjectCost) {
            Data.ModelProject.ProjectCost.ProjectCostId = $('#ProducSpecId').val();
        }
        else {
            Data.ModelProject.ProjectCost.ProjectCostId = crypto.randomUUID();
        }

        Data.ModelProject.ProjectCost.CostVal = numeral($("#cogsVal").val()).value();
        Data.ModelProject.ProjectCost.HpjVal = numeral($("#hpjVal").val()).value();
        Data.ModelProject.ProjectCost.CbpVal = numeral($("#cbpVal").val()).value();

    },
    ProjectCostSaveData: function () {
        if ($('#FormState').val() == "Revise") {
            clsGlobal.swalWarning("Please Save Header First After Changing Variant or SKU !");
            return;
        }
        ProjectDetail.ProjectCostCollectData();

        $.ajax({
            type: "POST",
            url: "/I2MS/UpdateProjectCost",
            data: {
                req: Data.ModelProject,
                __RequestVerificationToken: $('#targetPrice input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        clsGlobal.swalSuccess("Success to save Data !");
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    ProjectPlanMapping: function (data) {
        ////
        Data.ModelProject.ProjectPlan = data;

        $('#ProducPlanId').val(data.ProductPlanId);

        if (data.ManufSite != null && data.ManufSite != "") {
            $("#manufacturingSites").val(data.ManufSite.split(",")).trigger("change");
        } else {
            $("#manufacturingSites").val(null).trigger("change");
        }

        TableProductionPlan.Render();
    },
    ProjectPlanCollectData: function () {
        // Binding Data ModelProject
        Data.ModelProject.ProjectPlan.ProjectId = $('#ProjectId').val();

        if (Data.ModelProject.ProjectPlan) {
            Data.ModelProject.ProjectPlan.ProductPlanId = $('#ProducPlanId').val();
        }
        else {
            Data.ModelProject.ProjectPlan.ProductPlanId = crypto.randomUUID();
        }

        let txtParamManufSite = [];

        // Looping Param Primary Packaging
        $.each($("#manufacturingSites").find(":selected"), function (index, item) {
            //
            txtParamManufSite.push(item.value);
        });
        Data.ModelProject.ProjectPlan.ManufSite = clsGlobal.parseToString(txtParamManufSite);

    },
    ProjectPlanSaveData: function () {
        if ($('#FormState').val() == "Revise") {
            clsGlobal.swalWarning("Please Save Header First After Changing Variant or SKU !");
            return;
        }
        ProjectDetail.ProjectPlanCollectData();

        $.ajax({
            type: "POST",
            url: "/I2MS/UpdateProjectPlan",
            data: {
                req: Data.ModelProject,
                __RequestVerificationToken: $('#formProductPlan input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        clsGlobal.swalSuccess("Success to save Data !");
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    ProjectTaskSimulation: function () {
        ProjectDetail.CollectDataInput();
        TaskSimulationData = [];

        if (Data.ModelProject.ProjectHeader.ProjectId == '00000000-0000-0000-0000-000000000000') {
            clsGlobal.swalWarning("Please saved Project Header First!");
            return;
        }

        if (Data.ModelProject.ProjectPlan.ManufSite == ''
            || Data.ModelProject.ProjectPlan.ManufSite == null) {
            clsGlobal.swalWarning("Please fill Production Plan ( Manufacturing Site ) !");
            return;
        }

        if (Data.ModelProject.ProductSpec.PrimaryPackaging == ''
            || Data.ModelProject.ProductSpec.PrimaryPackaging == null) {
            clsGlobal.swalWarning("Please Fill Product Spec ( Primary Packaging ) !");
            return;
        }

        $.ajax({
            type: "POST",
            url: "/I2MS/SimulationProjectTask",
            data: {
                req: Data.ModelProject,
                __RequestVerificationToken: $('#projectFormTask input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        //$('#projectTaskSimulationModal').modal('toggle');

                        //if (retDat.objData !== null && retDat.objData !== undefined) {
                        //    localStorage.setItem("SIMULATION_TASK", retDat.objData);
                        //    localStorage.setItem("SIMULATION_PROJECTID", Data.ModelProject.ProjectHeader.ProjectId);
                        //    localStorage.setItem("SIMULATION_MANUFSITE", Data.ModelProject.ProjectPlan.ManufSite);
                        //    localStorage.setItem("SIMULATION_PRIMARYPACKAGING", Data.ModelProject.ProductSpec.PrimaryPackaging);
                        //    localStorage.setItem("SIMULATION_VARIANTSKU", JSON.stringify(Data.ModelProject.ProjectHeader.VariantSkuList));
                        //}

                        TableProjectTask.Render(retDat.objData);
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    ProjectTaskSaveData: function (onSuccessCallback) {
        if ($('#FormState').val() == "Revise") {
            clsGlobal.swalWarning("Please Save Header First After Changing Variant or SKU !");
            return;
        }
        let TaskDataProject = JSON.stringify(TaskSimulationData);

        Data.ModelProject.TaskProject = TaskDataProject;

        $.ajax({
            type: "POST",
            url: "/I2MS/UpdateProjectTask",
            data: {
                req: Data.ModelProject,
                __RequestVerificationToken: $('#projectFormTask input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        document.getElementById('btnTaskSimulation').classList.add('d-none');
                        $('#FormState').val("UPDATE");
                        
                        // Update TaskSimulationData from response if available
                        if (retDat.objData) {
                            try {
                                TaskSimulationData = JSON.parse(retDat.objData);
                            } catch (e) {
                                console.warn("Failed to parse TaskSimulationData from response:", e);
                            }
                        }
                        
                        // If callback provided, skip Swal and call callback directly
                        if (onSuccessCallback && typeof onSuccessCallback === 'function') {
                            onSuccessCallback(retDat);
                            return;
                        }
                        
                        Swal.fire({
                            title: "Success to save data!",
                            icon: "success",
                            showCancelButton: false,
                            showDenyButton: false,
                            showConfirmButton: true,
                            confirmButtonText: 'Yes',
                            buttonsStyling: true,
                            customClass: {
                                confirmButton: 'btn btn-primary'
                            }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('#FormState').val("UPDATE");

                                ProjectHeader.GetData();
                                
                                $('#tabsdetailProject [data-bs-target="#form-tabs-Task"]').tab('show');
                                TableProjectTask.Render(retDat.objData);
                                if (TaskSimulationData != null && TaskSimulationData.length > 0) {
                                    $('#taskListTable').DataTable().columns.adjust().draw();
                                }
                            }
                        });
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    ProjectTaskSubmitNextStage: function () {
        let TaskDataProject = JSON.stringify(TaskSimulationData);

        Data.ModelProject.TaskProject = TaskDataProject;

        $.ajax({
            type: "POST",
            url: "/I2MS/SubmitNextStageTask",
            data: {
                req: Data.ModelProject,
                __RequestVerificationToken: $('#projectFormTask input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        TableProjectTask.Render(retDat.objData);
                        document.getElementById('btnTaskSimulation').classList.add('d-none');
                        Swal.fire({
                            title: "Success to submit data!",
                            icon: "success",
                            showCancelButton: false,
                            showDenyButton: false,
                            showConfirmButton: true,
                            confirmButtonText: 'Yes',
                            buttonsStyling: true,
                            customClass: {
                                confirmButton: 'btn btn-primary'
                            }
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $('#FormState').val("UPDATE");

                                ProjectHeader.GetData();
                                $('#tabsdetailProject [data-bs-target="#form-tabs-Task"]').tab('show');
                            }
                        });
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    DisableInput: function () {
        $(".btnaction").addClass("d-none");
        // Select the div element (adjust selector to match your layout)
        const div = document.getElementById('elProjectDetail');

        // Disable all form-related child elements
        div.querySelectorAll('input, button, select, textarea').forEach(el => {
            el.disabled = true;
        });
    },
    EnableInput: function () {
        $(".btnaction").removeClass("d-none");

        // Select the div element (adjust selector to match your layout)
        const div = document.getElementById('elProjectDetail');

        // Disable all form-related child elements
        div.querySelectorAll('input, button, select, textarea').forEach(el => {
            el.disabled = false;
        });
    },
    SubmitValidation: function (IsValid) {

        if (PICList === null || PICList.length < 1) {
            IsValid = false;
            clsGlobal.swalWarning("PIC Project can't be empty !");
            return;
        }
        else if (TaskSimulationData === null || TaskSimulationData.length < 1) {
            IsValid = false;
            clsGlobal.swalWarning("Task Project can't be empty  !");
            return;
        }
        else if (TaskSimulationData !== null && TaskSimulationData.length >= 1) {
            CheckedDept = [];

            TaskSimulationData.forEach((task, index) => {
                let PIC = task.ProjectTaskPic;
                let alreadycheck = false;

                let depttocheck = CheckedDept.filter(item => item.Dept == PIC);

                if (depttocheck !== null && depttocheck.length > 0) {
                    alreadycheck = true;
                }

                if (PIC !== undefined && PIC !== null
                    && PIC !== "" && alreadycheck == false) {

                    let CheckedPIC = {};
                    CheckedPIC.Dept = PIC;

                    var PICCheck = PICList.filter(item => item.PicDept == PIC
                        && (item.PicAssignment !== null && item.PicAssignment !== ""));

                    if (PICCheck === null || PICCheck.length <= 0) {
                        IsValid = false;
                        clsGlobal.swalWarning(`Please choose at least one PIC for Dept ${PIC} !`);
                        return;
                    }

                    CheckedDept.push(CheckedPIC);
                }
            });
        }
        else if (Data.ModelProject.ProductSpec.PrimaryPackaging == null || Data.ModelProject.ProductSpec.PrimaryPackaging == '') {
            IsValid = false;
            clsGlobal.swalWarning("Primary Packaging can't be empty  !");
            return;
        }
        else if (Data.ModelProject.ProjectPlan.ManufSite == null || Data.ModelProject.ProjectPlan.ManufSite == '') {
            IsValid = false;
            clsGlobal.swalWarning("Manufacturing Site can't be empty  !");
            return;
        }
        else if (Data.ModelProject.ProductSpec.ServingSize != null || Data.ModelProject.ProductSpec.ServingSize != "") {
            if (Data.ModelProject.ProductSpec.SatuanServingSize == null) {
                IsValid = false;
                clsGlobal.swalWarning("Unit Serving Size can't be empty  !");
                return;
            }
        }

        return IsValid;
    },
    ShowHideButtonVerfor: function () {
        let verForTskStg;
        let isCretaedVerfor = Data.ModelProject.ProjectHeader.CreatedVerFor;
        let generatedTask = Data.ModelProject.ProjectInfo.IsGeneratedTask;
        let needVerFor = Data.ModelProject.ProjectInfo.IsNeedVerifFormula;
        let stgData = parseInt(Data.ModelProject.ProjectHeader.ApprovalStatus);
        let lstTask = TaskSimulationData;

        let verForLst = lstTask.filter(x => x.ProjectTaskName.includes("VERIFICATION FORMULA") || x.ProjectTaskName.includes("FORMULA VERIFICATION"));

        if (verForLst.length > 0) {
            let datVerFor = verForLst[0].ProjectTaskSeq;

            // Parsing to Array
            let datArrStg = String(datVerFor).split('').map(Number);
            verForTskStg = datArrStg[0];
        }
        else {
            verForTskStg = NaN;
        }

        if (isCretaedVerfor) {
            $("#btnCreateVerFor").addClass("d-none");
        }
        else if (!generatedTask) {
            $("#btnCreateVerFor").addClass("d-none");
        }
        else if (!needVerFor) {
            $("#btnCreateVerFor").addClass("d-none");
        }
        else {
            if (stgData == NaN) {
                $("#btnCreateVerFor").addClass("d-none");
            }
            else if (stgData == verForTskStg) {
                $("#btnCreateVerFor").removeClass("d-none");
            }
            else {
                $("#btnCreateVerFor").addClass("d-none");
            }
        }
    },
    ShowHideButtonRegal: function () {
        
        let regalTskStg;
        let isCreatedRegal = Data.ModelProject.ProjectHeader.CreatedRegal || false;
        let generatedTask = Data.ModelProject.ProjectInfo.IsGeneratedTask;
        let stgData = parseInt(Data.ModelProject.ProjectHeader.ApprovalStatus);
        let lstTask = TaskSimulationData;

        // Filter task yang mengandung REGISTRASI LOKAL (various spellings)
        let regalLst = lstTask.filter(x => {
            const taskName = x.ProjectTaskName.toUpperCase();
            return (
                (taskName.includes("REGISTRASI LOKAL") || 
                 taskName.includes("REGISTRASI LOCAL") ||
                 taskName.includes("LOCAL REGISTRASI") ||
                 taskName.includes("BPOM SUBMISSION")) &&
                !x.ProjectTaskVoid
            );
        });
        
        if (regalLst.length > 0) {
            let datRegal = regalLst[0].ProjectTaskSeq;

            // Parsing to Array
            let datArrStg = String(datRegal).split('').map(Number);
            regalTskStg = datArrStg[0];
        }
        else {
            regalTskStg = NaN;
        }

        if (isCreatedRegal) {
            $("#btnCreateRegal").addClass("d-none");
        }
        else if (!generatedTask) {
            $("#btnCreateRegal").addClass("d-none");
        }
        else {
            if (isNaN(stgData)) {
                $("#btnCreateRegal").addClass("d-none");
            }
            else if (stgData == regalTskStg) {
                $("#btnCreateRegal").removeClass("d-none");
            }
            else {
                $("#btnCreateRegal").addClass("d-none");
            }
        }
    },
    CreateVerForHeader: function () {
        debugger;
        let verForLst = TaskSimulationData.filter(x => (x.ProjectTaskName.includes("VERIFICATION FORMULA") || x.ProjectTaskName.includes("FORMULA VERIFICATION")) && !x.ProjectTaskVoid);
        let datPIC = PICTable.rows().data().toArray();
        let datConClaim = oTableContentClaim.rows().data().toArray();
        let txtParamManufSite = [];

        // Looping Param Manuf Site
        $.each($("#manufacturingSites").find(":selected"), function (index, item) {
            txtParamManufSite.push(item.value);
        });

        let mpConClaim = datConClaim.map(item => {
            return item.ClaimCode + "|" + item.ParameterName.trim();
        });

        const regex = /\|\|\s*Variant\s*:\s*(.+)$/;

        let servingSize = numeral($("#servingSize").val()).value();
        let servingSizeSatuan = $("#servingSizeSatuan").val();
        let addedWater = numeral($("#addedWater").val()).value();
        let density = numeral($("#density").val()).value();
        let algGroup = $("#algGroup").find(":selected").val();
        let datPicPdv = datPIC.findIndex(x => x.PicDept == "PDV");
        let datPicRa = datPIC.findIndex(x => x.PicDept == "RA");


        if (verForLst.length == 0) {
            clsGlobal.swalWarning("Data Task For VerFor Is Empty");

            return false;
        }
        else if (servingSize == "" || servingSize == undefined) {
            clsGlobal.swalWarning("Please Input Serving Size in Prodct Spec");

            return false;
        }
        else if (servingSizeSatuan == "" || servingSizeSatuan == undefined) {
            clsGlobal.swalWarning("Please Input Unit Serving Size in Prodct Spec");

            return false;
        }
        else if (addedWater === "" || addedWater === undefined || addedWater === null) {
            clsGlobal.swalWarning("Please Input Added Water in Prodct Spec");

            return false;
        }
        else if (density == "" || density == undefined) {
            clsGlobal.swalWarning("Please Input Density in Prodct Spec");

            return false;
        }
        else if (algGroup == "" || algGroup == undefined || algGroup == null) {
            clsGlobal.swalWarning("Please Input ALG Group in Prodct Spec");

            return false;
        }
        else if (datPicPdv == -1) {
            clsGlobal.swalWarning("Please Add PIC Product Development (PDV) in PIC");

            return false;
        }
        else if (datPicRa == -1) {
            clsGlobal.swalWarning("Please Add PIC Regulatory Affairs (RA) in PIC");

            return false;
        }

        let verForPayload = verForLst.map(y => ({
            // Data yang sudah Anda petakan
            I2msheaderId: y.ProjectHeaderId,
            I2mstaskId: y.ProjectTaskId,

            // Properti sisa yang diisi string kosong
            I2msnumber: $("#ProjectNumber").val(),
            ProjectType: $("#ProjectType").val(),
            PicProdev: datPIC.findIndex(x => x.PicDept == "PDV") == -1 ? "" : datPIC[datPIC.findIndex(x => x.PicDept == "PDV")].PicAssignment,
            PicRa: datPIC.findIndex(x => x.PicDept == "RA") == -1 ? "" : datPIC[datPIC.findIndex(x => x.PicDept == "RA")].PicAssignment,
            PicQa: "",
            Brand: $("#ProjectBrand").val(),
            SubBrand: $('#ProjectSubBrand').find(':selected').text(),
            FoodCategoryId: $("#foodCategory").find(":selected").val(),
            FoodCategoryName: $("#foodCategory").find(":selected").text(),
            VariantCode: y.ProjectTaskName.match(regex)[1].trim(),
            ServingSize: numeral($("#servingSize").val()).value(),
            SatuanServingSize: $("#servingSizeSatuan").val(),
            Klaim: mpConClaim.length == 0 ? "" : clsGlobal.parseToString(mpConClaim),
            AddedWater: numeral($("#addedWater").val()).value(),
            ManufPlan: clsGlobal.parseToString(txtParamManufSite),
            Density: numeral($("#density").val()).value(),
            AlgGroup: $("#algGroup").find(":selected").val()
        }));

        $.ajax({
            type: "POST",
            url: "/VerFor/CreateVerForHeader",
            data: {
                DataReq: verForPayload,
                __RequestVerificationToken: $('#productSpect input[name=__RequestVerificationToken]').val()
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        clsGlobal.swalSuccess("Success create VerFor Document");
                        ProjectHeader.GetData();
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
    CreateRegalHeader: function () {
        // Filter task yang mengandung REGISTRASI LOKAL (various spellings)
        let regalLst = TaskSimulationData.filter(x => {
            const taskName = x.ProjectTaskName.toUpperCase();
            return (
                (taskName.includes("REGISTRASI LOKAL") || 
                 taskName.includes("REGISTRASI LOCAL") ||
                 taskName.includes("LOCAL REGISTRASI") ||
                    taskName.includes("BPOM SUBMISSION")) && 
                !x.ProjectTaskVoid
            );
        });

        let datPIC = PICTable.rows().data().toArray();

        // Get anti-forgery token from multiple possible sources
        let antiForgeryToken = $('#projectFormTask input[name=__RequestVerificationToken]').val() 
                            || $('input[name=__RequestVerificationToken]').val() 
                            || $('#productSpect input[name=__RequestVerificationToken]').val();

        if (!antiForgeryToken) {
            clsGlobal.swalWarning("Anti-forgery token not found. Please refresh the page.");
            return;
        }

        const extractTaskValue = (taskName, label) => {
            if (!taskName) {
                return null;
            }

            const pattern = new RegExp(`\\|\\|\\s*${label}\\s*:\\s*([^|]+)`, "i");
            const match = taskName.match(pattern);
            if (match && match[1]) {
                return match[1].trim();
            }

            return null;
        };

        const toDistinctList = (rawValue) => {
            if (!rawValue) {
                return [];
            }

            return rawValue
                .split(",")
                .map(item => item.trim())
                .filter(item => item.length > 0)
                .filter((item, index, self) => self.findIndex(x => x.toUpperCase() === item.toUpperCase()) === index);
        };

        // Validasi task list
        if (regalLst.length == 0) {
            clsGlobal.swalWarning("Data Task For Registrasi Lokal Is Empty");
            return false;
        }

        // --- BUSINESS VALIDATION: Pre-check RPA Date Task (FIRST PRODUCTION or PRODUCTION READINESS) ---
        // Configuration: Mapping ProjectType to RPA Task Name
        // Add new ProjectType and its corresponding task name here for easy maintenance
        const RPA_TASK_MAPPING = {
            // ProjectType code -> RPA Task Name
            'FIRST PRODUCTION': ['NPD'],
            'PRODUCTION READINESS': ['REVIT', 'REJUV', 'SAMPLE', 'PROMO']
        };

        const projectType = $("#ProjectType").val() || "";
        const projectTypeUpper = projectType.toUpperCase();

        // Find matching RPA task name from configuration
        let rpaTaskName = null;
        for (const [mappedTaskName, projectTypes] of Object.entries(RPA_TASK_MAPPING)) {
            if (projectTypes.includes(projectTypeUpper)) {
                rpaTaskName = mappedTaskName;
                break;
            }
        }

        if (rpaTaskName) {
            // Find ALL tasks that contain the RPA task name (not just the first one)
            const rpaTasks = TaskSimulationData.filter(x => {
                const taskName = (x.ProjectTaskName || "").toUpperCase();
                return taskName.includes(rpaTaskName) && !x.ProjectTaskVoid;
            });

            if (rpaTasks.length === 0) {
                clsGlobal.swalWarning(`Task '${rpaTaskName}' tidak ditemukan pada Project ini.`);
                return false;
            }

            // Validate ALL tasks must have Target Date filled
            const tasksWithoutTarget = rpaTasks.filter(x => {
                const hasTarget = x.ProjectTaskTarget != null && 
                                 x.ProjectTaskTarget.toString().trim() !== "" &&
                                 x.ProjectTaskTarget.toString().trim() !== "Invalid Date";
                return !hasTarget;
            });

            if (tasksWithoutTarget.length > 0) {
                const taskNames = tasksWithoutTarget.map(x => x.ProjectTaskName || 'Unknown Task').join(', ');
                clsGlobal.swalWarning(
                    `Terdapat ${tasksWithoutTarget.length} task '${rpaTaskName}' pada Project I2MS yang belum lengkap. ` +
                    `Harap isi Target Date untuk semua task terkait terlebih dahulu untuk dapat membuat Registrasi Lokal. ` +
                    `Task yang belum lengkap: ${taskNames}`
                );
                return false;
            }
        }

        // --- BUSINESS VALIDATION: Pre-check BPOM SUBMISSION Task ---
        // Find ALL BPOM SUBMISSION tasks in TaskSimulationData (not just the first one)
        const bpomSubmissionTasks = TaskSimulationData.filter(x => {
            const taskName = (x.ProjectTaskName || "").toUpperCase();
            return taskName.includes("BPOM SUBMISSION") && !x.ProjectTaskVoid;
        });

        if (bpomSubmissionTasks.length === 0) {
            clsGlobal.swalWarning("Task 'BPOM SUBMISSION' tidak ditemukan pada Project ini.");
            return false;
        }

        // Validate ALL BPOM SUBMISSION tasks have required dates filled
        const incompleteBpomSubmissionTasks = [];
        bpomSubmissionTasks.forEach((task, index) => {
            const hasTarget = task.ProjectTaskTarget != null && 
                             task.ProjectTaskTarget.toString().trim() !== "" &&
                             task.ProjectTaskTarget.toString().trim() !== "Invalid Date";
            
            const hasBestEstimate = task.ProjectTaskBestEstimate != null && 
                                   task.ProjectTaskBestEstimate.toString().trim() !== "" &&
                                   task.ProjectTaskBestEstimate.toString().trim() !== "Invalid Date";

            if (!hasTarget || !hasBestEstimate) {
                let missingFields = [];
                if (!hasTarget) missingFields.push("Target Date");
                if (!hasBestEstimate) missingFields.push("Best Estimate Date");
                
                incompleteBpomSubmissionTasks.push({
                    taskName: task.ProjectTaskName || `Task ${index + 1}`,
                    missingFields: missingFields
                });
            }
        });

        if (incompleteBpomSubmissionTasks.length > 0) {
            const taskList = incompleteBpomSubmissionTasks.map(t => 
                `- ${t.taskName}: ${t.missingFields.join(", ")}`
            ).join("\n");
            
            clsGlobal.swalWarning(
                `Terdapat ${incompleteBpomSubmissionTasks.length} task 'BPOM SUBMISSION' yang belum lengkap:\n\n` +
                taskList +
                `\n\nHarap lengkapi semua field yang diperlukan terlebih dahulu.`
            );
            return false;
        }

        // --- BUSINESS VALIDATION: Pre-check BPOM APPROVAL Task ---
        // Find ALL BPOM APPROVAL tasks in TaskSimulationData (or "OBTAIN BPOM APPROVAL")
        const bpomApprovalTasks = TaskSimulationData.filter(x => {
            const taskName = (x.ProjectTaskName || "").toUpperCase();
            return (taskName.includes("BPOM APPROVAL") || taskName.includes("OBTAIN BPOM APPROVAL")) && !x.ProjectTaskVoid;
        });

        if (bpomApprovalTasks.length === 0) {
            clsGlobal.swalWarning("Task 'BPOM APPROVAL' tidak ditemukan pada Project ini.");
            return false;
        }

        // Validate ALL BPOM APPROVAL tasks have required dates filled
        const incompleteBpomApprovalTasks = [];
        bpomApprovalTasks.forEach((task, index) => {
            const hasApprovalTarget = task.ProjectTaskTarget != null && 
                                     task.ProjectTaskTarget.toString().trim() !== "" &&
                                     task.ProjectTaskTarget.toString().trim() !== "Invalid Date";
            
            const hasApprovalBestEstimate = task.ProjectTaskBestEstimate != null && 
                                           task.ProjectTaskBestEstimate.toString().trim() !== "" &&
                                           task.ProjectTaskBestEstimate.toString().trim() !== "Invalid Date";

            if (!hasApprovalTarget || !hasApprovalBestEstimate) {
                let missingFields = [];
                if (!hasApprovalTarget) missingFields.push("Target Date");
                if (!hasApprovalBestEstimate) missingFields.push("Best Estimate Date");
                
                incompleteBpomApprovalTasks.push({
                    taskName: task.ProjectTaskName || `Task ${index + 1}`,
                    missingFields: missingFields
                });
            }
        });

        if (incompleteBpomApprovalTasks.length > 0) {
            const taskList = incompleteBpomApprovalTasks.map(t => 
                `- ${t.taskName}: ${t.missingFields.join(", ")}`
            ).join("\n");
            
            clsGlobal.swalWarning(
                `Terdapat ${incompleteBpomApprovalTasks.length} task 'BPOM APPROVAL' yang belum lengkap:\n\n` +
                taskList +
                `\n\nHarap lengkapi semua field yang diperlukan terlebih dahulu.`
            );
            return false;
        }
        // --- END BUSINESS VALIDATION ---

        // Prepare data from Data.ModelProject
        let pabrikProduksi = "";
        if (Data.ModelProject.ProjectPlan && Data.ModelProject.ProjectPlan.ManufSite) {
            pabrikProduksi = Data.ModelProject.ProjectPlan.ManufSite;
        }

        let kemasanPrimer = "";
        if (Data.ModelProject.ProductSpec && Data.ModelProject.ProductSpec.PrimaryPackaging) {
            kemasanPrimer = Data.ModelProject.ProductSpec.PrimaryPackaging;
        }

        let takaranSaji = "";
        if (Data.ModelProject.ProductSpec && Data.ModelProject.ProductSpec.ServingSize) {
            let servingSize = Data.ModelProject.ProductSpec.ServingSize;
            let satuan = Data.ModelProject.ProductSpec.SatuanServingSize || "";
            takaranSaji = servingSize + " " + satuan;
        }

        let klaim = "";
        if (Data.ModelProject.ProjectDesc) {
            let claims = [];
            if (Data.ModelProject.ProjectDesc.ContentClaim) {
                try {
                    let contentClaims = JSON.parse(Data.ModelProject.ProjectDesc.ContentClaim);
                    if (Array.isArray(contentClaims) && contentClaims.length > 0) {
                        claims.push(...contentClaims.map(c => c.ContentClaimName || c));
                    }
                } catch (e) {
                    // If parsing fails, use as is
                    claims.push(Data.ModelProject.ProjectDesc.ContentClaim);
                }
            }
            if (Data.ModelProject.ProjectDesc.OtherClaim) {
                claims.push(Data.ModelProject.ProjectDesc.OtherClaim);
            }
            if (Data.ModelProject.ProjectDesc.FunctionalClaim) {
                claims.push(Data.ModelProject.ProjectDesc.FunctionalClaim);
            }
            klaim = claims.join(", ");
        }

        let jenisRegistrasi = "";
        if (Data.ModelProject.ProjectInfo && Data.ModelProject.ProjectInfo.ProjectRegisType) {
            //jenisRegistrasi = Data.ModelProject.ProjectInfo.ProjectRegisType;
            jenisRegistrasi= $('#projectRegistrationType').find(':selected').text();
        }
        debugger;
        let projectRegistrasi = $("#ProjectType").val() || "";

        const defaultPackagingList = toDistinctList(kemasanPrimer);
        const defaultSiteList = toDistinctList(pabrikProduksi);
        const legacyVariantRegex = /\|\|\s*Variant\s*:\s*(.+)$/i;
        const regalCombinationMap = new Map();

        const ensureCombination = (taskSource, variantValue, packagingValue, siteValue) => {
            const normalizedVariant = (variantValue || "").trim();
            const normalizedPackaging = (packagingValue || "").trim();
            const normalizedSite = (siteValue || "").trim();
            const combinationKey = [normalizedVariant, normalizedPackaging, normalizedSite]
                .map(x => x.toUpperCase())
                .join("||");

            if (regalCombinationMap.has(combinationKey)) {
                return;
            }

            regalCombinationMap.set(combinationKey, {
                I2msheaderId: taskSource.ProjectHeaderId,
                I2mstaskId: taskSource.ProjectTaskId,
                I2msnumber: $("#ProjectNumber").val(),
                ProjectNo: $("#ProjectNumber").val(),
                ProjectType: $("#ProjectType").val(),
                PabrikProduksi: normalizedSite || pabrikProduksi,
                KemasanPrimer: normalizedPackaging || kemasanPrimer,
                Brand: $("#ProjectBrand").val(),
                SubBrand: $('#ProjectSubBrand').find(':selected').text(),
                KategoriPangan: $("#foodCategory").find(":selected").text(),
                Varian: normalizedVariant,
                TakaranSaji: takaranSaji,
                Klaim: klaim,
                PicProdev: datPIC.findIndex(x => x.PicDept == "PDV") == -1 ? "" : datPIC[datPIC.findIndex(x => x.PicDept == "PDV")].PicAssignment.toLowerCase(),
                PicRa: datPIC.findIndex(x => x.PicDept == "RA") == -1 ? "" : datPIC[datPIC.findIndex(x => x.PicDept == "RA")].PicAssignment.toLowerCase(),
                PicBd: datPIC.findIndex(x => x.PicDept == "BD") == -1 ? "" : datPIC[datPIC.findIndex(x => x.PicDept == "BD")].PicAssignment.toLowerCase(),
                PicPackDev: datPIC.findIndex(x => x.PicDept == "PCD") == -1 ? "" : datPIC[datPIC.findIndex(x => x.PicDept == "PCD")].PicAssignment.toLowerCase(),
                JenisRegistrasi: jenisRegistrasi,
                ProjectRegistrasi: projectRegistrasi
            });
        };

        regalLst.forEach(taskItem => {
            const variantFromTask = extractTaskValue(taskItem.ProjectTaskName, "Variant");
            const legacyVariantMatch = taskItem.ProjectTaskName.match(legacyVariantRegex);
            let variantValue = variantFromTask || "";

            if (!variantValue && legacyVariantMatch && legacyVariantMatch[1]) {
                variantValue = legacyVariantMatch[1].split("||")[0].trim();
            }

            const packagingFromTask = extractTaskValue(taskItem.ProjectTaskName, "Packaging");
            const siteFromTask = extractTaskValue(taskItem.ProjectTaskName, "Site");

            const packagingOptions = (packagingFromTask
                ? [packagingFromTask]
                : (defaultPackagingList.length > 0 ? defaultPackagingList : (kemasanPrimer ? [kemasanPrimer] : [])))
                .map(item => item.trim())
                .filter(item => item.length > 0);

            const siteOptions = (siteFromTask
                ? [siteFromTask]
                : (defaultSiteList.length > 0 ? defaultSiteList : (pabrikProduksi ? [pabrikProduksi] : [])))
                .map(item => item.trim())
                .filter(item => item.length > 0);

            if (packagingOptions.length === 0 && siteOptions.length === 0) {
                ensureCombination(taskItem, variantValue, "", "");
                return;
            }

            const effectivePackaging = packagingOptions.length > 0 ? packagingOptions : [""];
            const effectiveSites = siteOptions.length > 0 ? siteOptions : [""];

            effectivePackaging.forEach(packagingValue => {
                effectiveSites.forEach(siteValue => {
                    ensureCombination(taskItem, variantValue, packagingValue, siteValue);
                });
            });
        });

        const regalPayload = Array.from(regalCombinationMap.values());

        if (regalPayload.length === 0) {
            clsGlobal.swalWarning("Tidak ditemukan kombinasi Variant, Packaging, dan Site untuk Registrasi Lokal.");
            return false;
        }

        // Store payload and token for use in callback
        const createRegalData = {
            regalPayload: regalPayload,
            antiForgeryToken: antiForgeryToken
        };

        // Call ProjectTaskSaveData first, then execute create Regal in callback
        ProjectDetail.ProjectTaskSaveData(function (saveTaskResult) {
            // After ProjectTaskSaveData succeeds, execute create Regal
            ProjectDetail._executeCreateRegal(createRegalData.regalPayload, createRegalData.antiForgeryToken);
        });
    },

    /**
     * Internal function to execute AJAX create Regal
     * @param {Array} regalPayload - The payload data for creating Regal
     * @param {string} antiForgeryToken - Anti-forgery token
     */
    _executeCreateRegal: function (regalPayload, antiForgeryToken) {
        console.log("Creating Regal with payload:", regalPayload);

        $.ajax({
            type: "POST",
            url: base_path + "/Regal/CreateRegalHeader",
            data: {
                DataReq: regalPayload,
                __RequestVerificationToken: antiForgeryToken
            },
            datatype: "json",
            beforeSend: function (request) {
                clsGlobal.showLoading();
            },
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                console.log("Create Regal Response:", retDat);
                
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        clsGlobal.swalSuccess("Success create Registrasi Lokal Document");
                        ProjectHeader.GetData();
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.objData || retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                console.error("Create Regal Error:", xhr.status, xhr.statusText, xhr.responseText);
                
                if (xhr.status === 404) {
                    clsGlobal.swalError("Controller Registrasi Lokal tidak ditemukan. URL: " + base_path + "/Regal/CreateRegalHeader");
                } else if (xhr.status === 400) {
                    clsGlobal.swalError("Bad Request: " + (xhr.responseJSON?.message || xhr.responseText));
                } else if (xhr.responseText) {
                    clsGlobal.swalError("Error: " + xhr.responseText);
                } else {
                    clsGlobal.swalError("Error connecting to server (" + xhr.status + "). Please contact administrator.");
                }
            }
        });
    },
    ValidationSatuanServingSize: function () {
        if (Data.ModelProject.ProductSpec.ServingSize != null) {
            if (Data.ModelProject.ProductSpec.SatuanServingSize == null) {

                clsGlobal.setMessageWarning("Select Satuan Serving Size");

                return false;
            }
        }

        return true;
    },
    GettingDefParamTemplateNutriFact: function () {
        // Getting Data Code
        let templateExcelType = $("#templateExcelType").find(":selected").val();

        $.ajax({
            type: "POST",
            url: "/I2MS/GettingMandatoryParam",
            data: {
                __RequestVerificationToken: $('#productSpect input[name=__RequestVerificationToken]').val(),
                Code: templateExcelType
            },
            datatype: "json",
            success: function (retDat, status, xhr) {
                clsGlobal.hideLoading();
                if (xhr.responseText.includes("!DOCTYPE html")) {
                    clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                }
                else {
                    if (retDat.bitSuccess == true) {
                        Data.ModelProject.ProductSpec.DefParam = retDat.objData;
                    }
                    else {
                        if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                            clsGlobal.swalWarning(retDat.txtMessage);
                        }
                        else {
                            clsGlobal.swalError(retDat.txtMessage);
                        }
                    }
                }
            },
            error: function (xhr, status, error) {
                clsGlobal.hideLoading();
                clsGlobal.swalError(xhr.responseText);
            }
        });
    },
}

var TableSKUVariant = {
    Add: function () {
        $('#SKUCode').val('');
        $('#VarianCode').val('').trigger("change");
        $('#UOMVarianSKU').val('').trigger("change");
        $('#VariantSKUId').val('');

        $(".select2-modal").select2({
            width: "100%",
            dropdownParent: $("#ProjectSKUVarianModal")
        });
    },
    Save: function () {
        if (!$('#VarianCode').val()) {
            clsGlobal.swalWarning("Please Fill Variant Code !");
            return;
        } else if (!$('#UOMVarianSKU').val()) {
            clsGlobal.swalWarning("Please Fill UOM !");
            return;
        } else if (!$('#SKUCode').val() || $('#SKUCode').val().trim() == "0" || $('#SKUCode').val().trim() == '') {
            clsGlobal.swalWarning("SKU can't be empty or '0'(zero) value !");
            return;
        }

        var DataSKU = {};
        if (!$('#VariantSKUId').val()) {
            
            DataSKU.VariantSkuId = crypto.randomUUID();
            DataSKU.SKU = $('#SKUCode').val();
            DataSKU.Variant = $('#VarianCode').val();
            DataSKU.VariantName = (DataSKU.Variant) ? $("#VarianCode option:selected").text() : "";
            DataSKU.UOM = $('#UOMVarianSKU').val();

            let checkexist = Data.ModelProject.ProjectHeader.VariantSkuList
                .filter(item => item.SKU == DataSKU.SKU && item.Variant == DataSKU.Variant
                    && item.UOM == DataSKU.UOM && item.VariantSkuId != DataSKU.VariantSkuId);

            if (checkexist !== null && checkexist.length > 0) {
                clsGlobal.swalWarning("Data with the same value already exists !");
                return;
            }
            else {
                Data.ModelProject.ProjectHeader.VariantSkuList.push(DataSKU);
            }

        } else {
            DataSKU.VariantSkuId = $('#VariantSKUId').val();
            DataSKU.SKU = $('#SKUCode').val();
            DataSKU.Variant = $('#VarianCode').val();
            DataSKU.VariantName = (DataSKU.Variant) ? $("#VarianCode option:selected").text() : "";
            DataSKU.UOM = $('#UOMVarianSKU').val();

            let checkexist = Data.ModelProject.ProjectHeader.VariantSkuList
                .filter(item => item.SKU == DataSKU.SKU && item.Variant == DataSKU.Variant
                    && item.UOM == DataSKU.UOM && item.VariantSkuId != DataSKU.VariantSkuId);

            if (checkexist !== null && checkexist.length > 0) {
                clsGlobal.swalWarning("Data with the same value already exists !");
                return;
            } else {

                if (oldVariantSKU == null || oldVariantSKU.VariantSkuId != DataSKU.VariantSkuId) {
                    clsGlobal.swalWarning("Data not valid !");
                    return;
                }

                let currenttaskstage = parseFloat(Data.ModelProject.ProjectHeader.ApprovalStatus ?? "1") * 1000;

                TaskSimulationData.forEach((task, index) => {
                    if (parseFloat(task.ProjectTaskSeq) >= currenttaskstage) {
                        //console.log(task.ProjectTaskName)
                        //console.log("VARIANT : " + oldVariantSKU.VariantName.toUpperCase())
                        //console.log("SKU : " + oldVariantSKU.VariantName + " " + oldVariantSKU.SKU + "  " + oldVariantSKU.UOM)

                        if (oldVariantSKU.VariantName.toUpperCase() != DataSKU.VariantName.toUpperCase()
                            && task.ProjectTaskName.includes("VARIANT : " + oldVariantSKU.VariantName.toUpperCase())) {
                            task.ProjectTaskName = task.ProjectTaskName.replace("VARIANT : " + oldVariantSKU.VariantName, "VARIANT : " + DataSKU.VariantName);
                        }
                        else if (task.ProjectTaskName.includes("SKU : " + oldVariantSKU.VariantName + " " + oldVariantSKU.SKU + "  " + oldVariantSKU.UOM)) {
                            task.ProjectTaskName = task.ProjectTaskName.replace("SKU : " + oldVariantSKU.VariantName + " " + oldVariantSKU.SKU + "  " + oldVariantSKU.UOM,
                                "SKU : " + DataSKU.VariantName + " " + DataSKU.SKU + "  " + DataSKU.UOM);
                        }
                    }
                });

                Data.ModelProject.ProjectHeader.VariantSkuList = Data.ModelProject.ProjectHeader.VariantSkuList.filter(item => item.VariantSkuId !== DataSKU.VariantSkuId);
                Data.ModelProject.ProjectHeader.VariantSkuList.push(DataSKU);

                TableProjectTask.Render(JSON.stringify(TaskSimulationData));

                Data.ModelProject.TaskProject = JSON.stringify(TaskSimulationData);

                if (Data.ModelProject.ProjectHeader.ProjectStatus != null && Data.ModelProject.ProjectHeader.ProjectStatus.toUpperCase() == "REVISE") {
                    $('#FormState').val("Revise");
                }
            }
        }

        
        $('#ProjectSKUVarianModal').modal('toggle');
        TableSKUVariant.Render();
    },
    Edit: function (button) {
        var row = $(button).closest('tr');
        var data = oTableVariantSKU.row(row).data();
        oldVariantSKU = data;

        if (data) {
            $('#VariantSKUId').val(data.VariantSkuId);
            $('#SKUCode').val(data.SKU);
            $('#VarianCode').val(data.Variant).trigger("change");
            $('#UOMVarianSKU').val(data.UOM).trigger("change");

            $(".select2-modal").select2({
                width: "100%",
                dropdownParent: $("#ProjectSKUVarianModal")
            });

            if (Data.ModelProject.ProjectHeader.ProjectStatus != null && Data.ModelProject.ProjectHeader.ProjectStatus.toLowerCase() === "revise") {
                $('#VarianCode').attr("disabled", "disabled");
            } else {
                $('#VarianCode').removeAttr("disabled");
            }

            $('#ProjectSKUVarianModal').modal('toggle');
        } else {
            clsGlobal.swalWarning("Data Not Found!");
        }

    },
    Render: function () {
        if (oTableVariantSKU) {
            oTableVariantSKU.destroy();
        }

        //let btndsbl = '';

        //if (Data.ModelProject.ProjectHeader.ProjectStatus !== null
        //    && Data.ModelProject.ProjectHeader.ProjectStatus != ""
        //    && Data.ModelProject.ProjectHeader.ProjectStatus != "CREATE"
            
        //) {
        //    btndsbl = ' disabled'
        //}

        oTableVariantSKU = $('#tblSKUVariant').DataTable({
            "data": Data.ModelProject.ProjectHeader.VariantSkuList,
            "dom": 'rtip',
            "columns": [
                { "data": "VariantSkuId", "visible": false },
                { "data": "Variant", "visible": false },
                { "data": "VariantName" },
                { "data": "SKU" },
                { "data": "UOM" },
                {
                    "data": "VariantSkuId",
                    render: function (data, type, row, meta) {
                        if (Data.ModelProject.ProjectHeader.ProjectStatus == null || Data.ModelProject.ProjectHeader.ProjectStatus == "" ) {
                            return `<button type="button" class='btn btn-warning btn-sm' onclick='TableSKUVariant.Edit(this)' ${btnActionStat}><i class="fas fa-pencil-alt me-1"></i></button> <button type="button" class='btn btn-danger btn-sm' onclick='TableSKUVariant.Delete(this)' ${btnActionStat}><i class="fas fa-trash me-1"></i></button>`;
                        }
                        //else if (Data.ModelProject.ProjectHeader.ProjectStatus == "REVISE") {
                        //    return `<button type="button" class='btn btn-warning btn-sm' onclick='TableSKUVariant.Edit(this)' ${btnActionStat}><i class="fas fa-pencil-alt me-1"></i></button>`;
                        //}
                        else {
                            return ``;
                        }

                    }
                }
            ],
            "pageLength": 5,
            "paging": true,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false
        });
    },
    Delete: function (button) {
        var row = $(button).closest('tr');
        var data = oTableVariantSKU.row(row).data();
        if (data) {
            Data.ModelProject.ProjectHeader.VariantSkuList = Data.ModelProject.ProjectHeader.VariantSkuList.filter(item => item.VariantSkuId !== data.VariantSkuId);
            oTableVariantSKU.row(row).remove().draw();
        }
    },
}

var TableContentClaim = {
    Add: function () {
        $(".select2-modal").select2({
            width: "100%",
            dropdownParent: $("#ProjectContentClaimModal")
        });

        $('#ContentClaimId').val('');
        $('#ClaimCode').val('').trigger("change");
        $('#ParameterId').val('').trigger("change");
        $('#ParameterName').val('');
        $('#ProjectContentClaimModal').modal('toggle');
    },
    Save: function () {
        if (!$('#ClaimCode').val()) {
            clsGlobal.swalWarning("Claim must be filled!");
            return;
        }
        else if (!$('#ParameterId').val()) {
            clsGlobal.swalWarning("Parameter must be filled!");
            return;
        } else if (Data.ModelProject.ProjectDesc.ContentClaimList.filter(a => a.ParameterId == $('#ParameterId').val()).length > 0) {
            clsGlobal.swalWarning("Claim with this type already exists, one type only can be choosen once!");
            return;
        }

        var DataContentClaim = {};
        if (!$('#ContentClaimId').val()) {

            DataContentClaim.ContentClaimId = crypto.randomUUID();
            DataContentClaim.ClaimCode = $('#ClaimCode').val();
            DataContentClaim.ParameterId = $('#ParameterId').val();
            DataContentClaim.ParameterName = $("#ParameterId option:selected").text();
            Data.ModelProject.ProjectDesc.ContentClaimList.push(DataContentClaim);
        } else {
            DataContentClaim.ContentClaimId = $('#ContentClaimId').val();
            DataContentClaim.ClaimCode = $('#ClaimCode').val();
            DataContentClaim.ParameterId = $('#ParameterId').val();
            DataContentClaim.ParameterName = $("#ParameterId option:selected").text();

            Data.ModelProject.ProjectDesc.ContentClaimList = Data.ModelProject.ProjectDesc.ContentClaimList.filter(item => item.ContentClaimId !== DataContentClaim.ContentClaimId);
            Data.ModelProject.ProjectDesc.ContentClaimList.push(DataContentClaim);
        }


        $('#ProjectContentClaimModal').modal('toggle');
        TableContentClaim.Render();
    },
    Edit: function (button) {
        var row = $(button).closest('tr');
        var data = oTableContentClaim.row(row).data();

        if (data) {
            $(".select2-modal").select2({
                width: "100%",
                dropdownParent: $("#ProjectContentClaimModal")
            });

            $('#ContentClaimId').val(data.ContentClaimId);
            $('#ClaimCode').val(data.ClaimCode).trigger("change");
            $('#ParameterId').val(data.ParameterId).trigger("change");
            $('#ParameterName').val(data.ParameterName);

            $('#ProjectContentClaimModal').modal('toggle');
        } else {
            clsGlobal.swalWarning("Data Not Found!");
        }

    },
    Render: function () {
        if (oTableContentClaim) {
            oTableContentClaim.destroy();
        }
        oTableContentClaim = $('#tblContentClaim').DataTable({
            "data": Data.ModelProject.ProjectDesc.ContentClaimList,
            "dom": 'rtip',
            "columns": [
                { "data": "ContentClaimId", "visible": false },
                { "data": "ParameterId", "visible": false },
                { "data": "ClaimCode" },
                { "data": "ParameterName" },
                {
                    "data": null,
                    render: function (data, type, row, meta) {
                        var str = '';

                        if (Data.ModelProject.ProjectHeader.ProjectStatus == "DRAFT"
                            || Data.ModelProject.ProjectHeader.ProjectStatus == "REVISE") {
                            str = `<button type="button" class='btn btn-warning btn-sm' onclick='TableContentClaim.Edit(this)' ${btnActionStat}><i class="fas fa-pencil-alt me-1"></i></button> <button type="button" class='btn btn-danger btn-sm' onclick='TableContentClaim.Delete(this)' ${btnActionStat}><i class="fas fa-trash me-1"></i></button>`;
                        }
                        return str;
                    },
                }
            ],
            "pageLength": 5,
            "paging": true,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false
        });
    },
    Delete: function (button) {
        var row = $(button).closest('tr');
        var data = oTableContentClaim.row(row).data();
        if (data) {
            Data.ModelProject.ProjectDesc.ContentClaimList = Data.ModelProject.ProjectDesc.ContentClaimList.filter(item => item.ContentClaimId !== data.ContentClaimId);
            oTableContentClaim.row(row).remove().draw();
        }
    },
}

var TableNutritionFact = {
    Render: function () {
        if (oTableNutriFact) {
            oTableNutriFact.destroy();
        }
        oTableNutriFact = $('#nutritionFactTable').DataTable({
            "data": JSON.parse(Data.ModelProject.ProductSpec.DetailNutricionFact),
            "dom": 'rtip',
            "columns": [
                { "data": "No" },
                { "data": "NutritionFact" },
                { "data": "UOM" },
                {
                    "data": "PerServingSize",
                    render: function (data, type, row) {
                        if (data != null) {
                            return numeral(data).format(',.00');
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    "data": "Per100g",
                    render: function (data, type, row) {
                        if (data != null) {
                            return numeral(data).format(',.00');
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    "data": "Per100ml",
                    render: function (data, type, row) {
                        if (data != null) {
                            return numeral(data).format(',.00');
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    "data": "Per100kcal",
                    render: function (data, type, row) {
                        if (data != null) {
                            return numeral(data).format(',.00');
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    "data": "ALGServingSize",
                    render: function (data, type, row) {
                        if (data != null) {
                            return numeral(data).format(',.00');
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    "data": "ALG100g",
                    render: function (data, type, row) {
                        if (data != null) {
                            return numeral(data).format(',.00');
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    "data": "ALGPerDay",
                    render: function (data, type, row) {
                        if (data != null) {
                            return numeral(data).format(',.00');
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    "data": null,
                    "render": function (data, type, row) {
                        //
                        let datDefParam = JSON.parse(Data.ModelProject.ProductSpec.DefParam);

                        if (datDefParam.find(x => x.NutriFactName == row.NutritionFact)) {
                            return '';
                        }
                        else {
                            if (Data.ModelProject.ProjectHeader.ProjectStatus == "DRAFT"
                                || Data.ModelProject.ProjectHeader.ProjectStatus == "REVISE") {
                                return `<button type="button" class='btn btn-danger btn-sm' onclick='TableNutritionFact.Delete(this)'><i class="fas fa-trash me-1"></i></button>`;
                            }
                            else {
                                return '';
                            }
                            
                        }
                    },
                }
            ],
            "pageLength": 20,
            "paging": true,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false
        });
    },
    Delete: function (button) {
        //
        var row = $(button).closest('tr');
        var data = oTableNutriFact.row(row).data();
        if (data) {

            var datToUpdate = JSON.parse(Data.ModelProject.ProductSpec.DetailNutricionFact);
            datToUpdate = datToUpdate.filter(item => item.NutritionFact !== data.NutritionFact);

            // Refresing Number
            datToUpdate.forEach((val, index) => {
                datToUpdate[index].No = index + 1
            });

            Data.ModelProject.ProductSpec.DetailNutricionFact = JSON.stringify(datToUpdate);
            oTableNutriFact.row(row).remove();

            // Refresh Column No
            oTableNutriFact.rows().every(function (rowIdx, tableLoop, rowLoop) {
                var d = this.data();
                d.No = rowIdx + 1;

                this.invalidate();
            });
                
            oTableNutriFact.draw(false);
        }
    },
}

var TableNutritionFactRfv = {
    Render: function (dataTbl) {

        if (oTableNutriFactRfv) {
            oTableNutriFactRfv.destroy();
        }
        oTableNutriFactRfv = $('#nutritionFactTableRfv').DataTable({
            "data": JSON.parse(dataTbl),
            "dom": 'rtip',
            "scrollX": true,
            "columns": [
                {
                    data: null,
                    width: "1000px",
                    className: "allow-wrap",
                    render: function (data, type, row) {
                        //console.log(row);
                        //console.log(row.ErrorMsg)
                        if (row.Status == "N") {
                            // 1. Pecah string error menjadi array, bersihkan elemen kosong
                            const errorMessages = row.ErrorMsg.split('<br>').filter(msg => msg.trim() !== '');

                            // 2. Ubah setiap pesan menjadi elemen list <li>
                            const listItems = errorMessages.map(msg => `<li>${msg}</li>`).join('');

                            // 3. Bungkus semua elemen list dengan <ul> dan tampilkan
                            return `<span style="color: red; font-weight: bold;"><ul>${listItems}</ul></span>`;
                        }
                        else if (row.Status == "S") {
                            return '<span style="color: green;">PASS</span>';
                        }

                        return '';
                    }
                },
                {
                    "data": null,
                    "render": function (data, type, row) {
                        //
                        let datDefParam = JSON.parse(Data.ModelProject.ProductSpec.DefParam);
                        //console.log(datDefParam);
                        if (datDefParam.find(x => x.NutriFactName == row.NutritionFact)) {
                            return '';
                        }
                        else {
                            return `<button type="button" class='btn btn-danger btn-sm' onclick='TableNutritionFactRfv.Delete(this)'><i class="fas fa-trash me-1"></i></button>`;
                        }
                    },
                    "defaultContent": `<button type="button" class='btn btn-danger btn-sm' onclick='TableNutritionFactRfv.Delete(this)' ${btnActionStat}><i class="fas fa-trash me-1"></i></button>`
                },
                { "data": "No" },
                { "data": "NutritionFact" },
                { "data": "UOM" },
                {
                    "data": "PerServingSize",
                    render: function (data, type, row) {
                        if (data != null) {
                            return numeral(data).format(',.00');
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    "data": "Per100g",
                    render: function (data, type, row) {
                        if (data != null) {
                            return numeral(data).format(',.00');
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    "data": "Per100ml",
                    render: function (data, type, row) {
                        if (data != null) {
                            return numeral(data).format(',.00');
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    "data": "Per100kcal",
                    render: function (data, type, row) {
                        if (data != null) {
                            return numeral(data).format(',.00');
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    "data": "ALGServingSize",
                    render: function (data, type, row) {
                        if (data != null) {
                            return numeral(data).format(',.00');
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    "data": "ALG100g",
                    render: function (data, type, row) {
                        if (data != null) {
                            return numeral(data).format(',.00');
                        }
                        else {
                            return data;
                        }
                    }
                },
                {
                    "data": "ALGPerDay",
                    render: function (data, type, row) {
                        if (data != null) {
                            return numeral(data).format(',.00');
                        }
                        else {
                            return data;
                        }
                    }
                },
            ],
            "pageLength": 20,
            "paging": true,
            "searching": false,
            "ordering": false,
            "info": false,
            autoWidth: false
        });

        // Toggle Modal
        $('#ProjectSpecTblNFRfv').modal('toggle');
    },
    Delete: function (button) {
        //
        var row = $(button).closest('tr');
        var data = oTableNutriFactRfv.row(row).data();
        if (data) {
            oTableNutriFactRfv.row(row).remove();

            // Refresh Column No
            oTableNutriFactRfv.rows().every(function (rowIdx, tableLoop, rowLoop) {
                var d = this.data();
                d.No = rowIdx + 1;

                this.invalidate();
            });

            oTableNutriFactRfv.draw(false);
        }
    },
    Save: function () {
        let boolErr = false;
        // Getting Data from Source
        let datDefParam = JSON.parse(Data.ModelProject.ProductSpec.DefParam);
        let lstData = oTableNutriFactRfv.rows().data().toArray();

        for (let item of lstData) {
            let fndIdx = datDefParam.findIndex(x => x.ParameterName == item.NutritionFact);

            if (fndIdx !== -1 && item.Status == "N") {
                clsGlobal.swalWarning("An invalid default parameter was found. Please review the error messages and try uploading the template again");
                boolErr = true;
                break;
                
            }
            else if (item.Status == "N") {
                clsGlobal.swalWarning(`The parameter "${item.NutritionFact}" is invalid. Please remove it to continue`);
                boolErr = true;
                break;
            }

            boolErr = false;
        }

        // Is Cleaned Data
        if (!boolErr) {
            if ($.fn.DataTable.isDataTable('#nutritionFactTable')) {
                oTableNutriFact.clear();
                oTableNutriFact.destroy();

                oTableNutriFact = undefined;

                Data.ModelProject.ProductSpec.DetailNutricionFact = "[]";
            }

            Data.ModelProject.ProductSpec.DetailNutricionFact = JSON.stringify(lstData);
            TableNutritionFact.Render();

            // Toggle Modal
            $('#ProjectSpecTblNFRfv').modal('toggle');
        }
    }
}

var TableProductionPlan = {
    Add: function () {
        $('#yearProdPlan').val('');
        $('#forecastSalesQtyProdPlan').val('');
        $('#forecastSalesValueProdPlan').val('');
        $('#qtySalesProdPlanSatuan').val(null).trigger("change");
        $('#valSalesProdPlanSatuan').val(null).trigger("change");
        $('#ProductPlanDtId').val('');
    },
    Save: function () {
        if (!$('#yearProdPlan').val()) {
            clsGlobal.setMessageWarning("Year harus diisi!");
            return false;
        }
        else if (!$('#forecastSalesQtyProdPlan').val()) {
            clsGlobal.setMessageWarning("Forecast Sales Quantity harus diisi!");
            return false;
        }
        else if (!$('#qtySalesProdPlanSatuan').val()) {
            clsGlobal.setMessageWarning("UOM Sales Quantity harus diisi!");
            return false;
        }
        else if (!$('#forecastSalesValueProdPlan').val()) {
            clsGlobal.setMessageWarning("Forecast Sales Value harus diisi!");
            return false;
        }
        else if (!$('#valSalesProdPlanSatuan').val()) {
            clsGlobal.setMessageWarning("UOM Sales Value harus diisi!");
            return false;
        }


        var DataProdPlan = {};
        if (!$('#ProductPlanDtId').val()) {

            DataProdPlan.ProductPlanDtId = crypto.randomUUID();
            DataProdPlan.Year = $('#yearProdPlan').val();
            DataProdPlan.ForecastSalesQty = numeral($('#forecastSalesQtyProdPlan').val()).value();
            DataProdPlan.SatuanForecastQty = $("#qtySalesProdPlanSatuan option:selected").val();
            DataProdPlan.ForecastSalesVal = numeral($('#forecastSalesValueProdPlan').val()).value();
            DataProdPlan.SatuanForecastVal = $("#valSalesProdPlanSatuan option:selected").val();

            let lstData = JSON.parse(Data.ModelProject.ProjectPlan.ProductPlanDetail);
            lstData.push(DataProdPlan);

            Data.ModelProject.ProjectPlan.ProductPlanDetail = JSON.stringify(lstData);

        } else {
            DataProdPlan.ProductPlanDtId = $('#ProductPlanDtId').val();
            DataProdPlan.Year = $('#yearProdPlan').val();
            DataProdPlan.ForecastSalesQty = $('#forecastSalesQtyProdPlan').val();
            DataProdPlan.SatuanForecastQty = $("#qtySalesProdPlanSatuan option:selected").val();
            DataProdPlan.ForecastSalesVal = $('#forecastSalesValueProdPlan').val();
            DataProdPlan.SatuanForecastVal = $("#valSalesProdPlanSatuan option:selected").val();

            let lstData = JSON.parse(Data.ModelProject.ProjectPlan.ProductPlanDetail);
            lstData = lstData.filter(item => item.ProductPlanDtId !== DataProdPlan.ProductPlanDtId);
            lstData.push(DataProdPlan);

            Data.ModelProject.ProjectPlan.ProductPlanDetail = JSON.stringify(lstData);
        }


        $('#ProjectProductionPlanModal').modal('toggle');
        TableProductionPlan.Render();

        return true;
    },
    Edit: function (button) {
        var row = $(button).closest('tr');
        var data = oTableProductionPlan.row(row).data();

        if (data) {

            $('#yearProdPlan').val(data.Year);
            $('#forecastSalesQtyProdPlan').val(data.ForecastSalesQty).trigger("blur");
            $('#forecastSalesValueProdPlan').val(data.ForecastSalesVal).trigger("blur");
            $('#qtySalesProdPlanSatuan').val(data.SatuanForecastQty).trigger("change");
            $('#valSalesProdPlanSatuan').val(data.SatuanForecastVal).trigger("change");
            $('#ProductPlanDtId').val(data.ProductPlanDtId);

            $('#ProjectProductionPlanModal').modal('toggle');
        } else {
            clsGlobal.swalWarning("Data Not Found!");
        }

    },
    Render: function () {
        if (oTableProductionPlan) {
            oTableProductionPlan.destroy();
        }
        oTableProductionPlan = $('#prodPlanTblDtl').DataTable({
            "data": JSON.parse(Data.ModelProject.ProjectPlan.ProductPlanDetail),
            "dom": 'rtip',
            "columns": [
                { "data": "Year" },
                {
                    "data": "ForecastSalesQty",
                    render: function (data, type, row) {
                        return numeral(data).format(',.00');
                    }
                },
                { "data": "SatuanForecastQty" },
                {
                    "data": "ForecastSalesVal",
                    render: function (data, type, row) {
                        return numeral(data).format(',.00');
                    }
                },
                { "data": "SatuanForecastVal" },
                {
                    "data": null,
                    render: function (data, type, row) {
                        if (Data.ModelProject.ProjectHeader.ProjectStatus == "DRAFT"
                            || Data.ModelProject.ProjectHeader.ProjectStatus == "REVISE") {
                            return `<button type="button" class='btn btn-warning btn-sm' onclick='TableProductionPlan.Edit(this)' ${btnActionStat}><i class="fas fa-pencil-alt me-1"></i></button> <button type="button" class='btn btn-danger btn-sm' onclick='TableProductionPlan.Delete(this)' ${btnActionStat}><i class="fas fa-trash me-1"></i></button>`;
                        }
                        else {
                            return '';
                        }
                    }
                }
            ],
            "pageLength": 3,
            "paging": true,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false
        });
    },
    Delete: function (button) {
        var row = $(button).closest('tr');
        var data = oTableProductionPlan.row(row).data();
        if (data) {
            let lstData = JSON.parse(Data.ModelProject.ProjectPlan.ProductPlanDetail);
            lstData = lstData.filter(item => item.ProductPlanDtId !== data.ProductPlanDtId);

            Data.ModelProject.ProjectPlan.ProductPlanDetail = JSON.stringify(lstData);

            oTableProductionPlan.row(row).remove().draw();
        }
    },
}

var TableProjectTask = {
    Render: function (data) {//
        let datatask = JSON.parse(data);

        if (Data.ModelProject.ProjectHeader.ProjectStatus != null && datatask != null) {
            
            TaskSimulationData = datatask;

            // 1. Destroy the existing DataTables instance
            if ($.fn.DataTable.isDataTable('#taskListTable')) {
                //TaskTable = $('#taskListTable').DataTable({ destroy: true });
                TaskTable.destroy();
            }

            let stageproject = (Data.ModelProject.ProjectHeader.ApprovalStatus) ? Data.ModelProject.ProjectHeader.ApprovalStatus : "1";
            //console.log(stageproject);

            var collapsedGroups = {};
            var top = '';
            var middle = '';
            var parent = '';
            let disabled = '';
            let currentstage = parseFloat((stageproject == "DONE") ? "99" : stageproject) * 1000;

            var table = $('#taskListTable').DataTable({
                dom: 'Bfrtip',
                buttons: [
                ],
                scrollY: "700px",
                data: datatask,
                columns: [
                    //{ data: 'ProjectTaskId', title: 'TaskId' },
                    //{ data: 'ProjectTaskParent', title: 'Parent' },
                    //{ data: 'ProjectTaskSeq', title: 'TaskSeq' },
                    // Checkbox column
                    {
                        data: 'ProjectTaskVoid',
                        title: 'Void',
                        width: '1%',
                        render: function (data, type, row, meta) {
                            const checked = data ? 'checked' : '';
                            disabled = " disabled";


                            if (TableProjectTask.CheckEligible(row, currentstage, "Void") == true) {
                                disabled = "";
                                $("#btnSaveProjectTask").removeAttr("disabled");

                                if (row.ProjectTaskName.includes("VERIFICATION FORMULA")) {
                                    $("#btnCreateVerFor").removeAttr("disabled");
                                }

                                if (row.ProjectTaskName.includes("BPOM SUBMISSION")) {
                                    $("#btnCreateRegal").removeAttr("disabled");
                                }
                            }

                            return `<input id='chb${meta.row}' type="checkbox" onchange="TableProjectTask.UpdateRowTask(${meta.row}, 'ProjectTaskVoid', this.checked)" data-id="${row.ProjectTaskId}"  class="void-task-checkbox" ${checked} style="width:35px;" ${disabled} />`;


                        },
                        className: 'text-center'
                    },
                    {
                        data: 'ProjectTaskName',
                        width: '39%',
                        title: 'Name',
                        render: function (data, type, row, meta) {
                            if (data.includes("||")) {
                                return data.replaceAll("||", "<br>");

                            } else {
                                return data;
                            }
                        }
                    },
                    {
                        data: 'ProjectTaskReq',
                        width: '8%', title: 'Requirement'
                    },
                    {
                        data: 'ProjectTaskPic',
                        width: '7%', title: 'PIC'
                    },
                    {
                        data: 'ProjectTaskStatus',
                        width: '21%',
                        title: 'Status',
                        render: function (data, type, row, meta) {
                            let str = "";
                            disabled = " disabled";


                            if (TableProjectTask.CheckEligible(row, currentstage, "Status") == true) {
                                disabled = "";
                            }

                            if (disabled == "") {
                                str = `<select id="ddlTaskStatus${meta.row}" onchange="TableProjectTask.UpdateRowTask(${meta.row}, 'ProjectTaskStatus', this.value)" data-id="${row.ProjectTaskId}" class="form-select select2-modal" data-placeholder="Select Status">
                                            <option value="DRAFT" ${(row.ProjectTaskStatus == 'DRAFT') ? "selected" : ""}>DRAFT</option>
                                            <option value="ONPROGRESS"  ${(row.ProjectTaskStatus == 'ONPROGRESS') ? "selected" : ""}>ONPROGRESS</option>
                                            <option value="DONE"  ${(row.ProjectTaskStatus == 'DONE') ? "selected" : ""}>DONE</option>
                                        </select>`;

                            } else {
                                str = (data) ? data : 'DRAFT';
                            }

                            return str;
                        }
                    },
                    // Date columns
                    {
                        data: 'ProjectTaskTarget',
                        title: 'Target',
                        width: '8%',
                        render: function (data, type, row, meta) {
                            disabled = " disabled";

                            if (TableProjectTask.CheckEligible(row,currentstage,"Target") == true)
                            { 
                                disabled = "";
                            }

                            return (row.ProjectTaskVoid) ? `` : `<input type="text" id='TaskTarget${meta.row}' readonly onchange="TableProjectTask.UpdateRowTask(${meta.row}, 'ProjectTaskTarget', this.value)" data-id="${row.ProjectTaskId}" class="form-control datepicker" value="${TableProjectTask.ShowDateInput(data)}" ${disabled} style="width:125px;" />`;
                        }
                    },
                    {
                        data: 'ProjectTaskActual',
                        title: 'Actual',
                        width: '8%',
                        render: function (data, type, row, meta) {
                            disabled = " disabled";

                            if (TableProjectTask.CheckEligible(row, currentstage, "Actual") == true) {
                                disabled = "";
                            }

                            return (row.ProjectTaskVoid) ? `` : `<input type="text" id='TaskActual${meta.row}' readonly onchange="TableProjectTask.UpdateRowTask(${meta.row}, 'ProjectTaskActual', this.value)" data-id="${row.ProjectTaskId}" class="form-control datepicker" value="${TableProjectTask.ShowDateInput(data)}" ${disabled} style="width:125px;" />`;
                        }
                    },
                    {
                        data: 'ProjectTaskBestEstimate',
                        title: 'Best Estimate',
                        width: '8%',
                        render: function (data, type, row, meta) {
                            disabled = " disabled";

                            if (TableProjectTask.CheckEligible(row, currentstage, "BestEstimate") == true) {
                                disabled = "";
                            }

                            return (row.ProjectTaskVoid) ? `` : `<input type="text" id='TaskBE${meta.row}' readonly onchange="TableProjectTask.UpdateRowTask(${meta.row}, 'ProjectTaskBestEstimate', this.value)" data-id="${row.ProjectTaskId}" class="form-control datepicker" value="${TableProjectTask.ShowDateInput(data)}" ${disabled} style="width:125px;" />`;
                        }
                    },
                    { data: 'ProjectTaskType', title: 'TaskType', class: 'task_child' },
                ],
                ordering: false,
                columnDefs: [{
                    targets: [8],
                    visible: false
                }],
                stripeClasses: [],
                paging: false,
                searching: false,
                rowGroup: {
                    dataSrc: ['StageName', 'SubStageName'],
                    startRender: function (rows, group, level) {
                        var all;

                        if (level === 0) {
                            top = group;
                            all = group;
                            middle = '';
                        } else {
                            // if parent collapsed, nothing to do
                            if (!!collapsedGroups[top]) {
                                return;
                            }
                            if (level === 1) {
                                middle = group;
                            }
                            all = top + middle + group;
                        }

                        //console.log(group, level, all)

                        var collapsed = !!collapsedGroups[all];

                        rows.nodes().each(function (r) {
                            r.style.display = collapsed ? 'none' : '';
                        });

                        if (level === 0) {
                            let totalrow = datatask.filter(x => x.StageName == group && x.ProjectTaskType.includes("Task")).length;
                            let strcurrent = '';
                            if (parseFloat(rows.data()[0].ProjectTaskSeq) == currentstage){
                                strcurrent = ' <a href="javascript:void(0);" asp-action="View" asp-route-id="true" class="p-2 btn btn-sm btn-info noborder-radius"> Current </a>';
                            }

                            return $('<tr/>')
                                .append('<td colspan="8"> Stage ' + (parseFloat(rows.data()[0].ProjectTaskSeq) / 1000) + '. ' + group + ' ( ' + totalrow + ' ) '+ strcurrent + '</td>')
                                .attr('data-name', all)
                                .toggleClass('collapsed', collapsed);
                        }
                        else if (level === 1) {
                            if (group !== "") {
                                return $('<tr/>')
                                    .append('<td colspan="8">' + (parseFloat(rows.data()[0].ProjectTaskSeq) / 1000) + ' ' + group + ' (' + (parseFloat(rows.count()) - 1) + ')</td>')
                                    .attr('data-name', all)
                                    .toggleClass('collapsed', collapsed);
                            }

                        }
                        else if (level === 2) {
                            return $('<tr/>')
                                .append('<td colspan="8">' + (parseFloat(rows.data()[0].ProjectTaskSeq) / 1000) + ' ' + group + ' (' + (parseFloat(rows.count()) - 1) + ')</td>')
                                .attr('data-name', all)
                                .toggleClass('collapsed', collapsed);
                        }


                    }
                },
                rowCallback: function (row, aData, iDisplayIndex) {
                    if (aData.ProjectTaskType === "Stage") {
                        // Add a class to the row
                        $(row).addClass('hide-row');
                    }
                    else if (aData.ProjectTaskType === "Sub Stage") {
                        // Add a class to the row
                        $(row).addClass('hide-row');
                    }
                },
                drawCallback: function () {
                    $('.datepicker').datepicker({
                        format: 'dd M yyyy',
                        autoclose: true,
                        todayHighlight: true,
                        daysOfWeekDisabled: [0, 6]
                    });

                    $(".select-status-task-project").trigger("change");
                },
                scrollCollapse: true,
                responsive: true
            });
            //console.log(disabled)

            TaskTable = table;

            $('#taskListTable tbody').on('click', 'tr.dtrg-start', function () {
                var name = $(this).data('name');
                collapsedGroups[name] = !collapsedGroups[name];
                if (TaskSimulationData != null && TaskSimulationData.length > 0) {
                    $('#taskListTable').DataTable().columns.adjust().draw();
                }
            });
        }
        
    },
    UpdateRowTask: function (rowIndex, field, value) {
        if (TaskSimulationData[rowIndex]) {
            if (field != "ProjectTaskVoid" && field != "ProjectTaskStatus") {
                if (field == "ProjectTaskTarget") {
                    console.log(TableProjectTask.ParseDateInput(TaskSimulationData[rowIndex]["ProjectTaskBestEstimate"]));
                    console.log(TableProjectTask.ParseDateInput(value));
                    if (!TaskSimulationData[rowIndex]["ProjectTaskBestEstimate"] || TaskSimulationData[rowIndex]["ProjectTaskBestEstimate"].toString().trim() == "Invalid Date") {
                        TaskSimulationData[rowIndex]["ProjectTaskBestEstimate"] = TableProjectTask.ParseDateInput(value);
                        $(`#TaskBE${rowIndex}`).val(value);
                    }
                    else if (TaskSimulationData[rowIndex]["ProjectTaskBestEstimate"] && TableProjectTask.ParseDateInput(TaskSimulationData[rowIndex]["ProjectTaskBestEstimate"]) < TableProjectTask.ParseDateInput(value)) {
                        TaskSimulationData[rowIndex]["ProjectTaskBestEstimate"] = TableProjectTask.ParseDateInput(value);
                        $(`#TaskBE${rowIndex}`).val(value);
                    }
                } 
                TaskSimulationData[rowIndex][field] = TableProjectTask.ParseDateInput(value);
            }
            else
                TaskSimulationData[rowIndex][field] = value;

            if (field == "ProjectTaskVoid") {
                if (field == "ProjectTaskVoid" && value == true) {
                    $(`#ddlTaskStatus${rowIndex}`).attr("disabled", "disabled");
                    $(`#TaskBE${rowIndex}`).attr("disabled", "disabled");
                    $(`#TaskActual${rowIndex}`).attr("disabled", "disabled");
                    $(`#TaskTarget${rowIndex}`).attr("disabled", "disabled");
                } else {
                    $(`#ddlTaskStatus${rowIndex}`).removeAttr("disabled");
                    $(`#TaskBE${rowIndex}`).removeAttr("disabled");
                    $(`#TaskActual${rowIndex}`).removeAttr("disabled");
                    $(`#TaskTarget${rowIndex}`).removeAttr("disabled");
                }
            }
            else if (field == "ProjectTaskStatus") {
                if (field == "ProjectTaskStatus" && value == "DONE") {
                    $(`#chb${rowIndex}`).attr("disabled", "disabled");
                    $(`#TaskBE${rowIndex}`).attr("disabled", "disabled");
                    $(`#TaskActual${rowIndex}`).attr("disabled", "disabled");
                    $(`#TaskTarget${rowIndex}`).attr("disabled", "disabled");
                } else {
                    $(`#chb${rowIndex}`).removeAttr("disabled");
                    $(`#TaskBE${rowIndex}`).removeAttr("disabled");
                    $(`#TaskActual${rowIndex}`).removeAttr("disabled");
                    $(`#TaskTarget${rowIndex}`).removeAttr("disabled");
                }
            }
            
        }
    },
    ParseDateInput: function (dateStr) {
        //const [day, month, year] = dateStr.split('-').map(Number);
        //var dt = new Date(year, month - 1, day);

        var dtinpt = new Date(dateStr);

        const options = {
            timeZone: 'Asia/Jakarta', // GMT+7 timezone
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Use 24-hour format
        };

        const gmtPlus7Time = dtinpt.toLocaleString('en-US', options);

        return gmtPlus7Time;
    },
    ShowDateInput: function (data) {
        if (data === null || data === undefined) {
            return '';
        } else {
            const myDate = new Date(data);

            const options = {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            };

            // 'en-GB' locale (UK) typically gives '25 Jan 2025'
            const formattedString = myDate.toLocaleDateString('en-GB', options);
            return formattedString;

        }
    },
    CheckValidDate: function (dateStr) {
        // Check if the string is empty
        if (dateStr === null) {
            return false;
        }
        else if (!dateStr) {
            return false;
        }

        const strdt = TableProjectTask.ShowDateInput(dateStr);

        // Regular expression to match dd-MM-yyyy format
        const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
        const match = strdt.match(regex);

        if (!match) {
            return false;
        }

        const day = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        const year = parseInt(match[3], 10);

        // Check for valid date ranges
        if (month < 1 || month > 12 || day < 1 || day > 31) {
            return false;
        }

        // Check for valid days in month
        const date = new Date(year, month - 1, day);
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    },
    CheckEligible: function (datarow,currentstage,typefield) {
        let isValid = true;

        if (Data.ModelProject.ProjectHeader.ProjectStatus == "HOLD") {
            isValid = false;
        } else if (Data.ModelProject.ProjectHeader.ProjectStatus == "REJECT") {
            isValid = false;
        }
        else if (parseFloat(datarow.ProjectTaskSeq) < currentstage) {
            isValid = false;
        }
        else if (parseFloat(datarow.ProjectTaskSeq) > (currentstage + 1000)) {
            if (typefield == "Actual") {
                isValid = false;
            }
            // Check Apakah Creator
            else if (Data.ModelProject.ProjectHeader.CreatedBy != $("#LoginUserNameSystem").val()
                && PICList.filter(x => x.PicAssignment == $("#LoginUserNameSystem").val()
                    && x.PicDept == "OWNER").length < 1
            ) {
                //console.log($("#LoginUserNameSystem").val())
                //console.log(Data.ModelProject.ProjectHeader.CreatedBy)

                //console.log(`masuk sini yo ${datarow.ProjectTaskSeq}`)
                // Check Apakah Eligible PIC
                if (PICList.filter(f => f.PicAssignment == $("#LoginUserNameSystem").val()
                    && f.PicDept == datarow.ProjectTaskPic).length < 1) {
                    isValid = false;
                }
            }
        }
        else if (parseFloat(datarow.ProjectTaskSeq) > currentstage && parseFloat(datarow.ProjectTaskSeq) < (currentstage + 1000)) {
            if (Data.ModelProject.ProjectHeader.CreatedBy == $("#LoginUserNameSystem").val()) {
                isValid = true;
            } else if (PICList.filter(x => x.PicAssignment == $("#LoginUserNameSystem").val()
                && x.PicDept == "OWNER").length > 0) {
                isValid = true;
            } else if (datarow.ProjectTaskPic == $("#usrDept").val() || datarow.ProjectTaskPic == $("#usrRoleLogin").val()) {
                isValid = true;
            } else {
                isValid = false;
            }
        }

        return isValid;
    }
}

var TableProjectPIC = {
    Render: function (dataPIC) {
        if ($.fn.DataTable.isDataTable('#taskListPIC')) {
            PICTable.destroy();
        }

        if (dataPIC === null || dataPIC === undefined || dataPIC.length < 1) {
            dataPIC = [];
        }

        PICList = dataPIC;

        var oTabledataPIC = $('#taskListPIC').DataTable({
            "data": dataPIC,
            "dom": 'rtip',
            "columns": [
                { "data": "ProjectPicid", "visible": false },
                { "data": "ProjectId", "visible": false },
                { "data": "PicDept" },
                { "data": "PicAssignment" },
                {
                    "data": null,
                    render: function (data, type, row, meta) {
                        var str = '';

                        if ((Data.ModelProject.ProjectHeader.ProjectStatus == "DRAFT"
                            || Data.ModelProject.ProjectHeader.ProjectStatus == "REVISE") && row.PicDept != "OWNER") {
                            str = `<button type="button" class='btn btn-warning btn-sm' onclick='TableProjectPIC.Edit(this)'${btnActionStat}><i class="fas fa-pencil-alt me-1"></i></button>`;

                            if (TaskSimulationData.filter(f => f.ProjectTaskPic == row.PicDept
                                && f.ProjectTaskReq.toString().toLowerCase() == "mandatory").length < 1 && row.CreatedBy != "AutoGenerate") {
                                str = str + `&nbsp;&nbsp; <button type="button" class='btn btn-danger btn-sm' onclick='TableProjectPIC.Delete(this)' ${btnActionStat}><i class="fas fa-trash me-1"></i></button>`;
                            }
                        }
                        

                        return str;
                    }
                }
            ],
            "paging": false,
            "searching": false,
            "ordering": false,
            "info": false,
            "autoWidth": false
        });


        PICTable = oTabledataPIC

        if (dataPIC.length < 1) {
            $('#tblPIC').hide();
        } else {
            $('#tblPIC').show();
        }
    },
    Edit: function (button) {
        var row = $(button).closest('tr');
        var data = PICTable.row(row).data();

        if (data) {
            SelectedPIC = data;

            $(".select2-modal").select2({
                width: "100%",
                dropdownParent: $("#ProjectPICModal")
            });

            $('#ProjectPICId').val(data.ProjectPicid);
            $('#PICDept').val(data.PicDept).trigger("change");
            $('#PICAssignment').val(data.PicAssignment).trigger("change");

            $('#PICDept').attr('disabled', true);

            $('#ProjectPICModal').modal('toggle');
        } else {
            clsGlobal.swalWarning("Data Not Found!");
        }

    },
    Delete: function (button) {
        var row = $(button).closest('tr');
        var data = PICTable.row(row).data();
        if (data) {
            Swal.fire({
                title: "Are you sure to Delete data?",
                icon: "warning",
                showCancelButton: true,
                showDenyButton: false,
                showConfirmButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                buttonsStyling: true,
                customClass: {
                    confirmButton: 'btn btn-primary',
                    cancelButton: 'btn btn-secondary'
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    SelectedPIC = {};

                    SelectedPIC = data;

                    Data.ModelProject.ProjectPic = [];
                    Data.ModelProject.ProjectPic.push(SelectedPIC);

                    $.ajax({
                        type: "POST",
                        url: "/I2MS/RemoveProjectPIC",
                        data: {
                            req: Data.ModelProject,
                            __RequestVerificationToken: $('#PICTaskModalForm input[name=__RequestVerificationToken]').val()
                        },
                        datatype: "json",
                        success: function (retDat, status, xhr) {
                            clsGlobal.hideLoading();
                            if (xhr.responseText.includes("!DOCTYPE html")) {
                                clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                            }
                            else {
                                if (retDat.bitSuccess == true) {
                                    clsGlobal.swalSuccess("Success To Deleted Data !");
                                    TableProjectPIC.Render(JSON.parse(retDat.objData));
                                }
                                else {
                                    if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                        clsGlobal.swalWarning(retDat.txtMessage);
                                    }
                                    else {
                                        clsGlobal.swalError(retDat.txtMessage);
                                    }
                                }
                            }
                        },
                        error: function (xhr, status, error) {
                            clsGlobal.hideLoading();
                            clsGlobal.swalError(xhr.responseText);
                        }
                    });

                }
            });
        }
    },
    Add: function () {
        var newId = crypto.randomUUID();
        SelectedPIC = {};
        SelectedPIC.PicDept = "";
        SelectedPIC.PicAssignment = "";
        SelectedPIC.ProjectPicid = newId;
        SelectedPIC.ProjectId = Data.ModelProject.ProjectHeader.ProjectId;
        SelectedPIC.CreatedBy = "";
        SelectedPIC.CreatedDate = new Date();
        SelectedPIC.UpdatedBy = "";
        SelectedPIC.UpdatedDate = new Date();

        $(".select2-modal").select2({
            width: "100%",
            dropdownParent: $("#ProjectPICModal")
        });
        $('#PICDept').removeAttr('disabled');

        $('#ProjectPICId').val(newId);
        $('#PICDept').val('').trigger("change");
        $('#PICAssignment').val('').trigger("change"); 
        $('#ProjectPICModal').modal('toggle');
    },
    Save: function () {
        SelectedPIC.PicDept = $('#PICDept').val();
        SelectedPIC.PicAssignment = $('#PICAssignment').val();

        if (!SelectedPIC.PicDept)
        {
            clsGlobal.swalWarning("Please Fill PIC Dept !");
            return;
        } else if (!SelectedPIC.PicAssignment) {
            clsGlobal.swalWarning("Please Fill PIC !");
            return;
        }


        Data.ModelProject.ProjectPic = [];
        Data.ModelProject.ProjectPic.push(SelectedPIC);

        if (PICList.filter(f => f.PicDept == SelectedPIC.PicDept && f.PicAssignment != ""
            && f.PicAssignment == SelectedPIC.PicAssignment && $('#ProjectPICId').val() != f.ProjectPicid).length > 0
            ) {
            clsGlobal.swalWarning("Duplicate PIC & Dept detected, please select another pic or dept !");
        } else {
            $.ajax({
                type: "POST",
                url: "/I2MS/UpdateProjectPIC",
                data: {
                    req: Data.ModelProject,
                    __RequestVerificationToken: $('#PICTaskModalForm input[name=__RequestVerificationToken]').val()
                },
                datatype: "json",
                success: function (retDat, status, xhr) {
                    clsGlobal.hideLoading();
                    if (xhr.responseText.includes("!DOCTYPE html")) {
                        clsGlobal.swalWarningRedirect("You're Session has been Ended, Please Re-Login !", window.location.href);
                    }
                    else {
                        if (retDat.bitSuccess == true) {
                            $('#ProjectPICModal').modal('toggle');
                            clsGlobal.swalSuccess("Success to save Data !");
                            TableProjectPIC.Render(JSON.parse(retDat.objData));
                        }
                        else {
                            if (retDat.txtMessage == 'Validation' || retDat.txtMessage == 'gagal') {
                                clsGlobal.swalWarning(retDat.txtMessage);
                            }
                            else {
                                clsGlobal.swalError(retDat.txtMessage);
                            }
                        }
                    }
                },
                error: function (xhr, status, error) {
                    clsGlobal.hideLoading();
                    clsGlobal.swalError(xhr.responseText);
                }
            });
        }

        
    }
}

var Helper = {
    RemoveElementFromArray: function (value, arr) {
        arr = arr.filter(item => item !== value);
    },
    IsElementExistsInArray: function (value, arr) {
        var isExist = false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == value) {
                isExist = true;
                break;
            }
        }
        return isExist;
    },
    setRadioValue: function (name, value) {
        document.querySelectorAll(`input[type="radio"][name="${name}"]`).forEach(rb => {
            rb.checked = (rb.value === value);

        })
        if (name == "ConceptType") {
            const conceptRadios = document.querySelectorAll('input[name="ConceptType"]');
            ProjectHeader.ConceptRadio(conceptRadios, conceptOrder, null);
        }
       
    },
    OnlyNumberRegex: function (event, id = "") {
        const numericRegex = /^[0-9.]$/;
        const inputValue = event.key;

        if (!numericRegex.test(inputValue)) {
            event.preventDefault();
        }
    },
    AllNumericFormat: function (event, id, type = "") {
        let val = $(`#${id}`).val();
        if (val != "") {
            let fltrTtk = val.split("").filter(x => x === ".");

            if (fltrTtk.length > 1) {
                $(`#${id}`).val(null);
                return clsGlobal.setMessageWarning("Please Input Valid Format, only input one dot (.)");
            }

            if (type == 'Currency') {
                if (id == 'servingSuggestion') {
                    // Validation Greater Than 0
                    if (Helper.AllGraterThanO(id)) {
                        $(`#${id}`).val(null);
                    }
                    else {
                        let formatedVal = numeral(val).format(',.00');
                        $(`#${id}`).val(formatedVal);
                    }
                }
                else if (id == 'density') {
                    // Validation Greater Than 0
                    if (Helper.AllGraterThanO(id)) {
                        $(`#${id}`).val(null);
                    }
                    else {
                        let formatedVal = numeral(val).format(',.00');
                        $(`#${id}`).val(formatedVal);
                    }
                }
                else {
                    let formatedVal = numeral(val).format(',.00');
                    $(`#${id}`).val(formatedVal);
                }
            }
            else if (type == 'Percent') {
                if (parseFloat(val) > 100) {
                    $(`#${id}`).val(null);
                    return clsGlobal.setMessageWarning("Value COGS must be in range of 1 - 100");
                }

                if (id == 'servingSuggestion') {
                    // Validation Greater Than 0
                    if (Helper.AllGraterThanO(id)) {
                        $(`#${id}`).val(null);
                    }
                    else {
                        let formatedVal = numeral(val).format(',.00');
                        $(`#${id}`).val(formatedVal);
                    }
                }
                else if (id == 'density') {
                    // Validation Greater Than 0
                    if (Helper.AllGraterThanO(id)) {
                        $(`#${id}`).val(null);
                    }
                    else {
                        let formatedVal = numeral(val).format(',.00');
                        $(`#${id}`).val(formatedVal);
                    }
                }
                else {
                    let formatedVal = numeral(val).format(',.00');
                    $(`#${id}`).val(formatedVal);
                }
            }
            else if (type == 'CustomFiveDigit') {
                if (parseFloat(val) >= 1000000) {
                    $(`#${id}`).val(null);
                    
                    return clsGlobal.setMessageWarning(`Value ${$(`#${id}`).attr('name')} must be in range of 1 - 999999.99`);
                }

                if (id == 'servingSuggestion') {
                    // Validation Greater Than 0
                    if (Helper.AllGraterThanO(id)) {
                        $(`#${id}`).val(null);
                    }
                    else {
                        let formatedVal = numeral(val).format(',.00');
                        $(`#${id}`).val(formatedVal);
                    }
                }
                else if (id == 'density') {
                    // Validation Greater Than 0
                    if (Helper.AllGraterThanO(id)) {
                        $(`#${id}`).val(null);
                    }
                    else {
                        let formatedVal = numeral(val).format(',.00');
                        $(`#${id}`).val(formatedVal);
                    }
                }
                else {
                    let formatedVal = numeral(val).format(',.00');
                    $(`#${id}`).val(formatedVal);
                }
            }
            else if (type == 'CustomTwoDigit') {
                if (parseFloat(val) >= 100) {
                    $(`#${id}`).val(null);
                    return clsGlobal.setMessageWarning(`Value ${$(`#${id}`).attr('name')} must be in range of 1 - 99.99`);
                }

                if (id == 'servingSuggestion') {
                    // Validation Greater Than 0
                    if (Helper.AllGraterThanO(id)) {
                        $(`#${id}`).val(null);
                    }
                    else {
                        let formatedVal = numeral(val).format(',.00');
                        $(`#${id}`).val(formatedVal);
                    }
                }
                else if (id == 'density') {
                    // Validation Greater Than 0
                    if (Helper.AllGraterThanO(id)) {
                        $(`#${id}`).val(null);
                    }
                    else {
                        let formatedVal = numeral(val).format(',.00');
                        $(`#${id}`).val(formatedVal);
                    }
                }
                else {
                    let formatedVal = numeral(val).format(',.00');
                    $(`#${id}`).val(formatedVal);
                }
                
            }
            else {
                $(`#${id}`).val(val);
            }
        }
        else {
            $(`#${id}`).val(val);
        }
    },
    AllGraterThanO: function (id) {
        let val = $(`#${id}`).val();
        
        if (parseFloat(val) == 0) {
            clsGlobal.setMessageWarning(`Value ${$(`#${id}`).attr('name')} cannot be 0. If uncertain, please use 1`);
            return true;
        }
    },
    setActiveTab: function (targetId) {
        const tabTrigger = document.querySelector(`button[data-bs-target="${targetId}"]`);
        if (tabTrigger) {
            const tab = new bootstrap.Tab(tabTrigger);
            tab.show();
        }
    }
}