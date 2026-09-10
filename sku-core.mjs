export function parseCSV(text) {
 if(text.length>1048576) throw new Error('请使用 1 MB 以内的 CSV。');
 text=text.replace(/^\uFEFF/,'');
 const rows=[]; let row=[],cell='',quoted=false,afterQuote=false;
 const endCell=()=>{row.push(cell);cell='';afterQuote=false;};
 const endRow=()=>{endCell();rows.push(row);row=[];};
 for(let i=0;i<text.length;i++){
  const c=text[i];
  if(quoted){if(c==='"'){if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;afterQuote=true;}}else cell+=c;continue;}
  if(c==='"'){if(cell || afterQuote)throw new Error('CSV 引号位置有误，请从表格软件重新导出 CSV。');quoted=true;}
  else if(c===',')endCell();
  else if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;endRow();}
  else {if(afterQuote)throw new Error('CSV 引号后应为逗号或换行。');cell+=c;}
 }
 if(quoted)throw new Error('CSV 存在未闭合的引号。');
 if(cell||row.length||afterQuote)endRow();
 while(rows.length&&rows.at(-1).every(v=>v===''))rows.pop();
 if(rows.length<2)throw new Error('请加入表头和至少一条商品记录。');
 if(rows.length>201)throw new Error('在线版每次处理 200 条记录，可分批整理。');
 const headers=rows.shift().map(v=>v.trim());
 if(headers.some(v=>!v)||new Set(headers).size!==headers.length)throw new Error('请为每列填写唯一的表头。');
 if(headers.length>10)throw new Error('在线版每次处理 10 个字段。');
 if(rows.some(r=>r.length!==headers.length))throw new Error('部分记录的字段数量与表头不同，请先核对逗号与引号。');
 return {headers,rows};
}
export const unitMap={pcs:'个',piece:'个',pieces:'个',个:'个',kg:'千克',千克:'千克',g:'克',克:'克',box:'盒',盒:'盒',条:'条',本:'本',件:'件',套:'套',包:'包',瓶:'瓶'};
export function cleanData(data, map){
 if(!Number.isInteger(map.sku)||map.sku<0||map.sku>=data.headers.length)throw new Error('请选择 SKU 字段。');
 const chosen=Object.values(map).filter(v=>v>=0);
 if(new Set(chosen).size!==chosen.length)throw new Error('每项用途请选择不同字段。');
 const groups=new Map();
 data.rows.forEach((r,i)=>{
  const values=r.map(v=>v.trim());
  if(map.unit>=0){const u=values[map.unit],key=u.toLowerCase();values[map.unit]=Object.hasOwn(unitMap,key)?unitMap[key]:u;}
  const key=JSON.stringify(values);
  if(groups.has(key))groups.get(key).sources.push(i+1);else groups.set(key,{values,sources:[i+1]});
 });
 const records=[...groups.values()],skuCounts=new Map();
 for(const r of records){const k=r.values[map.sku];if(k)skuCounts.set(k,(skuCounts.get(k)??0)+1);}
 for(const r of records){
  r.issues=[];const sku=r.values[map.sku];
  if(!sku)r.issues.push('补充 SKU');else if(skuCounts.get(sku)>1)r.issues.push('同 SKU 字段冲突');
  if(map.name>=0&&!r.values[map.name])r.issues.push('补充商品名称');
  if(map.unit>=0&&!Object.values(unitMap).includes(r.values[map.unit]))r.issues.push('确认单位');
  if(map.price>=0&&!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(r.values[map.price]))r.issues.push('确认价格');
  if(map.stock>=0&&!/^\d+$/.test(r.values[map.stock]))r.issues.push('确认库存');
 }
 return {headers:data.headers,records,originalCount:data.rows.length,merged:data.rows.length-records.length};
}
export function csvExport(result,issuesOnly=false){
 const quote=v=>'"'+String(v).replace(/^[\s]*[=+\-@\t\r]/,"'$&").replaceAll('"','""')+'"';
 const rows=[result.headers.concat(['来源记录','处理状态','待确认项']),...result.records.filter(r=>!issuesOnly||r.issues.length).map(r=>r.values.concat([r.sources.join(' / '),r.issues.length?'待确认':'已整理',r.issues.join('；')]))];
 return '\uFEFF'+rows.map(r=>r.map(quote).join(',')).join('\r\n');
}
