import{a as t}from"./chunk-WSJANNVG.mjs";import"lodash";var r=class{lineSplit;timestamp;constructor(s){this.lineSplit=s,this.timestamp=new Date(this.lineSplit[1])}},u=class extends r{message;constructor(s){super(s),this.message=this.lineSplit[2]}},m=class extends r{playerId;constructor(s){super(s),this.playerId=s[2]}},c=class extends r{phaseCode;constructor(s){super(s),this.phaseCode=t(s[2])}},h=class extends r{id;name;classId;class;gearScore;currentHp;maxHp;constructor(s){super(s),this.id=s[2],this.name=s[3]||"Unknown Entity",this.classId=t(s[4]),this.class=s[5]||"UnknownClass",this.gearScore=t(s[7],0,10,!0),this.currentHp=t(s[8]),this.maxHp=t(s[9])}},o=class extends r{id;npcId;name;currentHp;maxHp;constructor(s){super(s),this.id=s[2],this.npcId=t(s[3]),this.name=s[4]||"Unknown Entity",this.currentHp=t(s[5]),this.maxHp=t(s[6])}},d=class extends r{id;name;killerId;killerName;constructor(s){super(s),this.id=s[2],this.name=s[3]||"Unknown Entity",this.killerId=s[4],this.killerName=s[5]||"Unknown Entity"}},g=class extends r{id;name;skillId;skillName;constructor(s){super(s),this.id=s[2],this.name=s[3]||"Unknown Entity",this.skillId=t(s[4]),this.skillName=s[5]||"Unknown Skill"}},f=class extends r{id;name;skillId;skillName;skillStage;constructor(s){super(s),this.id=s[2],this.name=s[3]||"Unknown Entity",this.skillId=s[4],this.skillName=s[5]||"Unknown Skill",this.skillStage=t(s[6])}},k=class extends r{id;name;skillId;skillName;skillEffectId;skillEffect;targetId;targetName;damage;damageModifier;currentHp;maxHp;statusEffectsOnTarget;statusEffectsOnSource;constructor(s){if(super(s),this.id=s[2],this.name=s[3]||"Unknown Entity",this.skillId=t(s[4]),this.skillName=s[5]||"Unknown Skill",this.skillEffectId=t(s[6]),this.skillEffect=s[7],this.targetId=s[8],this.targetName=s[9]||"Unknown Entity",this.damage=t(s[10]),this.damageModifier=t(s[11],0,16),this.currentHp=t(s[12]),this.maxHp=t(s[13]),this.statusEffectsOnTarget=[],this.statusEffectsOnSource=[],s.length>=17){let e=!1,i=0;for(var a of s[14].split(","))e?(this.statusEffectsOnTarget.push([i,a]),e=!1):(i=t(a),e=!0);e=!1;for(var a of s[15].split(","))e?(this.statusEffectsOnSource.push([i,a]),e=!1):(i=t(a),e=!0)}}},x=class extends r{id;name;healAmount;constructor(s){super(s),this.id=s[2],this.name=s[3]||"Unknown Entity",this.healAmount=t(s[4])}},b=class extends r{id;name;buffId;buffName;isNew;sourceId;sourceName;shieldAmount;constructor(s){super(s),this.id=s[2],this.name=s[3]||"Unknown Entity",this.buffId=s[4],this.buffName=s[5],this.isNew=s[6]=="1",this.sourceId=s[7],this.sourceName=s[8]||"Unknown Entity",this.shieldAmount=t(s[9])}},I=class extends r{id;name;constructor(s){super(s),this.id=s[2],this.name=s[3]||"Unknown Entity"}};export{u as a,m as b,c,h as d,o as e,d as f,g,f as h,k as i,x as j,b as k,I as l};