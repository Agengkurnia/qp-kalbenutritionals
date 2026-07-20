const fs = require('fs');

try {
    const html = fs.readFileSync('data dummy.txt', 'utf8');

    // Simple regex parsing since it's just a raw HTML dump
    const regexTr = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
    const regexTd = /<td[^>]*>([\s\S]*?)<\/td>/g;

    const data = [];
    let matchTr;

    while ((matchTr = regexTr.exec(html)) !== null) {
        const trContent = matchTr[1];
        let tds = [];
        let matchTd;
        
        // Custom properties for interfaceId
        let interfaceId = null;

        while ((matchTd = regexTd.exec(trContent)) !== null) {
            let innerHtml = matchTd[1];
            // Extract text from the cell
            let tdText = innerHtml.replace(/<[^>]*>/g, '').trim();
            // Try to extract an ID from any href or onclick
            let idMatch = innerHtml.match(/id=([^"&\s]*)/) || innerHtml.match(/'([^']{20,})'/); // look for query param or big hash string
            if (idMatch && !interfaceId) {
                // If the idMatch Group 1 is long enough, assume it's the interfaceId
                if (idMatch[1].length > 10) {
                     interfaceId = idMatch[1];
                }
            }
            tds.push(tdText);
        }
        
        // Expected columns:
        // 0: Document Status
        // 1: Item Template
        // 2: Item Code
        // 3: Description
        // 4: Primary UOM
        // 5: Created By
        // 6: Created Date
        // 7: Next Approver
        // 8: Action (might be empty text)
        if (tds.length >= 8 && tds[2] && tds[2].length > 0) {
            data.push({
                interfaceId: interfaceId || `dummyId_${Math.random().toString(36).substring(2)}`,
                status: tds[0],
                template: tds[1],
                itemCode: tds[2],
                itemDesc: tds[3],
                uom: tds[4],
                createdBy: tds[5],
                createdDate: tds[6],
                nextApprover: tds[7] || '-'
            });
        }
    }

    fs.writeFileSync('item_production.json', JSON.stringify(data, null, 2));
    console.log('Saved ' + data.length + ' records to item_production.json');
} catch (e) {
    console.error('Error parsing file:', e);
}
