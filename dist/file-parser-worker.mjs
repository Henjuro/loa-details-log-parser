import{a as P}from"./chunk-QMANBD4L.mjs";import"./chunk-7S6EEVSW.mjs";import"./chunk-DVFNLLFI.mjs";import"./chunk-WSJANNVG.mjs";import h from"dayjs";import{v4 as F}from"uuid";import a from"fs";import u from"path";import E from"dayjs/plugin/customParseFormat";h.extend(E);function N(c,T,j,l,e){try{let t=c.slice(0,-4),k=t+".json",m=a.readFileSync(u.join(j,c),"utf-8");if(!m)return e(null,"empty log");let r=new P(!1);T===!0&&(r.splitOnPhaseTransition=!0);let S=m.split(`
`).filter(n=>n!=null&&n!="");for(let n of S)r.parseLogLine(n);r.splitEncounter();let f=r.encounters;if(f.length>0){let n={encounters:[]};for(let o of f){let g=o.lastCombatPacket-o.fightStartedOn;if(g<=1e3)continue;let i={name:"",damageTaken:0,isPlayer:!1};for(let s of Object.values(o.entities))s.damageTaken>i.damageTaken&&(i={name:s.name,damageTaken:s.damageTaken,isPlayer:s.isPlayer});let p={duration:g,mostDamageTakenEntity:i},d=F(),y=`${t}_${d}_encounter.json`;n.encounters.push({encounterId:d,encounterFile:y,...p}),a.writeFileSync(u.join(l,y),JSON.stringify({...o,...p}))}return a.writeFileSync(u.join(l,k),JSON.stringify(n)),e(null,"log parsed")}return e(null,"no encounters found")}catch(t){return e(t,"log parser error")}}export{N as fileParserWorker};
