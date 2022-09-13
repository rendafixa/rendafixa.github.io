(window.webpackJsonp=window.webpackJsonp||[]).push([[6,5],{376:function(t,e,n){"use strict";n.r(e);var r=n(402),o=n(401),d=n(374),l=(n(31),n(247),n(63),{filters:{percent:function(t){return t+"%"}},props:{name:{type:String,required:!0,validator:function(content){return!!content}},amount:{type:Number,required:!0,validator:function(t){return parseInt(t)>0}},interestAmount:{type:Number,required:!0,validator:function(t){return parseInt(t)>0}},taxAmount:{type:Number,required:!1,default:null,validator:function(t){return parseInt(t)>0}},taxPercentage:{type:Number,required:!1,default:null,validator:function(t){return parseInt(t)>0}}},computed:{totalAmount:function(){return this.amount+this.interestAmount-this.taxAmount}}}),c=n(64),component=Object(c.a)(l,(function(){var t=this,e=t._self._c;return e(o.a,{staticClass:"mb-2",attrs:{elevation:"2"}},[e(d.b,[t._v(t._s(t.name))]),t._v(" "),e(d.a,[t.amount?e("div",[t._v("Valor Investido: R$ "+t._s(t.amount.toFixed(2)))]):t._e(),t._v(" "),t.interestAmount?e("div",[t._v("\n      Valor Bruto: R$ "+t._s(t.interestAmount.toFixed(2))+"\n    ")]):t._e(),t._v(" "),t.taxAmount?e("div",[t._v("\n      Impostos: R$ "+t._s(t.taxAmount.toFixed(2))+"\n      "),t.taxPercentage?e(r.a,{staticClass:"pl-1",attrs:{content:t._f("percent")(t.taxPercentage),color:"red lighten-2"}}):t._e()],1):t._e(),t._v(" "),e("div",[t._v("Valor Total Líquido: R$ "+t._s(t.totalAmount.toFixed(2)))])])],1)}),[],!1,null,null,null);e.default=component.exports},377:function(t,e,n){var content=n(378);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(45).default)("f57c809c",content,!0,{sourceMap:!1})},378:function(t,e,n){var r=n(44)(!1);r.push([t.i,'.theme--light.v-badge .v-badge__badge:after{border-color:#fff}.theme--dark.v-badge .v-badge__badge:after{border-color:#1e1e1e}.v-badge{position:relative}.v-badge,.v-badge__badge{display:inline-block;line-height:1}.v-badge__badge{border-radius:10px;color:#fff;font-size:12px;height:20px;letter-spacing:0;min-width:20px;padding:4px 6px;pointer-events:auto;position:absolute;text-align:center;text-indent:0;top:auto;transition:.3s cubic-bezier(.25,.8,.5,1);white-space:nowrap}.v-application--is-ltr .v-badge__badge{right:auto}.v-application--is-rtl .v-badge__badge{left:auto}.v-badge__badge .v-icon{color:inherit;font-size:12px;height:12px;margin:0 -2px;width:12px}.v-badge__badge .v-img{height:12px;width:12px}.v-badge__wrapper{flex:0 1;height:100%;left:0;pointer-events:none;position:absolute;top:0;width:100%}.v-badge--avatar .v-badge__badge{padding:0}.v-badge--avatar .v-badge__badge .v-avatar{height:20px!important;min-width:0!important;max-width:20px!important}.v-badge--bordered .v-badge__badge:after{border-radius:inherit;border-width:2px;border-style:solid;bottom:0;content:"";left:0;position:absolute;right:0;top:0;transform:scale(1.15)}.v-badge--dot .v-badge__badge{border-radius:4.5px;height:9px;min-width:0;padding:0;width:9px}.v-badge--dot .v-badge__badge:after{border-width:1.5px}.v-badge--icon .v-badge__badge{padding:4px 6px}.v-badge--inline{align-items:center;display:inline-flex;justify-content:center}.v-badge--inline .v-badge__badge,.v-badge--inline .v-badge__wrapper{position:relative}.v-badge--inline .v-badge__wrapper{margin:0 4px}.v-badge--tile .v-badge__badge{border-radius:0}',""]),t.exports=r},380:function(t,e,n){"use strict";n.r(e);function r(t,e,n){return t*Math.pow(e,n)-t}function o(t,e,n,o){var d=r(t,function(t,e){var n=t/100;return Math.pow(n*e/100+1,1/12)}(n,e),o),l=function(t){return t<=6?22.5:t<=12?20:t<=24?17.5:15}(o);return{interestAmount:d,taxAmount:d*(l/100),taxPercentage:l}}var d={components:{InvestmentResult:n(376).default},data:function(){return{investment:this.$store.state.investment}},computed:{resultCDB:function(){return o(this.investment.amount,this.investment.di,this.investment.cdb,this.investment.duration)},resultPoupanca:function(){return t=this.investment.amount,e=this.investment.poupanca,n=this.investment.duration,o=r(t,function(t){return t/100+1}(e),n),{interestAmount:o,taxAmount:0,taxPercentage:0};var t,e,n,o}}},l=n(64),component=Object(l.a)(d,(function(){var t=this,e=t._self._c;return e("div",[e("h2",{staticClass:"text-h6"},[t._v("Simulação do Investimento")]),t._v(" "),e("p",{staticClass:"grey--text"},[t._v("\n    Simulação da rentabilidade do seu investimento conforme o tipo de\n    aplicação:\n  ")]),t._v(" "),e("InvestmentResult",{attrs:{name:"Poupança",amount:t.investment.amount,"interest-amount":t.resultPoupanca.interestAmount}}),t._v(" "),e("InvestmentResult",{attrs:{name:"CDB / RDB",amount:t.investment.amount,"interest-amount":t.resultCDB.interestAmount,"tax-amount":t.resultCDB.taxAmount,"tax-percentage":t.resultCDB.taxPercentage}})],1)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{InvestmentResult:n(376).default})},402:function(t,e,n){"use strict";n(17),n(14),n(24),n(7),n(29),n(23),n(30);var r=n(100),o=n(5),d=(n(63),n(377),n(379)),l=n(170),c=n(85),v=n(177),h=n(0).a.extend({name:"transitionable",props:{mode:String,origin:String,transition:String}}),f=n(171),m=n(46),_=n(2),x=["aria-atomic","aria-label","aria-live","role","title"];function O(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}e.a=Object(m.a)(l.a,Object(f.a)(["left","bottom"]),c.a,v.a,h).extend({name:"v-badge",props:{avatar:Boolean,bordered:Boolean,color:{type:String,default:"primary"},content:{required:!1},dot:Boolean,label:{type:String,default:"$vuetify.badge"},icon:String,inline:Boolean,offsetX:[Number,String],offsetY:[Number,String],overlap:Boolean,tile:Boolean,transition:{type:String,default:"scale-rotate-transition"},value:{default:!0}},computed:{classes:function(){return function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?O(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):O(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({"v-badge--avatar":this.avatar,"v-badge--bordered":this.bordered,"v-badge--bottom":this.bottom,"v-badge--dot":this.dot,"v-badge--icon":null!=this.icon,"v-badge--inline":this.inline,"v-badge--left":this.left,"v-badge--overlap":this.overlap,"v-badge--tile":this.tile},this.themeClasses)},computedBottom:function(){return this.bottom?"auto":this.computedYOffset},computedLeft:function(){return this.isRtl?this.left?this.computedXOffset:"auto":this.left?"auto":this.computedXOffset},computedRight:function(){return this.isRtl?this.left?"auto":this.computedXOffset:this.left?this.computedXOffset:"auto"},computedTop:function(){return this.bottom?this.computedYOffset:"auto"},computedXOffset:function(){return this.calcPosition(this.offsetX)},computedYOffset:function(){return this.calcPosition(this.offsetY)},isRtl:function(){return this.$vuetify.rtl},offset:function(){return this.overlap?this.dot?8:12:this.dot?2:4},styles:function(){return this.inline?{}:{bottom:this.computedBottom,left:this.computedLeft,right:this.computedRight,top:this.computedTop}}},methods:{calcPosition:function(t){return"calc(100% - ".concat(Object(_.d)(t||this.offset),")")},genBadge:function(){var t=this.$vuetify.lang,label=this.$attrs["aria-label"]||t.t(this.label),data=this.setBackgroundColor(this.color,{staticClass:"v-badge__badge",style:this.styles,attrs:{"aria-atomic":this.$attrs["aria-atomic"]||"true","aria-label":label,"aria-live":this.$attrs["aria-live"]||"polite",title:this.$attrs.title,role:this.$attrs.role||"status"},directives:[{name:"show",value:this.isActive}]}),e=this.$createElement("span",data,[this.genBadgeContent()]);return this.transition?this.$createElement("transition",{props:{name:this.transition,origin:this.origin,mode:this.mode}},[e]):e},genBadgeContent:function(){if(!this.dot){var slot=Object(_.j)(this,"badge");return slot||(this.content?String(this.content):this.icon?this.$createElement(d.a,this.icon):void 0)}},genBadgeWrapper:function(){return this.$createElement("span",{staticClass:"v-badge__wrapper"},[this.genBadge()])}},render:function(t){var e=[this.genBadgeWrapper()],n=[Object(_.j)(this)],o=this.$attrs,d=(o["aria-atomic"],o["aria-label"],o["aria-live"],o.role,o.title,Object(r.a)(o,x));return this.inline&&this.left?n.unshift(e):n.push(e),t("span",{staticClass:"v-badge",attrs:d,class:this.classes},n)}})}}]);