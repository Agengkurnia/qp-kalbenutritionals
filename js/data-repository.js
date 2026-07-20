/**
 * Data Repository for Project Identity Prototype
 * Handles data loading from JSON and synchronization with LocalStorage
 */

const STORAGE_KEY = 'rmselection_project_identity_data';
const JSON_URL = '../../../Data/projects.json';

// Inline fallback data (used when fetch fails, e.g. on file:// protocol)
const SEED_DATA = [
    {
        "id": "PI-2026-001", "docDate": "2026-02-10", "status": "Waiting Approval",
        "productGroup": "Dairy Products", "projectType": "NEW PRODUCT", "potsType": "Local",
        "supplier": "PT. Indofood Sukses Makmur", "itemCodePM": "PM-882910", "itemDesc": "Premium Milk Packaging v2",
        "refDoc": "itemSpec", "refDocNo": "SPEC-2026-005",
        "pics": [{ "dept": "Packaging Dev", "assignee": "Ageng" }, { "dept": "Regulatory Affairs", "assignee": "Ibnu" }],
        "documents": [{ "name": "Spec Sheet v1.pdf", "size": 102400 }], "approvalHistory": []
    },
    {
        "id": "PI-2026-002", "docDate": "2026-02-11", "status": "Draft",
        "productGroup": "Beverages", "projectType": "Cost Saving", "potsType": "Import",
        "supplier": "Global Packaging Solutions", "itemCodePM": "PM-1002", "itemDesc": "Cap 38mm Blue",
        "refDoc": "pmEval", "refDocNo": "PME-2024-005",
        "pics": [{ "dept": "Packaging Dev", "assignee": "Siti Rahma" }],
        "documents": [], "approvalHistory": []
    },
    {
        "id": "PI-2026-003", "docDate": "2026-02-09", "status": "Approved",
        "productGroup": "Snacks", "projectType": "Alternative Supplier", "potsType": "Local",
        "supplier": "Local Pack Ind", "itemCodePM": "PM-1003", "itemDesc": "Label Shrink 250ml",
        "refDoc": "itemSpec", "refDocNo": "IS-2024-001",
        "pics": [{ "dept": "R&D", "assignee": "Budi Santoso" }, { "dept": "QA", "assignee": "Ahmad Dani" }],
        "documents": [{ "name": "Lab Test Result.pdf", "size": 1200000 }],
        "approvalHistory": [
            { "step": "Packaging Dev", "action": "Approved", "user": "Ageng", "date": "2026-02-10 10:00", "comment": "Okay" },
            { "step": "Regulatory", "action": "Approved", "user": "Ibnu", "date": "2026-02-10 14:00", "comment": "Compliant" }
        ]
    },
    {
        "id": "PI-2026-004", "docDate": "2026-02-08", "status": "Rejected",
        "productGroup": "Dairy", "projectType": "NEW PRODUCT", "potsType": "Local",
        "supplier": "PT. Ultra Jaya", "itemCodePM": "PM-554123", "itemDesc": "UHT Carton 1L",
        "refDoc": "itemSpec", "refDocNo": "SPEC-2025-999",
        "pics": [{ "dept": "Packaging Dev", "assignee": "Ageng" }],
        "documents": [{ "name": "Draft Design.png", "size": 3000000 }],
        "approvalHistory": [{ "step": "Packaging Dev", "action": "Rejected", "user": "Manager A", "date": "2026-02-09 09:00", "comment": "Design mismatch with specs." }]
    },
    {
        "id": "PI-2026-005", "docDate": "2026-02-12", "status": "Draft",
        "productGroup": "Confectionery", "projectType": "NEW PRODUCT", "potsType": "Import",
        "supplier": "Sweet Wrappers Ltd", "itemCodePM": "PM-7721", "itemDesc": "Candy Wrapper Gold",
        "refDoc": "itemSpec", "refDocNo": "IS-2024-002",
        "pics": [], "documents": [], "approvalHistory": []
    },
    {
        "id": "PI-2026-006", "docDate": "2026-02-05", "status": "Waiting Approval",
        "productGroup": "Beverages", "projectType": "Redesign", "potsType": "Local",
        "supplier": "Glass Maker Co.", "itemCodePM": "PM-3321", "itemDesc": "Glass Bottle 330ml",
        "refDoc": "pmEval", "refDocNo": "PME-2024-008",
        "pics": [{ "dept": "Procurement", "assignee": "John Doe" }, { "dept": "Packaging Dev", "assignee": "Siti Rahma" }],
        "documents": [{ "name": "Technical Drawing.dwg", "size": 5000000 }], "approvalHistory": []
    },
    {
        "id": "PI-2026-007", "docDate": "2026-02-01", "status": "Approved",
        "productGroup": "Noodles", "projectType": "Cost Saving", "potsType": "Local",
        "supplier": "Plastindo", "itemCodePM": "PM-1122", "itemDesc": "Noodle Cup PP",
        "refDoc": "itemSpec", "refDocNo": "SPEC-2026-001",
        "pics": [{ "dept": "R&D", "assignee": "Budi Santoso" }],
        "documents": [{ "name": "Cost Benefit Analysis.xlsx", "size": 25000 }],
        "approvalHistory": [{ "step": "R&D", "action": "Approved", "user": "Budi Santoso", "date": "2026-02-02 11:30", "comment": "Approved." }]
    },
    {
        "id": "PI-2026-008", "docDate": "2026-02-11", "status": "Draft",
        "productGroup": "Dairy", "projectType": "Standard", "potsType": "Local",
        "supplier": "Sumber Packaging", "itemCodePM": "PM-5510", "itemDesc": "Milk Bottle Cap 28mm",
        "refDoc": "itemSpec", "refDocNo": "",
        "pics": [], "documents": [], "approvalHistory": []
    },
    {
        "id": "PI-2026-009", "docDate": "2026-02-10", "status": "Waiting Approval",
        "productGroup": "Snacks", "projectType": "NEW PRODUCT", "potsType": "Local",
        "supplier": "Chip Master", "itemCodePM": "PM-9900", "itemDesc": "Potato Chip Bag 50g",
        "refDoc": "itemSpec", "refDocNo": "IS-2024-001",
        "pics": [{ "dept": "Marketing", "assignee": "Sarah J." }],
        "documents": [{ "name": "Marketing Brief.docx", "size": 15000 }], "approvalHistory": []
    },
    {
        "id": "PI-2026-010", "docDate": "2026-01-20", "status": "Closed",
        "productGroup": "General", "projectType": "Legacy", "potsType": "Local",
        "supplier": "Old Vendor", "itemCodePM": "PM-0001", "itemDesc": "Legacy Item",
        "refDoc": "pmEval", "refDocNo": "Old-Ref-001",
        "pics": [], "documents": [{ "name": "Archive.zip", "size": 10000000 }], "approvalHistory": []
    },
    {
        "id": "PI-2026-011", "docDate": "2026-03-01", "status": "Waiting Approval",
        "productGroup": "Personal Care", "projectType": "Redesign", "potsType": "Import",
        "supplier": "PT. Unilever Indonesia", "itemCodePM": "PM-4401", "itemDesc": "Shampoo Bottle 200ml Refill",
        "refDoc": "itemSpec", "refDocNo": "SPEC-2026-010",
        "pics": [{ "dept": "Marketing", "assignee": "Dina K." }, { "dept": "Packaging Dev", "assignee": "Ageng" }],
        "documents": [{ "name": "Design Brief v3.pdf", "size": 4200000 }], "approvalHistory": []
    },
    {
        "id": "PI-2026-012", "docDate": "2026-03-02", "status": "Draft",
        "productGroup": "Frozen Food", "projectType": "NEW PRODUCT", "potsType": "Local",
        "supplier": "Cryo Pack Solutions", "itemCodePM": "PM-6612", "itemDesc": "Frozen Meal Tray 350g",
        "refDoc": "itemSpec", "refDocNo": "",
        "pics": [{ "dept": "Product Dev", "assignee": "Rudi H." }],
        "documents": [], "approvalHistory": []
    },
    {
        "id": "PI-2026-013", "docDate": "2026-03-03", "status": "Approved",
        "productGroup": "Beverages", "projectType": "Cost Saving", "potsType": "Local",
        "supplier": "PT. Aqua Indonesia", "itemCodePM": "PM-2201", "itemDesc": "Water Cup 240ml",
        "refDoc": "pmEval", "refDocNo": "PME-2025-012",
        "pics": [{ "dept": "Procurement", "assignee": "Hendra W." }],
        "documents": [{ "name": "Vendor Audit Report.pdf", "size": 870000 }],
        "approvalHistory": [
            { "step": "Procurement", "action": "Approved", "user": "Hendra W.", "date": "2026-03-04 08:45", "comment": "Vendor cleared." },
            { "step": "QA", "action": "Approved", "user": "Ahmad Dani", "date": "2026-03-04 13:00", "comment": "Quality verified." }
        ]
    },
    {
        "id": "PI-2026-014", "docDate": "2026-03-04", "status": "Rejected",
        "productGroup": "Confectionery", "projectType": "Alternative Supplier", "potsType": "Import",
        "supplier": "Foil Masters GmbH", "itemCodePM": "PM-8831", "itemDesc": "Chocolate Foil Wrap 500m Roll",
        "refDoc": "itemSpec", "refDocNo": "IS-2025-007",
        "pics": [{ "dept": "R&D", "assignee": "Budi Santoso" }],
        "documents": [{ "name": "Sample Test.pdf", "size": 320000 }],
        "approvalHistory": [{ "step": "R&D", "action": "Rejected", "user": "Budi Santoso", "date": "2026-03-05 10:15", "comment": "Sample failed barrier test." }]
    },
    {
        "id": "PI-2026-015", "docDate": "2026-03-05", "status": "Waiting Approval",
        "productGroup": "Noodles", "projectType": "Standard", "potsType": "Local",
        "supplier": "Mie Master Pack", "itemCodePM": "PM-3398", "itemDesc": "Instant Noodle Pouch 85g",
        "refDoc": "itemSpec", "refDocNo": "SPEC-2026-015",
        "pics": [{ "dept": "Product Dev", "assignee": "Anugerah" }, { "dept": "QA", "assignee": "Ahmad Dani" }],
        "documents": [{ "name": "Artwork Final.ai", "size": 7800000 }], "approvalHistory": []
    },
    {
        "id": "PI-2026-016", "docDate": "2026-03-06", "status": "Draft",
        "productGroup": "Dairy Products", "projectType": "Redesign", "potsType": "Local",
        "supplier": "PT. Frisian Flag", "itemCodePM": "PM-5544", "itemDesc": "Cheese Slice Wrapper 10pcs",
        "refDoc": "itemSpec", "refDocNo": "",
        "pics": [], "documents": [], "approvalHistory": []
    },
    {
        "id": "PI-2026-017", "docDate": "2026-03-07", "status": "Approved",
        "productGroup": "Personal Care", "projectType": "Cost Saving", "potsType": "Import",
        "supplier": "EcoPack Taiwan", "itemCodePM": "PM-7760", "itemDesc": "Body Lotion Tube 150ml",
        "refDoc": "pmEval", "refDocNo": "PME-2025-020",
        "pics": [{ "dept": "Procurement", "assignee": "John Doe" }],
        "documents": [{ "name": "Compliance Cert.pdf", "size": 540000 }],
        "approvalHistory": [{ "step": "Procurement", "action": "Approved", "user": "John Doe", "date": "2026-03-08 09:00", "comment": "Compliant with spec." }]
    },
    {
        "id": "PI-2026-018", "docDate": "2026-03-08", "status": "Draft",
        "productGroup": "Frozen Food", "projectType": "NEW PRODUCT", "potsType": "Local",
        "supplier": "PT. So Good Food", "itemCodePM": "PM-9011", "itemDesc": "Chicken Nugget Box 400g",
        "refDoc": "itemSpec", "refDocNo": "",
        "pics": [{ "dept": "Marketing", "assignee": "Dina K." }],
        "documents": [], "approvalHistory": []
    }
];

class DataRepository {
    constructor() {
        this.data = [];
    }

    /**
     * Initialize data: Load from LocalStorage, fetch from JSON, or use inline seed data
     */
    async init() {
        const storedData = localStorage.getItem(STORAGE_KEY);

        if (storedData) {
            console.log('Data loaded from LocalStorage');
            this.data = JSON.parse(storedData);
        } else {
            console.log('Data not found in LocalStorage, fetching from JSON...');
            try {
                const response = await fetch(JSON_URL);
                if (!response.ok) throw new Error('Failed to load JSON data');
                this.data = await response.json();
                this.save();
                console.log('Data fetched and saved to LocalStorage');
            } catch (error) {
                console.warn('Fetch failed, using inline seed data:', error.message);
                this.data = JSON.parse(JSON.stringify(SEED_DATA)); // deep clone
                this.save();
            }
        }
        return this.data;
    }

    /**
     * Get all projects
     */
    getAll() {
        return this.data;
    }

    /**
     * Get project by ID
     */
    getById(id) {
        return this.data.find(item => item.id === id);
    }

    /**
     * Add or Update project
     */
    saveProject(project) {
        const index = this.data.findIndex(item => item.id === project.id);

        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...project };
        } else {
            this.data.push(project);
        }

        this.save();
    }

    /**
     * Delete project by ID
     */
    deleteProject(id) {
        this.data = this.data.filter(item => item.id !== id);
        this.save();
    }

    /**
     * Persist current data state to LocalStorage
     */
    save() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    }

    /**
     * Reset data to initial seed state (Clear LocalStorage)
     */
    async reset() {
        localStorage.removeItem(STORAGE_KEY);
        await this.init();
    }
}

// Export singleton instance
const repository = new DataRepository();
// Expose to window for inline scripts
window.ProjectRepository = repository;
