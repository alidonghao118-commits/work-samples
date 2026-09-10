import { parseCSV, cleanData } from './sku-core.mjs';

const messages = new Map([
  ['请使用 1 MB 以内的 CSV。', 'Use a CSV file under 1 MB.'],
  ['CSV 引号位置有误，请从表格软件重新导出 CSV。', 'A quote is out of place. Export the CSV again from your spreadsheet app.'],
  ['CSV 引号后应为逗号或换行。', 'A closing quote must be followed by a comma or a new line.'],
  ['CSV 存在未闭合的引号。', 'A quoted CSV field is missing its closing quote.'],
  ['请加入表头和至少一条商品记录。', 'Include a header row and at least one product record.'],
  ['在线版每次处理 200 条记录，可分批整理。', 'This demo handles up to 200 records at a time. Split a larger file into batches.'],
  ['请为每列填写唯一的表头。', 'Give every column a unique, nonempty header.'],
  ['在线版每次处理 10 个字段。', 'This demo handles up to 10 columns.'],
  ['部分记录的字段数量与表头不同，请先核对逗号与引号。', 'Some rows have a different number of fields from the header. Check their commas and quotes.'],
  ['请选择 SKU 字段。', 'Choose the SKU column.'],
  ['每项用途请选择不同字段。', 'Choose a different column for each field.'],
  ['补充 SKU', 'Missing SKU'],
  ['同 SKU 字段冲突', 'Conflicting values for this SKU'],
  ['补充商品名称', 'Missing product name'],
  ['确认单位', 'Review unit'],
  ['确认价格', 'Review price'],
  ['确认库存', 'Review stock'],
]);

// The shared core uses canonical Chinese units. Only mapped unit cells are
// adapted; source data, SKU strings, headers and other columns stay intact.
const incomingUnits = {
  pc: '个', ea: '个', each: '个', unit: '个', units: '个',
  kilogram: '千克', kilograms: '千克', gram: '克', grams: '克',
  boxes: '盒', strip: '条', strips: '条', book: '本', books: '本',
  item: '件', items: '件', set: '套', sets: '套', pack: '包', packs: '包',
  bottle: '瓶', bottles: '瓶',
};
const outgoingUnits = {
  个: 'piece', 千克: 'kg', 克: 'g', 盒: 'box', 条: 'strip', 本: 'book',
  件: 'item', 套: 'set', 包: 'pack', 瓶: 'bottle',
};

const englishError = error => new Error(messages.get(error.message) ?? error.message);

export function parseEnglishCSV(text) {
  try { return parseCSV(text); } catch (error) { throw englishError(error); }
}

export function cleanEnglishData(data, map) {
  try {
    const normalized = {
      headers: data.headers,
      rows: data.rows.map(row => row.map((value, column) => {
        if (column !== map.unit) return value;
        const unit = value.trim().toLowerCase();
        return Object.hasOwn(incomingUnits, unit) ? incomingUnits[unit] : value;
      })),
    };
    const result = cleanData(normalized, map);
    return {
      ...result,
      records: result.records.map(record => ({
        ...record,
        values: record.values.map((value, column) =>
          column === map.unit && Object.hasOwn(outgoingUnits, value) ? outgoingUnits[value] : value),
        issues: record.issues.map(issue => messages.get(issue) ?? issue),
      })),
    };
  } catch (error) { throw englishError(error); }
}

// Presentation-only export: English report columns, with the same formula
// protection as the shared exporter. JSON retains original source values.
export function exportEnglishCSV(result, issuesOnly = false) {
  const quote = value => '"' + String(value)
    .replace(/^[\s]*[=+\-@\t\r]/, "'$&").replaceAll('"', '""') + '"';
  const rows = [
    [...result.headers, 'Source records', 'Status', 'Review notes'],
    ...result.records.filter(record => !issuesOnly || record.issues.length).map(record => [
      ...record.values, record.sources.join(' / '),
      record.issues.length ? 'Needs review' : 'Cleaned', record.issues.join('; '),
    ]),
  ];
  return '\uFEFF' + rows.map(row => row.map(quote).join(',')).join('\r\n');
}

export const sampleCSV = `SKU,Product name,Unit,Price,Stock
0001,Glass tumbler,pcs,12.50,8
 0001 , Glass tumbler ,piece,12.50,8
0002,Dinner plate,piece,20,0
0003,Rice,kg,12,5
0004,Towel,piece,,10
0005,Gel pen,pcs,2,20
0005,Gel pen,piece,3,20
,Notebook,piece,4,9
0006,Printer paper,box,10,-1
0007,Paper clip,piece,1,100`;

export const fieldAliases = {
  sku: ['sku', 'product code', 'item code', 'product id', 'item id', '商品编码', '货号'],
  name: ['product name', 'product', 'name', 'title', 'item name', '商品名称', '名称'],
  unit: ['unit', 'units', 'uom', 'unit of measure', '单位'],
  price: ['price', 'unit price', 'selling price', '单价', '价格'],
  stock: ['stock', 'quantity', 'qty', 'inventory', 'stock quantity', '库存'],
};

export function mountTool() {
  const $ = id => document.getElementById(id);
  const fields = [['sku', 'SKU (required)'], ['name', 'Product name'], ['unit', 'Unit'], ['price', 'Price'], ['stock', 'Stock']];
  let data = null;
  let result = null;
  const exportButtons = ['csv', 'issues', 'json'];

  function reset() {
    data = null;
    result = null;
    ['clean', ...exportButtons].forEach(id => { $(id).disabled = true; });
    $('result').textContent = 'Your cleaned records will appear here.';
    $('mapping').replaceChildren();
  }

  function message(text, error = false) {
    $('status').textContent = text;
    $('status').classList.toggle('error', error);
  }

  $('input').addEventListener('input', () => {
    reset();
    message('Your data has changed. Read the columns again to continue.');
  });

  $('demo').onclick = () => {
    reset();
    $('input').value = sampleCSV;
    $('read').click();
  };

  $('read').onclick = () => {
    reset();
    try {
      data = parseEnglishCSV($('input').value);
      for (const [key, label] of fields) {
        const wrap = document.createElement('label');
        wrap.textContent = label;
        const select = document.createElement('select');
        select.id = 'map-' + key;
        select.append(new Option('Not selected', -1));
        data.headers.forEach((header, index) => select.append(new Option(header, index)));
        select.value = String(data.headers.findIndex(header => fieldAliases[key].includes(header.toLowerCase())));
        select.onchange = () => {
          result = null;
          exportButtons.forEach(id => { $(id).disabled = true; });
          $('result').textContent = 'Column choices changed. Clean the data again.';
          message('Check your column choices, then clean the data again.');
        };
        wrap.append(select);
        $('mapping').append(wrap);
      }
      $('clean').disabled = false;
      message(`Read ${data.rows.length} records. Check the column choices, then clean the data.`);
    } catch (error) { message(error.message, true); }
  };

  $('clean').onclick = () => {
    try {
      const map = Object.fromEntries(fields.map(([key]) => [key, Number($('map-' + key).value)]));
      result = cleanEnglishData(data, map);
      const table = document.createElement('table');
      const head = document.createElement('tr');
      [...result.headers, 'Source records', 'Review notes'].forEach(value => {
        const cell = document.createElement('th');
        cell.scope = 'col';
        cell.textContent = value;
        head.append(cell);
      });
      const thead = document.createElement('thead');
      thead.append(head);
      table.append(thead);
      const body = document.createElement('tbody');
      for (const record of result.records) {
        const row = document.createElement('tr');
        if (record.issues.length) row.className = 'issue';
        [...record.values, record.sources.join(' / '), record.issues.join('; ') || 'Cleaned'].forEach(value => {
          const cell = document.createElement('td');
          cell.textContent = value;
          row.append(cell);
        });
        body.append(row);
      }
      table.append(body);
      $('result').replaceChildren(table);
      const flagged = result.records.filter(record => record.issues.length).length;
      message(`${result.originalCount} source records → ${result.records.length} cleaned records. ${result.merged} duplicate merged; ${flagged} records need review.`);
      exportButtons.forEach(id => { $(id).disabled = false; });
    } catch (error) { message(error.message, true); }
  };

  function download(content, name, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  $('csv').onclick = () => download(exportEnglishCSV(result), 'products-cleaned.csv', 'text/csv;charset=utf-8');
  $('issues').onclick = () => download(exportEnglishCSV(result, true), 'products-needs-review.csv', 'text/csv;charset=utf-8');
  $('json').onclick = () => download(JSON.stringify({ source: data, result }, null, 2), 'products-complete-record.json', 'application/json');
}
