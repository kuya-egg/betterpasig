import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
const root=process.argv[2]??'data';
function count(value){if(!value||typeof value!=='object')return 0;if(Array.isArray(value))return value.reduce((n,item)=>n+count(item),0);return Number(value.verify===true)+Object.values(value).reduce((n,item)=>n+count(item),0);}
const files={};for(const name of readdirSync(root).filter(name=>name.endsWith('.json')).sort())files[name]=count(JSON.parse(readFileSync(join(root,name),'utf8').replace(/^\uFEFF/,'')));
console.log(JSON.stringify({files,total:Object.values(files).reduce((a,b)=>a+b,0)},null,2));
