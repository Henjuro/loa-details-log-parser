"use strict";var b=Object.defineProperty;var u=Object.getOwnPropertyDescriptor;var d=Object.getOwnPropertyNames;var D=Object.prototype.hasOwnProperty;var l=(m,n)=>{for(var i in n)b(m,i,{get:n[i],enumerable:!0})},p=(m,n,i,r)=>{if(n&&typeof n=="object"||typeof n=="function")for(let a of d(n))!D.call(m,a)&&a!==i&&b(m,a,{get:()=>n[a],enumerable:!(r=u(n,a))||r.enumerable});return m};var s=m=>p(b({},"__esModule",{value:!0}),m);var g={};l(g,{StatusEffectBuffTypeFlags:()=>o,StatusEffectTarget:()=>t});module.exports=s(g);var t=(r=>(r[r.OTHER=0]="OTHER",r[r.PARTY=1]="PARTY",r[r.SELF=2]="SELF",r))(t||{}),o=(e=>(e[e.NONE=0]="NONE",e[e.DMG=1]="DMG",e[e.CRIT=2]="CRIT",e[e.ATKSPEED=4]="ATKSPEED",e[e.MOVESPEED=8]="MOVESPEED",e[e.HP=16]="HP",e[e.DEFENSE=32]="DEFENSE",e[e.RESOURCE=64]="RESOURCE",e[e.COOLDOWN=128]="COOLDOWN",e[e.STAGGER=256]="STAGGER",e[e.SHIELD=512]="SHIELD",e[e.ANY=262144]="ANY",e))(o||{});0&&(module.exports={StatusEffectBuffTypeFlags,StatusEffectTarget});
