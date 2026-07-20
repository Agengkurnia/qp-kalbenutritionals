// Navigation and Disposition Handler Functions
// Add these functions to the app object before the closing brace

// Copy and paste this code into app.js before the closing brace }; (around line 1171)

// Navigation Functions
nextStep() {
    if (this.currentStep < 4) {
        // Hide current step
        const currentSection = document.getElementById(`step${this.currentStep}`);
        if (currentSection) currentSection.classList.remove('active');

        // Show next step
        this.currentStep++;
        const nextSection = document.getElementById(`step${this.currentStep}`);
        if (nextSection) nextSection.classList.add('active');

        this.updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
},

prevStep() {
    if (this.currentStep > 1) {
        // Hide current step
        const currentSection = document.getElementById(`step${this.currentStep}`);
        if (currentSection) currentSection.classList.remove('active');

        // Show previous step
        this.currentStep--;
        const prevSection = document.getElementById(`step${this.currentStep}`);
        if (prevSection) prevSection.classList.add('active');

        this.updateProgress();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
},

updateProgress() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index < this.currentStep - 1) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (index === this.currentStep - 1) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
        }
    });

    // Update button visibility
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const btnSubmit = document.getElementById('btnSubmit');

    if (btnPrev) btnPrev.style.display = this.currentStep === 1 ? 'none' : 'inline-block';
    if (btnNext) btnNext.style.display = this.currentStep === 4 ? 'none' : 'inline-block';
    if (btnSubmit) btnSubmit.style.display = this.currentStep === 4 ? 'inline-block' : 'none';
},

saveDraft() {
    Swal.fire({
        title: 'Saving Draft...',
        text: 'Your progress is being saved',
        timer: 1500,
        didOpen: () => {
            Swal.showLoading();
        }
    }).then(() => {
        Swal.fire({
            title: 'Saved!',
            text: 'Draft saved successfully',
            icon: 'success',
            customClass: {
                confirmButton: 'btn btn-success'
            },
            buttonsStyling: false
        });
    });
},

submit() {
    Swal.fire({
        title: 'Submit Complete?',
        text: 'Are you sure you want to submit this RM Sample?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, submit it!',
        cancelButtonText: 'No, cancel',
        customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-danger ms-1'
        },
        buttonsStyling: false
    }).then((result) => {
        if (result.value) {
            Swal.fire({
                title: 'Good job!',
                text: 'RM Sample submitted successfully! Status: Pending Approval',
                icon: 'success',
                customClass: {
                    confirmButton: 'btn btn-success'
                },
                buttonsStyling: false
            });
        }
    });
},

// Disposition Step Handlers
handleDispositionAction() {
    const action = document.querySelector('input[name="dispositionAction"]:checked')?.value;
    const changeSection = document.getElementById('divChangeSection');
    const summaryContent = document.getElementById('dispositionSummaryContent');

    if (!changeSection || !summaryContent) return;

    if (action === 'keep') {
        changeSection.style.display = 'none';
        summaryContent.innerHTML = '<p class="mb-0"><i class="fas fa-check-circle text-success me-2"></i>You will continue with the current Sample Purpose type.</p>';
    } else if (action === 'change') {
        changeSection.style.display = 'block';
        this.updateDispositionSummary();
    }
},

handleTypeChange() {
    const newType = document.getElementById('ddlNewType')?.value;
    const newIngredientsForm = document.getElementById('divNewIngredientsForm');
    const existingMaterialForm = document.getElementById('divExistingMaterialForm');

    if (!newIngredientsForm || !existingMaterialForm) return;

    if (newType === 'New Ingredients') {
        newIngredientsForm.style.display = 'block';
        existingMaterialForm.style.display = 'none';
        const itemCodeTrial = document.getElementById('txtItemCodeTrial');
        if (itemCodeTrial) itemCodeTrial.value = 'Y1234567';
    } else if (newType === 'Existing Material') {
        newIngredientsForm.style.display = 'none';
        existingMaterialForm.style.display = 'block';
    } else {
        newIngredientsForm.style.display = 'none';
        existingMaterialForm.style.display = 'none';
    }

    this.updateDispositionSummary();
},

updateDispositionSummary() {
    const newType = document.getElementById('ddlNewType')?.value;
    const summaryContent = document.getElementById('dispositionSummaryContent');
    const currentTypeEl = document.getElementById('dispCurrentType');

    if (!summaryContent) return;

    const currentType = currentTypeEl?.textContent || 'Unknown';

    if (newType) {
        summaryContent.innerHTML = `
                <p class="mb-2"><i class="fas fa-exchange-alt text-warning me-2"></i>You are changing the Sample Purpose type:</p>
                <ul class="mb-0">
                    <li>From: <strong>${currentType}</strong></li>
                    <li>To: <strong>${newType}</strong></li>
                </ul>
                <p class="mt-2 mb-0 text-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <small>This change will be recorded in the audit trail</small>
                </p>
            `;
    } else {
        summaryContent.innerHTML = '<p class="mb-0"><i class="fas fa-info-circle text-info me-2"></i>Please select new type to continue.</p>';
    }
},

searchExistingItem() {
    Swal.fire({
        title: 'Search Existing Item',
        text: 'Item search functionality will be implemented here',
        icon: 'info',
        customClass: {
            confirmButton: 'btn btn-primary'
        },
        buttonsStyling: false
    });
}

// PASTE THE ABOVE CODE BEFORE THE CLOSING }; OF THE app OBJECT
