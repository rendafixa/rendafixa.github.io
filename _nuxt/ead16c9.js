(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{371:function(t,e,n){"use strict";n.r(e);var r=n(392),o=n(369),d=(n(33),n(243),n(60),{props:{name:{type:String,required:!0,validator:function(content){return!!content}},amount:{type:Number,required:!0,validator:function(t){return parseInt(t)>0}},interestAmount:{type:Number,required:!0,validator:function(t){return parseInt(t)>0}},taxAmount:{type:Number,required:!1,default:null,validator:function(t){return parseInt(t)>0}},taxPercentage:{type:Number,required:!1,default:null,validator:function(t){return parseInt(t)>0}}},computed:{totalAmount:function(){return this.amount+this.interestAmount-this.taxAmount}}}),l=n(61),component=Object(l.a)(d,(function(){var t=this,e=t._self._c;return e(r.a,{staticClass:"mb-2",attrs:{elevation:"2"}},[e(o.b,[t._v(t._s(t.name))]),t._v(" "),e(o.a,[t.amount?e("div",[t._v("Valor Investido: R$ "+t._s(t.amount.toFixed(2)))]):t._e(),t._v(" "),t.interestAmount?e("div",[t._v("\n      Valor Bruto: R$ "+t._s(t.interestAmount.toFixed(2))+"\n    ")]):t._e(),t._v(" "),t.taxAmount?e("div",[t._v("\n      Impostos: R$ "+t._s(t.taxAmount.toFixed(2))+"\n      "),t.txPercentage?e("span",[t._v(t._s(t.taxPercentage.toFixed(2))+"%")]):t._e()]):t._e(),t._v(" "),e("div",[t._v("Valor Total Líquido: R$ "+t._s(t.totalAmount.toFixed(2)))])])],1)}),[],!1,null,null,null);e.default=component.exports}}]);