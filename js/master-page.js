class MasterPage {
    constructor() {
        this.count = 300;
    }

    initIndex(columnConfig, countOrData = 300) {
        // Wait for layout ready (scripts loaded)

        const table = document.querySelector('.table');
        if (!table) return;
        table.id = 'masterTable';

        // Determing data source
        let data = [];
        if (Array.isArray(countOrData)) {
            data = countOrData;
        } else {
            // Generate dummy data
            data = this.generateData(columnConfig, countOrData);
        }

        // Clear existing tbody
        const tbody = table.querySelector('tbody');
        if (tbody) tbody.innerHTML = '';

        // Add filter row to thead if not exists
        const thead = table.querySelector('thead');
        if (!thead.querySelector('.filter-row')) {
            const tr = thead.querySelector('tr');
            if (tr) {
                const filterRow = tr.cloneNode(true);
                filterRow.classList.add('filter-row');
                thead.appendChild(filterRow);
            }
        }

        // Initialize DataTable
        const dt = $(table).DataTable({
            data: data,
            columns: columnConfig.map(c => ({
                data: c.key,
                render: c.render || null,
                orderable: c.orderable !== false,
                searchable: c.searchable !== false,
                className: c.className || ''
            })),
            orderCellsTop: true,
            initComplete: function () {
                var api = this.api();

                // For each column
                api.columns().eq(0).each(function (colIdx) {
                    var cell = $('.filter-row th').eq(colIdx);
                    // Match title from regular header if possible, but filter-row is cloned so it has text
                    // Clear it first

                    // Check if action column
                    if (columnConfig[colIdx].searchable === false) {
                        cell.html('');
                        return;
                    }

                    cell.html('<input type="text" class="form-control form-control-sm" placeholder="Filter..." />');

                    // On every keypress in this input
                    $('input', cell)
                        .off('keyup change')
                        .on('keyup change', function (e) {
                            e.stopPropagation();

                            // Get the search value
                            $(this).attr('title', $(this).val());
                            var regexr = '({search})';

                            var cursorPosition = this.selectionStart;
                            // Search the column for that value
                            api
                                .column(colIdx)
                                .search(
                                    this.value != ''
                                        ? regexr.replace('{search}', '(((' + this.value + ')))')
                                        : '',
                                    this.value != '',
                                    this.value == ''
                                )
                                .draw();
                        })
                        .on('click', function (e) {
                            e.stopPropagation();
                        });
                });
            }
        });
    }

    generateData(config, count) {
        const data = [];
        for (let i = 1; i <= count; i++) {
            const row = {};
            config.forEach(col => {
                if (col.type === 'index') {
                    row[col.key] = i;
                } else if (col.type === 'code') {
                    row[col.key] = (col.prefix || 'CODE-') + String(i).padStart(3, '0');
                } else if (col.type === 'text') {
                    row[col.key] = (col.prefix || 'Item ') + i;
                } else if (col.type === 'date') {
                    row[col.key] = new Date(2024, 0, 1 + (i % 30)).toISOString().split('T')[0];
                } else if (col.type === 'bool') {
                    row[col.key] = Math.random() > 0.2; // 80% active
                } else if (col.type === 'action') {
                    row[col.key] = null;
                } else if (col.type === 'random-from') {
                    const opts = col.options || ['Option A', 'Option B'];
                    row[col.key] = opts[Math.floor(Math.random() * opts.length)];
                }
            });
            data.push(row);
        }
        return data;
    }

    // Standard renderers
    static renderActive(data, type, row) {
        if (type === 'display') {
            return `<input type="checkbox" class="form-check-input" ${data ? 'checked' : ''} disabled>`;
        }
        return data ? 'Active' : 'Inactive';
    }

    static renderAction(link) {
        return function (data, type, row) {
            return `<a href="${link}" class="btn btn-sm btn-icon btn-primary"><i class="fas fa-pencil-alt"></i></a>`;
        };
    }

    static renderActionsWithFunction(editLink, funcLink, label = 'Function') {
        return function (data, type, row) {
            return `
                <div class="d-flex justify-content-center gap-2">
                    <a href="${editLink}" class="btn btn-sm btn-primary"><i class="fas fa-pencil-alt me-1"></i> Edit</a>
                    <a href="${funcLink}" class="btn btn-sm btn-info"><i class="fas fa-network-wired me-1"></i> ${label}</a>
                </div>
            `;
        }
    }

    static renderBadge(data, type, row) {
        if (type === 'display') {
            let cls = 'bg-label-primary';
            if (['Approved', 'Completed', 'Active'].includes(data)) cls = 'bg-label-success';
            if (['Draft', 'Pending'].includes(data)) cls = 'bg-label-secondary';
            if (['Rejected', 'Revision Needed'].includes(data)) cls = 'bg-label-danger';
            if (['In Progress', 'Evaluation'].includes(data)) cls = 'bg-label-info';
            if (['Selection'].includes(data)) cls = 'bg-label-warning';
            return `<span class="badge ${cls}">${data}</span>`;
        }
        return data;
    }

    static renderDropdownAction(link) {
        return function (data, type, row) {
            return `
                <div class="dropdown">
                    <button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="fas fa-ellipsis-v"></i></button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="${link}"><i class="fas fa-eye me-1"></i> View</a>
                        <a class="dropdown-item" href="${link}"><i class="fas fa-edit me-1"></i> Edit</a>
                        <a class="dropdown-item" href="javascript:void(0);" class="text-danger"><i class="fas fa-trash me-1"></i> Delete</a>
                    </div>
                </div>
            `;
        }
    }
}
