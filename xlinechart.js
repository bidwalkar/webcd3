( function() {
	if ( window.d3 == undefined ) {
		alert('Please include d3.js') ;
		return;
	}
	if ( window.customElements == undefined ) {
		alert('Unsupported browser') ;
		return ;
	}
	class XLineChart extends HTMLElement {
		constructor() {
			super() ;
			this.sroot = this.attachShadow({mode:'open'}) ;
			this.data = [] ;
		}
		connectedCallback() {
			var height = this.getAttribute('height') ;
			if ( height == undefined ) 
				this.height = 300 ;
			else
				this.height = height * 1 ;
			var width = this.getAttribute('width') ;
			if ( width == undefined ) 
				this.width = 300 ;
			else
				this.width = width * 1 ;
			this._dataChanged() ;
		}
		static get observedAttributes() { return ['data'] ; }
		attributeChangedCallback(name,oldValue,newValue) {
			if ( name == 'data' )  {
				var data = this.getAttribute('data').split(',') ;
				for ( var i = 0 ; i < data.length ; ++i ) data[i] = data[i] * 1.0 ;
				this.data = data ;
				this._dataChanged() ;
			}
		}
		_dataChanged() {
			var data = this.data ;
			if ( data == undefined || data.length == 0 )
				return ;
			var width = this.width ;
			if ( width == undefined )
				return ;
			var height = this.height ;
			var shadowRoot = this.sroot ;
			shadowRoot.innerHTML = '<style>text { font-family: Helvetica; font-size: 6pt; } </style>' ;
			var svg = d3.select(shadowRoot).append('svg').attr('width',width).attr('height',height).style('border','solid 1px lightgray') ;
			var min = d3.min(data) ;
			var max = d3.max(data) ;
			var scalex = d3.scaleLinear().domain([0,data.length-1]).range([30,width-30]) ;
			var scaley = d3.scaleLinear().domain([min-30,max+30]).range([height,0]) ;
			for ( var i=0; i < data.length; ++i) { 
				svg.append('circle')
					.attr('cx',scalex(i))
					.attr('cy',scaley(data[i]))
					.attr('r',2)
					.attr('fill','green')
					.text(data[i])
					.on('mouseover',function() {
						if ( this.annotated ) return ;
						var txt = d3.select(event.srcElement).text() ; 
						var cx = d3.select(event.srcElement).attr('cx') ; cx = cx*1 - 15 ;
						var cy = d3.select(event.srcElement).attr('cy') ; cy = cy*1 - 5 ;
						lbl.attr('x',cx).attr('y',cy).text(txt) ;
					})
				;
			}
			if ( data.length <= 20 ) { //Upto 20 points, annotate
				this.annotated = true ;
				for ( var i=0; i < data.length; ++i) { 
					svg.append('text')
						.attr('x',scalex(i))
						.attr('y',scaley(data[i])-10)
						.attr('fill','black')
						.attr('transform','rotate(270,'+scalex(i)+','+(scaley(data[i])-10)+')')
						.text(data[i])
					;
				}
			}
			var path = "M " ;
			path += (scalex(0)+" "+scaley(data[0]) + " ") ;
			for ( var i = 1 ; i < data.length ; ++i ) {
				path += ("L " + scalex(i) + " " + scaley(data[i]) + " ") 
				svg.append('path').attr('d',path).attr('fill','none').attr('stroke','green') ;
				var lbl = svg.append('text').attr('fill','black').attr('text-anchor','right') ;        
			}
			for ( var i = 1 ; i < 10 ; ++i ) {
				path = "M " + "0 " + (height*i/10) + " L " + width + " " + height*i/10 ;
				svg.append('path').attr('d',path).attr('fill','none').attr('stroke','lightgray') ;
			}
		}
	}
	if ( customElements.get('x-line-chart') == undefined )
		customElements.define('x-line-chart',XLineChart) ;
} ) () ;
