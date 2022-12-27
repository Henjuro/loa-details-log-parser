import{a as f}from"./chunk-7S6EEVSW.mjs";import{a as b,b as y,c as S,d as D,e as L,f as T,g as H,h as E,i as I,j as P,k as $,l as w}from"./chunk-DVFNLLFI.mjs";import{a as k}from"./chunk-WSJANNVG.mjs";import{cloneDeep as n}from"lodash";import{EventEmitter as R}from"events";function A(){return{id:0,name:"",totalDamage:0,maxDamage:0,hits:{casts:0,total:0,crit:0,backAttack:0,frontAttack:0,counter:0},breakdown:[]}}function o(){return{lastUpdate:0,id:"",npcId:0,name:"",class:"",classId:0,isPlayer:!1,isDead:!1,deaths:0,deathTime:0,gearScore:0,currentHp:0,maxHp:0,damageDealt:0,healingDone:0,shieldDone:0,damageTaken:0,skills:{},hits:{casts:0,total:0,crit:0,backAttack:0,frontAttack:0,counter:0}}}var N=class extends R{resetTimer;debugLines;isLive;dontResetOnZoneChange;resetAfterPhaseTransition;splitOnPhaseTransition;removeOverkillDamage;phaseTransitionResetRequest;phaseTransitionResetRequestTime;game;encounters;healSources;constructor(a=!1){super(),this.resetTimer=null,this.debugLines=!1,this.isLive=a,this.dontResetOnZoneChange=!1,this.resetAfterPhaseTransition=!1,this.splitOnPhaseTransition=!1,this.removeOverkillDamage=!0,this.phaseTransitionResetRequest=!1,this.phaseTransitionResetRequestTime=0,this.resetState(),this.encounters=[],this.isLive&&setInterval(this.broadcastStateChange.bind(this),100)}resetState(a=""){this.debugLines&&this.emit("log",{type:"debug",message:"Resetting state"});let e=n(this.game),t=+new Date,i={};if(this.game&&a!==""){let s=this.game.entities[this.game.localPlayer];s?i[this.game.localPlayer]={...o(),id:a,name:s.name,class:s.class,classId:s.classId,isPlayer:s.isPlayer,gearScore:s.gearScore}:(this.game.localPlayer="You",i[this.game.localPlayer]={...o(),id:a,name:"You",isPlayer:!0})}this.game={startedOn:t,lastCombatPacket:t,fightStartedOn:0,localPlayer:this.game?.localPlayer??"",entities:i,damageStatistics:{totalDamageDealt:0,topDamageDealt:0,totalDamageTaken:0,topDamageTaken:0,totalHealingDone:0,topHealingDone:0,totalShieldDone:0,topShieldDone:0}},this.healSources=[],this.emit("reset-state",e)}softReset(){this.resetTimer=null;let a=n(this.game.entities);this.resetState();for(let e of Object.values(a))+new Date-e.lastUpdate>10*60*1e3||this.updateEntity(e.name,{name:e.name,npcId:e.npcId,class:e.class,classId:e.classId,isPlayer:e.isPlayer,gearScore:e.gearScore,maxHp:e.maxHp,currentHp:e.currentHp})}cancelReset(){this.resetTimer&&clearTimeout(this.resetTimer),this.resetTimer=null}splitEncounter(a="",e=!1){let t=n(this.game);t.fightStartedOn!=0&&(t.damageStatistics.totalDamageDealt!=0||t.damageStatistics.totalDamageTaken)&&this.encounters.push(t),e?this.softReset():this.resetState(a)}broadcastStateChange(){let a=n(this.game);Object.values(a.entities).forEach(e=>{Object.values(e.skills).forEach(t=>{t.breakdown=[]})}),this.emit("state-change",a)}parseLogLine(a){if(!a)return;let e=a.trim().split("|");if(e.length<1||!e[0])return;let t=k(e[0]);try{switch(t){case 0:this.onMessage(e);break;case 1:this.onInitEnv(e);break;case 2:this.onPhaseTransition(e);break;case 3:this.onNewPc(e);break;case 4:this.onNewNpc(e);break;case 5:this.onDeath(e);break;case 6:this.onSkillStart(e);break;case 7:this.onSkillStage(e);break;case 8:this.onDamage(e);break;case 9:this.onHeal(e);break;case 10:this.onBuff(e);break;case 12:this.onCounterattack(e);break}}catch(i){this.emit("log",{type:"error",message:i})}}updateEntity(a,e){let t={lastUpdate:+new Date},i;return a in this.game.entities?i={...o(),...this.game.entities[a],...e,...t}:i={...o(),...e,...t},this.game.entities[a]=i,i}onMessage(a){let e=new b(a);this.debugLines&&this.emit("log",{type:"debug",message:`onMessage: ${e.message}`}),e.message.startsWith("Arguments:")||this.emit("message",e.message)}onInitEnv(a){let e=new y(a);this.debugLines&&this.emit("log",{type:"debug",message:"onInitEnv"}),this.isLive?this.dontResetOnZoneChange===!1&&this.resetTimer==null&&(this.debugLines&&this.emit("log",{type:"debug",message:"Setting a reset timer"}),this.resetTimer=setTimeout(this.softReset.bind(this),6e3),this.emit("message","new-zone")):(this.splitEncounter(e.playerId),this.emit("message","new-zone"))}onPhaseTransition(a){let e=new S(a);this.debugLines&&this.emit("log",{type:"debug",message:`onPhaseTransition: ${e.phaseCode}`}),this.isLive&&(this.emit("message",`phase-transition-${e.phaseCode}`),this.resetAfterPhaseTransition&&(this.phaseTransitionResetRequest=!0,this.phaseTransitionResetRequestTime=+new Date)),!this.isLive&&this.splitOnPhaseTransition&&this.splitEncounter("",!0)}onNewPc(a){let e=new D(a);if(this.debugLines&&this.emit("log",{type:"debug",message:`onNewPc: ${e.id}, ${e.name}, ${e.classId}, ${e.class}, ${e.gearScore}, ${e.currentHp}, ${e.maxHp}`}),this.game&&this.game.localPlayer!==""){let t=this.game.entities[this.game.localPlayer];t&&t.id===e.id&&(delete this.game.entities[this.game.localPlayer],this.game.localPlayer=e.name)}this.updateEntity(e.name,{id:e.id,name:e.name,class:e.class,classId:e.classId,isPlayer:!0,...e.gearScore&&e.gearScore!=0&&{gearScore:e.gearScore},currentHp:e.currentHp,maxHp:e.maxHp})}onNewNpc(a){let e=new L(a);this.debugLines&&this.emit("log",{type:"debug",message:`onNewNpc: ${e.id}, ${e.name}, ${e.currentHp}, ${e.maxHp}`}),this.updateEntity(e.name,{id:e.id,name:e.name,npcId:e.npcId,isPlayer:!1,currentHp:e.currentHp,maxHp:e.maxHp})}onDeath(a){let e=new T(a);this.debugLines&&this.emit("log",{type:"debug",message:`onDeath: ${e.name} ${e.killerName}`});let t=this.game.entities[e.name],i=0;t?t.isDead?i=t.deaths:i=t.deaths+1:i=1,this.updateEntity(e.name,{name:e.name,isDead:!0,deathTime:+e.timestamp,deaths:i})}onSkillStart(a){let e=new H(a);this.debugLines&&this.emit("log",{type:"debug",message:`onSkillStart: ${e.id}, ${e.name}, ${e.skillId}, ${e.skillName}`});let t=f[e.skillName];t&&this.healSources.push({source:e.name,expires:+e.timestamp+t.duration}),this.updateEntity(e.name,{name:e.name,isDead:!1});let i=this.game.entities[e.name];if(i){i.hits.casts+=1;let s=i.skills[e.skillName];s||(s={...A(),id:e.skillId,name:e.skillName},i.skills[e.skillName]=s,s.hits.casts+=1)}}onSkillStage(a){let e=new E(a);this.debugLines&&this.emit("log",{type:"debug",message:`onSkillStage: ${e.name}, ${e.skillId}, ${e.skillName}, ${e.skillStage}`})}onDamage(a){if(a.length<13)return;let e=new I(a);this.debugLines&&this.emit("log",{type:"debug",message:`onDamage: ${e.id}, ${e.name}, ${e.skillId}, ${e.skillName}, ${e.skillEffectId}, ${e.skillEffect}, ${e.targetId}, ${e.targetName}, ${e.damage}, ${e.currentHp}, ${e.maxHp}`}),this.phaseTransitionResetRequest&&this.phaseTransitionResetRequestTime>0&&this.phaseTransitionResetRequestTime<+new Date-13500&&(this.softReset(),this.phaseTransitionResetRequest=!1),this.updateEntity(e.name,{id:e.id,name:e.name}),this.updateEntity(e.targetName,{id:e.targetId,name:e.targetName,currentHp:e.currentHp,maxHp:e.maxHp});let t=this.game.entities[e.name],i=this.game.entities[e.targetName];if(!t||!i)return;!i.isPlayer&&this.removeOverkillDamage&&e.currentHp<0&&(e.damage=e.damage+e.currentHp),e.skillId===0&&e.skillEffectId!==0&&(e.skillId=e.skillEffectId,e.skillName=e.skillEffect);let s=t.skills[e.skillName];s||(s={...A(),id:e.skillId,name:e.skillName},t.skills[e.skillName]=s);let r=e.damageModifier&15,m=(e.damageModifier>>4&7)-1;if(e.skillName==="Bleed"&&e.damage>1e7||e.skillName==="Bleed"&&r===11)return;let g=r===1||r===8,c=m===0,h=m===1,d=g?1:0,u=c?1:0,p=h?1:0;if(s.totalDamage+=e.damage,e.damage>s.maxDamage&&(s.maxDamage=e.damage),t.damageDealt+=e.damage,i.damageTaken+=e.damage,e.skillName!=="Bleed"&&(t.hits.total+=1,t.hits.crit+=d,t.hits.backAttack+=u,t.hits.frontAttack+=p,s.hits.total+=1,s.hits.crit+=d,s.hits.backAttack+=u,s.hits.frontAttack+=p),t.isPlayer){this.game.damageStatistics.totalDamageDealt+=e.damage,this.game.damageStatistics.topDamageDealt=Math.max(this.game.damageStatistics.topDamageDealt,t.damageDealt);let x={timestamp:+e.timestamp,damage:e.damage,targetEntity:i.id,isCrit:g,isBackAttack:c,isFrontAttack:h};s.breakdown.push(x)}i.isPlayer&&(this.game.damageStatistics.totalDamageTaken+=e.damage,this.game.damageStatistics.topDamageTaken=Math.max(this.game.damageStatistics.topDamageTaken,i.damageTaken)),this.game.fightStartedOn===0&&(this.game.fightStartedOn=+e.timestamp),this.game.lastCombatPacket=+e.timestamp}onHeal(a){let e=new P(a);this.debugLines&&this.emit("log",{type:"debug",message:`onHeal: ${e.id}, ${e.name}, ${e.healAmount}`});let t="";for(let s of this.healSources)if(s.expires>=+e.timestamp){t=s.source;break}if(!t)return;let i=this.updateEntity(t,{name:t});i.healingDone+=e.healAmount,i.isPlayer&&(this.game.damageStatistics.totalHealingDone+=e.healAmount,this.game.damageStatistics.topHealingDone=Math.max(this.game.damageStatistics.topHealingDone,i.healingDone))}onBuff(a){let e=new $(a);if(this.debugLines&&this.emit("log",{type:"debug",message:`onBuff: ${e.id}, ${e.name}, ${e.buffId}, ${e.buffName}, ${e.sourceId}, ${e.sourceName}, ${e.shieldAmount}`}),e.shieldAmount&&e.isNew){let t=this.updateEntity(e.name,{name:e.name});t.shieldDone+=e.shieldAmount,t.isPlayer&&(this.game.damageStatistics.totalShieldDone+=e.shieldAmount,this.game.damageStatistics.topShieldDone=Math.max(this.game.damageStatistics.topShieldDone,t.shieldDone))}}onCounterattack(a){let e=new w(a);this.debugLines&&this.emit("log",{type:"debug",message:`onCounterattack: ${e.id}, ${e.name}`});let t=this.updateEntity(e.name,{name:e.name});t.hits.counter+=1}};export{N as a};
