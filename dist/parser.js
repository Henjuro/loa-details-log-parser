"use strict";var L=Object.defineProperty;var O=Object.getOwnPropertyDescriptor;var G=Object.getOwnPropertyNames;var U=Object.prototype.hasOwnProperty;var M=(i,t)=>{for(var e in t)L(i,e,{get:t[e],enumerable:!0})},v=(i,t,e,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of G(t))!U.call(i,a)&&a!==e&&L(i,a,{get:()=>t[a],enumerable:!(s=O(t,a))||s.enumerable});return i};var B=i=>v(L({},"__esModule",{value:!0}),i);var K={};M(K,{LogParser:()=>E});module.exports=B(K);var m=require("lodash"),C=require("events");function r(i,t=0,e=10,s=!1){if(typeof i=="number")return isNaN(i)?t:i;let a;try{a=s?parseFloat(i):parseInt(i,e),isNaN(a)&&(a=t)}catch{a=t}return a}var o=class{lineSplit;timestamp;constructor(t){this.lineSplit=t,this.timestamp=new Date(this.lineSplit[1])}},g=class extends o{message;constructor(t){super(t),this.message=this.lineSplit[2]}},l=class extends o{playerId;constructor(t){super(t),this.playerId=t[2]}},c=class extends o{phaseCode;constructor(t){super(t),this.phaseCode=r(t[2])}},h=class extends o{id;name;classId;class;gearScore;currentHp;maxHp;constructor(t){super(t),this.id=t[2],this.name=t[3]||"Unknown Entity",this.classId=r(t[4]),this.class=t[5]||"UnknownClass",this.gearScore=r(t[7],0,10,!0),this.currentHp=r(t[8]),this.maxHp=r(t[9])}},d=class extends o{id;npcId;name;currentHp;maxHp;constructor(t){super(t),this.id=t[2],this.npcId=r(t[3]),this.name=t[4]||"Unknown Entity",this.currentHp=r(t[5]),this.maxHp=r(t[6])}},u=class extends o{id;name;killerId;killerName;constructor(t){super(t),this.id=t[2],this.name=t[3]||"Unknown Entity",this.killerId=t[4],this.killerName=t[5]||"Unknown Entity"}},k=class extends o{id;name;skillId;skillName;constructor(t){super(t),this.id=t[2],this.name=t[3]||"Unknown Entity",this.skillId=r(t[4]),this.skillName=t[5]||"Unknown Skill"}},f=class extends o{id;name;skillId;skillName;skillStage;constructor(t){super(t),this.id=t[2],this.name=t[3]||"Unknown Entity",this.skillId=t[4],this.skillName=t[5]||"Unknown Skill",this.skillStage=r(t[6])}},b=class extends o{id;name;skillId;skillName;skillEffectId;skillEffect;targetId;targetName;damage;damageModifier;currentHp;maxHp;constructor(t){super(t),this.id=t[2],this.name=t[3]||"Unknown Entity",this.skillId=r(t[4]),this.skillName=t[5]||"Unknown Skill",this.skillEffectId=r(t[6]),this.skillEffect=t[7],this.targetId=t[8],this.targetName=t[9]||"Unknown Entity",this.damage=r(t[10]),this.damageModifier=r(t[11],0,16),this.currentHp=r(t[12]),this.maxHp=r(t[13])}},p=class extends o{id;name;healAmount;constructor(t){super(t),this.id=t[2],this.name=t[3]||"Unknown Entity",this.healAmount=r(t[4])}},I=class extends o{id;name;buffId;buffName;isNew;sourceId;sourceName;shieldAmount;constructor(t){super(t),this.id=t[2],this.name=t[3]||"Unknown Entity",this.buffId=t[4],this.buffName=t[5],this.isNew=t[6]=="1",this.sourceId=t[7],this.sourceName=t[8]||"Unknown Entity",this.shieldAmount=r(t[9])}},T=class extends o{id;name;constructor(t){super(t),this.id=t[2],this.name=t[3]||"Unknown Entity"}};var S={"Serenade of Salvation":{duration:3},"Holy Aura":{duration:16e3},"Holy Protection":{duration:7e3},Demonize:{duration:1500}};function $(){return{id:0,name:"",totalDamage:0,maxDamage:0,hits:{casts:0,total:0,crit:0,backAttack:0,frontAttack:0,counter:0},breakdown:[]}}function y(){return{lastUpdate:0,id:"",npcId:0,name:"",class:"",classId:0,isPlayer:!1,isDead:!1,deaths:0,deathTime:0,gearScore:0,currentHp:0,maxHp:0,damageDealt:0,healingDone:0,shieldDone:0,damageTaken:0,skills:{},hits:{casts:0,total:0,crit:0,backAttack:0,frontAttack:0,counter:0}}}var E=class extends C.EventEmitter{resetTimer;debugLines;isLive;dontResetOnZoneChange;resetAfterPhaseTransition;splitOnPhaseTransition;removeOverkillDamage;phaseTransitionResetRequest;phaseTransitionResetRequestTime;game;encounters;healSources;constructor(t=!1){super(),this.resetTimer=null,this.debugLines=!1,this.isLive=t,this.dontResetOnZoneChange=!1,this.resetAfterPhaseTransition=!1,this.splitOnPhaseTransition=!1,this.removeOverkillDamage=!0,this.phaseTransitionResetRequest=!1,this.phaseTransitionResetRequestTime=0,this.resetState(),this.encounters=[],this.isLive&&setInterval(this.broadcastStateChange.bind(this),100)}resetState(t=""){this.debugLines&&this.emit("log",{type:"debug",message:"Resetting state"});let e=(0,m.cloneDeep)(this.game),s=+new Date,a={};if(this.game&&t!==""){let n=this.game.entities[this.game.localPlayer];n?a[this.game.localPlayer]={...y(),id:t,name:n.name,class:n.class,classId:n.classId,isPlayer:n.isPlayer,gearScore:n.gearScore}:(this.game.localPlayer="You",a[this.game.localPlayer]={...y(),id:t,name:"You",isPlayer:!0})}this.game={startedOn:s,lastCombatPacket:s,fightStartedOn:0,localPlayer:this.game?.localPlayer??"",entities:a,damageStatistics:{totalDamageDealt:0,topDamageDealt:0,totalDamageTaken:0,topDamageTaken:0,totalHealingDone:0,topHealingDone:0,totalShieldDone:0,topShieldDone:0}},this.healSources=[],this.emit("reset-state",e)}softReset(){this.resetTimer=null;let t=(0,m.cloneDeep)(this.game.entities);this.resetState();for(let e of Object.values(t))+new Date-e.lastUpdate>10*60*1e3||this.updateEntity(e.name,{name:e.name,npcId:e.npcId,class:e.class,classId:e.classId,isPlayer:e.isPlayer,gearScore:e.gearScore,maxHp:e.maxHp,currentHp:e.currentHp})}cancelReset(){this.resetTimer&&clearTimeout(this.resetTimer),this.resetTimer=null}splitEncounter(t="",e=!1){let s=(0,m.cloneDeep)(this.game);s.fightStartedOn!=0&&(s.damageStatistics.totalDamageDealt!=0||s.damageStatistics.totalDamageTaken)&&this.encounters.push(s),e?this.softReset():this.resetState(t)}broadcastStateChange(){let t=(0,m.cloneDeep)(this.game);Object.values(t.entities).forEach(e=>{Object.values(e.skills).forEach(s=>{s.breakdown=[]})}),this.emit("state-change",t)}parseLogLine(t){if(!t)return;let e=t.trim().split("|");if(e.length<1||!e[0])return;let s=r(e[0]);try{switch(s){case 0:this.onMessage(e);break;case 1:this.onInitEnv(e);break;case 2:this.onPhaseTransition(e);break;case 3:this.onNewPc(e);break;case 4:this.onNewNpc(e);break;case 5:this.onDeath(e);break;case 6:this.onSkillStart(e);break;case 7:this.onSkillStage(e);break;case 8:this.onDamage(e);break;case 9:this.onHeal(e);break;case 10:this.onBuff(e);break;case 12:this.onCounterattack(e);break}}catch(a){this.emit("log",{type:"error",message:a})}}updateEntity(t,e){let s={lastUpdate:+new Date},a;return t in this.game.entities?a={...y(),...this.game.entities[t],...e,...s}:a={...y(),...e,...s},this.game.entities[t]=a,a}onMessage(t){let e=new g(t);this.debugLines&&this.emit("log",{type:"debug",message:`onMessage: ${e.message}`}),e.message.startsWith("Arguments:")||this.emit("message",e.message)}onInitEnv(t){let e=new l(t);this.debugLines&&this.emit("log",{type:"debug",message:"onInitEnv"}),this.isLive?this.dontResetOnZoneChange===!1&&this.resetTimer==null&&(this.debugLines&&this.emit("log",{type:"debug",message:"Setting a reset timer"}),this.resetTimer=setTimeout(this.softReset.bind(this),6e3),this.emit("message","new-zone")):(this.splitEncounter(e.playerId),this.emit("message","new-zone"))}onPhaseTransition(t){let e=new c(t);this.debugLines&&this.emit("log",{type:"debug",message:`onPhaseTransition: ${e.phaseCode}`}),this.isLive&&(this.emit("message",`phase-transition-${e.phaseCode}`),this.resetAfterPhaseTransition&&(this.phaseTransitionResetRequest=!0,this.phaseTransitionResetRequestTime=+new Date)),!this.isLive&&this.splitOnPhaseTransition&&this.splitEncounter("",!0)}onNewPc(t){let e=new h(t);if(this.debugLines&&this.emit("log",{type:"debug",message:`onNewPc: ${e.id}, ${e.name}, ${e.classId}, ${e.class}, ${e.gearScore}, ${e.currentHp}, ${e.maxHp}`}),this.game&&this.game.localPlayer!==""){let s=this.game.entities[this.game.localPlayer];s&&s.id===e.id&&(delete this.game.entities[this.game.localPlayer],this.game.localPlayer=e.name)}this.updateEntity(e.name,{id:e.id,name:e.name,class:e.class,classId:e.classId,isPlayer:!0,...e.gearScore&&e.gearScore!=0&&{gearScore:e.gearScore},currentHp:e.currentHp,maxHp:e.maxHp})}onNewNpc(t){let e=new d(t);this.debugLines&&this.emit("log",{type:"debug",message:`onNewNpc: ${e.id}, ${e.name}, ${e.currentHp}, ${e.maxHp}`}),this.updateEntity(e.name,{id:e.id,name:e.name,npcId:e.npcId,isPlayer:!1,currentHp:e.currentHp,maxHp:e.maxHp})}onDeath(t){let e=new u(t);this.debugLines&&this.emit("log",{type:"debug",message:`onDeath: ${e.name} ${e.killerName}`});let s=this.game.entities[e.name],a=0;s?s.isDead?a=s.deaths:a=s.deaths+1:a=1,this.updateEntity(e.name,{name:e.name,isDead:!0,deathTime:+e.timestamp,deaths:a})}onSkillStart(t){let e=new k(t);this.debugLines&&this.emit("log",{type:"debug",message:`onSkillStart: ${e.id}, ${e.name}, ${e.skillId}, ${e.skillName}`});let s=S[e.skillName];s&&this.healSources.push({source:e.name,expires:+e.timestamp+s.duration}),this.updateEntity(e.name,{name:e.name,isDead:!1});let a=this.game.entities[e.name];if(a){a.hits.casts+=1;let n=a.skills[e.skillName];n||(n={...$(),id:e.skillId,name:e.skillName},a.skills[e.skillName]=n,n.hits.casts+=1)}}onSkillStage(t){let e=new f(t);this.debugLines&&this.emit("log",{type:"debug",message:`onSkillStage: ${e.name}, ${e.skillId}, ${e.skillName}, ${e.skillStage}`})}onDamage(t){if(t.length<13)return;let e=new b(t);this.debugLines&&this.emit("log",{type:"debug",message:`onDamage: ${e.id}, ${e.name}, ${e.skillId}, ${e.skillName}, ${e.skillEffectId}, ${e.skillEffect}, ${e.targetId}, ${e.targetName}, ${e.damage}, ${e.currentHp}, ${e.maxHp}`}),this.phaseTransitionResetRequest&&this.phaseTransitionResetRequestTime>0&&this.phaseTransitionResetRequestTime<+new Date-13500&&(this.softReset(),this.phaseTransitionResetRequest=!1),this.updateEntity(e.name,{id:e.id,name:e.name}),this.updateEntity(e.targetName,{id:e.targetId,name:e.targetName,currentHp:e.currentHp,maxHp:e.maxHp});let s=this.game.entities[e.name],a=this.game.entities[e.targetName];if(!s||!a)return;!a.isPlayer&&this.removeOverkillDamage&&e.currentHp<0&&(e.damage=e.damage+e.currentHp),e.skillId===0&&e.skillEffectId!==0&&(e.skillId=e.skillEffectId,e.skillName=e.skillEffect);let n=s.skills[e.skillName];n||(n={...$(),id:e.skillId,name:e.skillName},s.skills[e.skillName]=n);let D=e.damageModifier&15,A=(e.damageModifier>>4&7)-1;if(e.skillName==="Bleed"&&e.damage>1e7||e.skillName==="Bleed"&&D===11)return;let N=D===1||D===8,x=A===0,_=A===1,w=N?1:0,H=x?1:0,P=_?1:0;if(n.totalDamage+=e.damage,e.damage>n.maxDamage&&(n.maxDamage=e.damage),s.damageDealt+=e.damage,a.damageTaken+=e.damage,e.skillName!=="Bleed"&&(s.hits.total+=1,s.hits.crit+=w,s.hits.backAttack+=H,s.hits.frontAttack+=P,n.hits.total+=1,n.hits.crit+=w,n.hits.backAttack+=H,n.hits.frontAttack+=P),s.isPlayer){this.game.damageStatistics.totalDamageDealt+=e.damage,this.game.damageStatistics.topDamageDealt=Math.max(this.game.damageStatistics.topDamageDealt,s.damageDealt);let R={timestamp:+e.timestamp,damage:e.damage,targetEntity:a.id,isCrit:N,isBackAttack:x,isFrontAttack:_};n.breakdown.push(R)}a.isPlayer&&(this.game.damageStatistics.totalDamageTaken+=e.damage,this.game.damageStatistics.topDamageTaken=Math.max(this.game.damageStatistics.topDamageTaken,a.damageTaken)),this.game.fightStartedOn===0&&(this.game.fightStartedOn=+e.timestamp),this.game.lastCombatPacket=+e.timestamp}onHeal(t){let e=new p(t);this.debugLines&&this.emit("log",{type:"debug",message:`onHeal: ${e.id}, ${e.name}, ${e.healAmount}`});let s="";for(let n of this.healSources)if(n.expires>=+e.timestamp){s=n.source;break}if(!s)return;let a=this.updateEntity(s,{name:s});a.healingDone+=e.healAmount,a.isPlayer&&(this.game.damageStatistics.totalHealingDone+=e.healAmount,this.game.damageStatistics.topHealingDone=Math.max(this.game.damageStatistics.topHealingDone,a.healingDone))}onBuff(t){let e=new I(t);if(this.debugLines&&this.emit("log",{type:"debug",message:`onBuff: ${e.id}, ${e.name}, ${e.buffId}, ${e.buffName}, ${e.sourceId}, ${e.sourceName}, ${e.shieldAmount}`}),e.shieldAmount&&e.isNew){let s=this.updateEntity(e.name,{name:e.name});s.shieldDone+=e.shieldAmount,s.isPlayer&&(this.game.damageStatistics.totalShieldDone+=e.shieldAmount,this.game.damageStatistics.topShieldDone=Math.max(this.game.damageStatistics.topShieldDone,s.shieldDone))}}onCounterattack(t){let e=new T(t);this.debugLines&&this.emit("log",{type:"debug",message:`onCounterattack: ${e.id}, ${e.name}`});let s=this.updateEntity(e.name,{name:e.name});s.hits.counter+=1}};0&&(module.exports={LogParser});
