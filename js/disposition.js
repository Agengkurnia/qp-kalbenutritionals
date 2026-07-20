/**
 * Disposition Module
 * Handles Sample Purpose type review and modification before RM Evaluation
 */

const disposition = {
    data: {
        systemNo: null,
        samplePurposeId: null,
        currentType: null,
        samplePurpose: null,
        documentSample: null,
        rmCategories: [],
        rmSubGroups: [],
        uomList: [],
        itemList: []
    },

    /**
     * Initialize the disposition module
     */
    init: function () {
        console.log('Initializing Disposition module...');

        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        this.data.systemNo = urlParams.get('systemNo');

        if (!this.data.systemNo) {
            alert('System No is required');
            window.location.href = 'NewRMSampleIndex.html';
            return;
        }

        // Set hidden field
        $('#hdnSystemNo').val(this.data.systemNo);

        // Load data
        this.loadData();

        // Bind events
        this.bindEvents();
    },

    /**
     * Load all required data
     */
    loadData: async function () {
        try {
            // Show loading
            this.showLoading();

            // Load RM Evaluation Header
            const headerData = await this.loadRMEvaluationHeader();

            // Load Sample Purpose
            const samplePurposeData = await this.loadSamplePurpose(headerData.intSamplePurposeID);

            // Load Document Sample
            const documentSampleData = await this.loadDocumentSample(samplePurposeData.txtSampleNo);

            // Load master data
            await Promise.all([
                this.loadRMCategories(),
                this.loadUOMList()
            ]);

            // Populate form
            this.populateForm(samplePurposeData, documentSampleData);

            // Check if already disposed
            await this.checkExistingDisposition();

            // Hide loading
            this.hideLoading();

        } catch (error) {
            console.error('Error loading data:', error);
            alert('Error loading data: ' + error.message);
            this.hideLoading();
        }
    },

    /**
     * Load RM Evaluation Header
     */
    loadRMEvaluationHeader: function () {
        return new Promise((resolve, reject) => {
            // TODO: Replace with actual API call
            // For now, using mock data
            const mockData = {
                intSystemNo: this.data.systemNo,
                intSamplePurposeID: 123,
                txtDocNo: 'RME/2026/01/00001'
            };
            resolve(mockData);
        });
    },

    /**
     * Load Sample Purpose data
     */
    loadSamplePurpose: function (samplePurposeId) {
        return new Promise((resolve, reject) => {
            this.data.samplePurposeId = samplePurposeId;
            $('#hdnSamplePurposeId').val(samplePurposeId);

            // TODO: Replace with actual API call
            const mockData = {
                intSamplePurposeId: samplePurposeId,
                txtSamplePurposeNo: 'SP/2026/01/00123',
                txtSampleNo: 'DS/2026/01/00456',
                txtSamplePurposeType: 'Existing Material',
                txtItemCode: 'R1234567',
                txtItemCodeTrial: null,
                txtItemDescription: 'Whey Protein Concentrate 80%',
                txtRMCategoryCode: 'F',
                txtRMCategoryName: 'Food',
                txtRMSubGroupCode: 'DAIRY',
                txtRMSubGroupName: 'Dairy Products',
                txtUomCode: 'KG',
                dtSamplePurposeDate: '2026-01-27'
            };

            this.data.samplePurpose = mockData;
            this.data.currentType = mockData.txtSamplePurposeType;
            $('#hdnCurrentType').val(mockData.txtSamplePurposeType);
            $('#hdnOldItemCode').val(mockData.txtItemCode || '');
            $('#hdnOldItemCodeTrial').val(mockData.txtItemCodeTrial || '');

            resolve(mockData);
        });
    },

    /**
     * Load Document Sample data
     */
    loadDocumentSample: function (sampleNo) {
        return new Promise((resolve, reject) => {
            // TODO: Replace with actual API call
            const mockData = {
                txtSampleNo: sampleNo,
                txtSupplierMaterialName: 'Whey Protein Concentrate 80%',
                txtSupplierName: 'ABC Dairy Inc.',
                txtPrincipalName: 'XYZ Corporation',
                dtDocSampleDate: '2026-01-15'
            };

            this.data.documentSample = mockData;
            resolve(mockData);
        });
    },

    /**
     * Load RM Categories
     */
    loadRMCategories: function () {
        return new Promise((resolve, reject) => {
            // TODO: Replace with actual API call
            const mockData = [
                { code: 'F', name: 'Food' },
                { code: 'N', name: 'Non-Food' },
                { code: 'P', name: 'Packaging' }
            ];

            this.data.rmCategories = mockData;

            // Populate dropdown
            const $select = $('#ddlRMCategory');
            $select.empty().append('<option value="">Select RM Category</option>');
            mockData.forEach(item => {
                $select.append(`<option value="${item.code}">${item.name}</option>`);
            });

            resolve(mockData);
        });
    },

    /**
     * Load RM Sub Groups based on category
     */
    loadRMSubGroups: function (categoryCode) {
        return new Promise((resolve, reject) => {
            // TODO: Replace with actual API call
            const mockData = [
                { code: 'DAIRY', name: 'Dairy Products' },
                { code: 'SWEET', name: 'Sweeteners' },
                { code: 'FLAVOR', name: 'Flavors' }
            ];

            this.data.rmSubGroups = mockData;

            // Populate dropdown
            const $select = $('#ddlRMSubGroup');
            $select.empty().append('<option value="">Select RM Sub Group</option>');
            mockData.forEach(item => {
                $select.append(`<option value="${item.code}">${item.name}</option>`);
            });

            resolve(mockData);
        });
    },

    /**
     * Load UOM List
     */
    loadUOMList: function () {
        return new Promise((resolve, reject) => {
            // TODO: Replace with actual API call
            const mockData = [
                { code: 'KG', name: 'Kilogram' },
                { code: 'L', name: 'Liter' },
                { code: 'PCS', name: 'Pieces' }
            ];

            this.data.uomList = mockData;

            // Populate dropdown
            const $select = $('#ddlUom');
            $select.empty().append('<option value="">Select UOM</option>');
            mockData.forEach(item => {
                $select.append(`<option value="${item.code}">${item.name}</option>`);
            });

            resolve(mockData);
        });
    },

    /**
     * Check if disposition already exists
     */
    checkExistingDisposition: function () {
        return new Promise((resolve, reject) => {
            // TODO: Replace with actual API call to check tRMEvaluationDisposition
            resolve(null);
        });
    },

    /**
     * Populate form with loaded data
     */
    populateForm: function (samplePurpose, documentSample) {
        // Populate header info
        $('#lblSamplePurposeNo').text(samplePurpose.txtSamplePurposeNo);
        $('#lblSampleNo').text(samplePurpose.txtSampleNo);
        $('#lblMaterialName').text(documentSample.txtSupplierMaterialName);
        $('#lblSupplier').text(documentSample.txtSupplierName);
        $('#lblDate').text(this.formatDate(samplePurpose.dtSamplePurposeDate));
        $('#lblCurrentType').text(samplePurpose.txtSamplePurposeType);

        // Set current values in form
        $('#ddlRMCategory').val(samplePurpose.txtRMCategoryCode);
        this.loadRMSubGroups(samplePurpose.txtRMCategoryCode).then(() => {
            $('#ddlRMSubGroup').val(samplePurpose.txtRMSubGroupCode);
        });
    },

    /**
     * Bind event handlers
     */
    bindEvents: function () {
        const self = this;

        // Radio button change
        $('input[name="dispositionAction"]').on('change', function () {
            const action = $(this).val();
            self.handleActionChange(action);
        });

        // New type dropdown change
        $('#ddlNewType').on('change', function () {
            const newType = $(this).val();
            self.handleTypeChange(newType);
        });

        // RM Category change
        $('#ddlRMCategory').on('change', function () {
            const categoryCode = $(this).val();
            if (categoryCode) {
                self.loadRMSubGroups(categoryCode);
            }
        });

        // RM Sub Group change (trigger item code generation for New Ingredients)
        $('#ddlRMSubGroup').on('change', function () {
            const subGroupCode = $(this).val();
            const newType = $('#ddlNewType').val();
            if (newType === 'New Ingredients' && subGroupCode) {
                self.generateItemCodeTrial();
            }
        });

        // Search item button
        $('#btnSearchItem').on('click', function () {
            self.openItemLOV();
        });

        // Item search in modal
        $('#txtSearchItem').on('keyup', function () {
            self.filterItemLOV($(this).val());
        });
    },

    /**
     * Handle action change (Keep vs Change)
     */
    handleActionChange: function (action) {
        if (action === 'keep') {
            $('#divChangeSection').slideUp();
            $('#hdnIsChanged').val('false');
            this.updateSummary('keep');
        } else if (action === 'change') {
            $('#divChangeSection').slideDown();
            $('#hdnIsChanged').val('true');
            this.updateSummary('change');
        }
    },

    /**
     * Handle type change (New Ingredients vs Existing Material)
     */
    handleTypeChange: function (newType) {
        if (newType === 'New Ingredients') {
            $('#divNewIngredientsForm').slideDown();
            $('#divExistingMaterialForm').slideUp();
            this.generateItemCodeTrial();
        } else if (newType === 'Existing Material') {
            $('#divNewIngredientsForm').slideUp();
            $('#divExistingMaterialForm').slideDown();
        }
        this.updateSummary('change', newType);
    },

    /**
     * Generate Item Code Trial
     */
    generateItemCodeTrial: function () {
        const categoryCode = $('#ddlRMCategory').val();
        const subGroupCode = $('#ddlRMSubGroup').val();

        if (!categoryCode || !subGroupCode) {
            return;
        }

        // TODO: Replace with actual API call
        // Mock generation: Y + category first letter + subgroup code + running number
        const mockItemCode = 'Y' + categoryCode.substring(0, 1) + subGroupCode + '0001';
        $('#txtItemCodeTrial').val(mockItemCode);
    },

    /**
     * Open Item LOV Modal
     */
    openItemLOV: function () {
        // TODO: Load item list from API
        const mockItems = [
            { code: 'R1234567', description: 'Whey Protein Concentrate 80%', category: 'Dairy', uom: 'KG' },
            { code: 'R1234568', description: 'Milk Powder Full Cream', category: 'Dairy', uom: 'KG' },
            { code: 'R1234569', description: 'Sugar White Refined', category: 'Sweetener', uom: 'KG' }
        ];

        this.data.itemList = mockItems;
        this.renderItemLOV(mockItems);

        $('#modalItemLOV').modal('show');
    },

    /**
     * Render Item LOV table
     */
    renderItemLOV: function (items) {
        const $tbody = $('#tbodyItemLOV');
        $tbody.empty();

        items.forEach(item => {
            const row = `
                <tr>
                    <td>${item.code}</td>
                    <td>${item.description}</td>
                    <td>${item.category}</td>
                    <td>${item.uom}</td>
                    <td>
                        <button class="btn btn-sm btn-primary btn-select-item" 
                            data-code="${item.code}" 
                            data-description="${item.description}"
                            data-uom="${item.uom}">
                            Select
                        </button>
                    </td>
                </tr>
            `;
            $tbody.append(row);
        });

        // Bind select button
        $('.btn-select-item').on('click', function () {
            const code = $(this).data('code');
            const description = $(this).data('description');
            const uom = $(this).data('uom');

            $('#txtItemCode').val(code);
            $('#txtItemDescription').val(description);
            $('#txtUom').val(uom);

            $('#modalItemLOV').modal('hide');
        });
    },

    /**
     * Filter Item LOV
     */
    filterItemLOV: function (searchText) {
        const filtered = this.data.itemList.filter(item =>
            item.code.toLowerCase().includes(searchText.toLowerCase()) ||
            item.description.toLowerCase().includes(searchText.toLowerCase())
        );
        this.renderItemLOV(filtered);
    },

    /**
     * Update summary section
     */
    updateSummary: function (action, newType = null) {
        const $summary = $('#summaryContent');

        if (action === 'keep') {
            $summary.html(`
                <p class="mb-0">
                    <i class="fas fa-check-circle text-success me-2"></i>
                    You will continue with the current Sample Purpose type: 
                    <strong>${this.data.currentType}</strong>
                </p>
            `);
        } else if (action === 'change' && newType) {
            $summary.html(`
                <p class="mb-2">
                    <i class="fas fa-exchange-alt text-warning me-2"></i>
                    You are changing the Sample Purpose type:
                </p>
                <ul class="mb-0">
                    <li>From: <strong>${this.data.currentType}</strong></li>
                    <li>To: <strong>${newType}</strong></li>
                </ul>
                <p class="mt-2 mb-0 text-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <small>This change will be recorded in the audit trail</small>
                </p>
            `);
        }
    },

    /**
     * Validate form before save
     */
    validate: function () {
        const isChanged = $('#hdnIsChanged').val() === 'true';

        if (!isChanged) {
            return true; // No validation needed if keeping current type
        }

        // Validate new type
        const newType = $('#ddlNewType').val();
        if (!newType) {
            alert('Please select new type');
            return false;
        }

        // Validate reason
        const reason = $('#txtChangeReason').val().trim();
        if (!reason) {
            alert('Please provide reason for change');
            return false;
        }

        // Validate RM Category & Sub Group
        const category = $('#ddlRMCategory').val();
        const subGroup = $('#ddlRMSubGroup').val();
        if (!category || !subGroup) {
            alert('Please select RM Category and Sub Group');
            return false;
        }

        // Type-specific validation
        if (newType === 'New Ingredients') {
            const description = $('#txtItemTrialDescription').val().trim();
            const uom = $('#ddlUom').val();
            if (!description) {
                alert('Please provide item description for new ingredient');
                return false;
            }
            if (!uom) {
                alert('Please select UOM');
                return false;
            }
        } else if (newType === 'Existing Material') {
            const itemCode = $('#txtItemCode').val().trim();
            if (!itemCode) {
                alert('Please select existing item');
                return false;
            }
        }

        return true;
    },

    /**
     * Save draft
     */
    saveDraft: function () {
        if (!this.validate()) {
            return;
        }

        const data = this.collectFormData();
        data.status = 'draft';

        console.log('Saving draft:', data);

        // TODO: Implement actual save API call
        alert('Draft saved successfully');
    },

    /**
     * Save and continue to evaluation
     */
    saveAndContinue: function () {
        if (!this.validate()) {
            return;
        }

        const data = this.collectFormData();
        data.status = 'completed';

        console.log('Saving disposition:', data);

        // TODO: Implement actual save API call
        // On success, redirect to evaluation detail
        alert('Disposition saved successfully. Redirecting to evaluation...');

        // Redirect to evaluation detail
        window.location.href = `NewRMSampleDetail.html?systemNo=${this.data.systemNo}&step=3`;
    },

    /**
     * Collect form data
     */
    collectFormData: function () {
        const isChanged = $('#hdnIsChanged').val() === 'true';

        const data = {
            intSystemNo: this.data.systemNo,
            intSamplePurposeId: this.data.samplePurposeId,
            txtOldSamplePurposeType: this.data.currentType,
            txtOldItemCode: $('#hdnOldItemCode').val(),
            txtOldItemCodeTrial: $('#hdnOldItemCodeTrial').val(),
            bitIsChanged: isChanged
        };

        if (isChanged) {
            const newType = $('#ddlNewType').val();
            data.txtNewSamplePurposeType = newType;
            data.txtChangeReason = $('#txtChangeReason').val();
            data.txtRMCategoryCode = $('#ddlRMCategory').val();
            data.txtRMSubGroupCode = $('#ddlRMSubGroup').val();

            if (newType === 'New Ingredients') {
                data.txtNewItemCodeTrial = $('#txtItemCodeTrial').val();
                data.txtItemTrialDescription = $('#txtItemTrialDescription').val();
                data.txtUomCode = $('#ddlUom').val();
            } else if (newType === 'Existing Material') {
                data.txtNewItemCode = $('#txtItemCode').val();
            }
        } else {
            data.txtNewSamplePurposeType = this.data.currentType;
            data.txtNewItemCode = $('#hdnOldItemCode').val();
            data.txtNewItemCodeTrial = $('#hdnOldItemCodeTrial').val();
        }

        return data;
    },

    /**
     * Go back to sample purpose
     */
    goBack: function () {
        if (confirm('Are you sure you want to go back? Unsaved changes will be lost.')) {
            window.location.href = 'NewRMSampleIndex.html';
        }
    },

    /**
     * Format date
     */
    formatDate: function (dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    },

    /**
     * Show loading
     */
    showLoading: function () {
        // TODO: Implement loading overlay
        console.log('Loading...');
    },

    /**
     * Hide loading
     */
    hideLoading: function () {
        // TODO: Hide loading overlay
        console.log('Loading complete');
    }
};

// Initialize when DOM is ready
$(document).ready(function () {
    disposition.init();
});
