(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{371:function(e,t,r){"use strict";r.r(t);var n=r(392),o=r(369),l=(r(33),r(53),{props:{name:{type:Text,required:!0,validator:function(e){return!!e}},amount:{type:Number,required:!0,validator:function(e){return parseInt(e)>0}},beforeTaxAmount:{type:Number,required:!1,default:null,validator:function(e){return parseInt(e)>0}}}}),d=r(61),component=Object(d.a)(l,(function(){var e=this,t=e._self._c;return t(n.a,{staticClass:"mb-2",attrs:{elevation:"2"}},[t(o.b,[e._v(e._s(e.name))]),e._v(" "),t(o.a,[e.beforeTaxAmount?t("div",[e._v("Valor Bruto: R$ "+e._s(e.beforeTaxAmount))]):e._e(),e._v(" "),t("div",[e._v("Valor Líquido: R$ "+e._s(e.amount))])])],1)}),[],!1,null,null,null);t.default=component.exports}}]);