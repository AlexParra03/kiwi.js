/**
Kiwi - GameObjects
@module Kiwi
@submodule GameObjects
**/

module Kiwi.GameObjects {

	export class TextField extends Kiwi.Entity {

		/**
		TextField is a GameObject that renders text.

		TextField has width/height and a hitbox, but because text is difficult
		to measure, these may not be 100% accurate. It does not have an
		`Input` component either, although you may choose to add one. Be aware
		of these limitations.

		Note that there also exists a `Textfield` object. This is simply a
		legacy alias of `TextField`, which was renamed in v1.2.0 for naming
		standardization purposes.

		@class TextField
		@namespace Kiwi.GameObjects
		@extends Kiwi.Entity
		@constructor
		@param state {Kiwi.State} State this TextField belongs to
		@param text {string} Text contained within this textfield
		@param [x=0] {number} Horizontal position
		@param [y=0] {number} Vertical position
		@param [color="#000000"] {string} Color of the text
		@param [size=32] {number} Size of the text in pixels
		@param [weight="normal"] {string} Weight of the text
		@param [fontFamily="sans-serif"] {string} Font family to be used
		**/

		constructor(
			state: Kiwi.State,
			text: string,
			x: number = 0,
			y: number = 0,
			color: string = "#000000",
			size: number = 32,
			weight: string = "normal",
			fontFamily: string = "sans-serif" ) {

			super( state, x,y );

			if ( this.game.renderOption === Kiwi.RENDERER_WEBGL ) {
				this.glRenderer = this.game.renderer.requestSharedRenderer(
					"TextureAtlasRenderer" );
			}

			this._text = text;
			this._fontFamily = fontFamily;
			this._fontSize = size;
			this._fontWeight = weight;

			this._fontColor = new Kiwi.Utils.Color();
			this.color = color;

			this._alignWidth = 0;
			this._baseline = "top";
			this._textAlign = "left";

			this._tempDirty = true;

			// Create the canvas
			this._canvas = document.createElement( "canvas" );
			this._canvas.width = 2;
			this._canvas.height = 2;
			this._ctx = this._canvas.getContext( "2d" );

			// Add it to the TextureLibrary
			this.atlas = new Kiwi.Textures.SingleImage(
				this.game.rnd.uuid(), this._canvas );
			this.state.textureLibrary.add( this.atlas );
			this.atlas.dirty = true;

			// Setup components
			this.box = this.components.add(
				new Kiwi.Components.Box(
					this, x, y, this.width, this.height ) );
		}

		/**
		Return the type of object that this is.

		Note: This is not camel-cased because of an error in early development.
		To preserve API compatibility, all 1.x.x releases retail this form.
		This will be fixed in v2.

		@method objType
		@return {string} "Textfield"
		@public
		**/
		public objType() {
			return "Textfield";
		}

		/**
		Text string to render

		@property _text
		@type string
		@private
		**/
		private _text: string;

		/**
		Weight of the font

		@property _fontWeight
		@type string
		@default "normal"
		@private
		**/
		private _fontWeight: string;

		/**
		Size of the font

		@property _fontSize
		@type number
		@default 32
		@private
		**/
		private _fontSize: number;

		/**
		Color of the text

		@property _fontColor
		@type Kiwi.Utils.Color
		@private
		**/
		private _fontColor: Kiwi.Utils.Color;

		/**
		Font family to be rendered

		@property _fontFamily
		@type string
		@default "sans-serif"
		@private
		**/
		private _fontFamily: string;

		/**
		Alignment of the text.
		This can either be "left", "right" or "center".

		@property _textAlign
		@type string
		@default "center"
		@private
		**/
		private _textAlign: string;

		/**
		Pixel width of the text. Used internally for alignment purposes.
		This is distinct from canvas width, which will be larger than
		text width.

		@property _alignWidth
		@type number
		@default 0
		@private
		@since 1.1.0
		**/
		private _alignWidth: number;

		/**
		Baseline of the text to be rendered

		@property _baseline
		@type string
		@private
		**/
		private _baseline: string;

		/**
		Text string to render

		@property text
		@type string
		@public
		**/
		public set text( value: string ) {
			this._text = value;
			this._tempDirty = true;

		}
		public get text(): string {
			return this._text;
		}

		/**
		Color of the font of this textfield.
		May be set with a string, or an array of any valid
		Kiwi.Utils.Color arguments.
		Returns a hex string prepended with "#".

		@property color
		@type string
		@public
		**/
		public set color( val: any ) {
			if ( !Kiwi.Utils.Common.isArray( val ) ) {
				val = [ val ];
			}
			this._fontColor.set.apply( this._fontColor, val );
			this._tempDirty = true;

		}
		public get color(): any {
			return "#" + this._fontColor.getHex();
		}

		/**
		Weight of the font

		@property fontWeight
		@type string
		@public
		**/
		public set fontWeight( val: string ) {
			this._fontWeight = val;
			this._tempDirty = true;
		}
		public get fontWeight(): string {
			return this._fontWeight;
		}

		/**
		Point size of font

		@property fontSize
		@type number
		@public
		**/
		public set fontSize( val: number ) {
			this._fontSize = val;
			this._tempDirty = true;
		}
		public get fontSize(): number {
			return this._fontSize;
		}

		/**
		Font family used to render the text

		@property fontFamily
		@type string
		@public
		**/
		public set fontFamily( val: string ) {
			this._fontFamily = val;
			this._tempDirty = true;
		}
		public get fontFamily(): string {
			return this._fontFamily;
		}

		/**
		Static property that contains the string to center align the text

		@property TEXT_ALIGN_CENTER
		@type string
		@static
		@final
		@public
		**/
		public static TEXT_ALIGN_CENTER: string = "center";

		/**
		Static property that contains the string to right align the text

		@property TEXT_ALIGN_RIGHT
		@type string
		@static
		@final
		@public
		**/
		public static TEXT_ALIGN_RIGHT: string = "right";

		/**
		Static property that contains the string to left align the text

		@property TEXT_ALIGN_LEFT
		@type string
		@static
		@final
		@public
		**/
		public static TEXT_ALIGN_LEFT: string = "left";

		/**
		Alignment of the text. You can either use the static
		`TEXT_ALIGN` constants or pass a string.

		@property textAlign
		@type string
		@public
		**/
		public set textAlign( val: string ) {
			this._textAlign = val;
			this._tempDirty = true;
		}

		public get textAlign(): string {
			return this._textAlign;
		}

		/**
		Canvas element into which the text is rendered

		@property _canvas
		@type HTMLCanvasElement
		@private
		**/
		private _canvas: HTMLCanvasElement;

		/**
		Context for the canvas element. Used while rendering text.

		@property _ctx
		@type CanvasRenderingContext2D
		@private
		**/
		private _ctx: CanvasRenderingContext2D;

		/**
		Whether the temporary canvas is dirty and needs to be re-rendered

		@property _tempDirty
		@type boolean
		@private
		**/
		private _tempDirty: boolean = true;

		/**
		Hitbox component

		@property box
		@type Kiwi.Components.Box
		@public
		@since 1.2.0
		**/
		public box: Kiwi.Components.Box;

		/**
		Geometry point used in rendering

		@property _pt1
		@type Kiwi.Geom.Point
		@private
		**/
		private _pt1: Kiwi.Geom.Point = new Kiwi.Geom.Point( 0, 0 );

		/**
		Geometry point used in rendering

		@property _pt2
		@type Kiwi.Geom.Point
		@private
		**/
		private _pt2: Kiwi.Geom.Point = new Kiwi.Geom.Point( 0, 0 );

		/**
		Geometry point used in rendering

		@property _pt3
		@type Kiwi.Geom.Point
		@private
		**/
		private _pt3: Kiwi.Geom.Point = new Kiwi.Geom.Point( 0, 0 );

		/**
		Geometry point used in rendering

		@property _pt4
		@type Kiwi.Geom.Point
		@private
		**/
		private _pt4: Kiwi.Geom.Point = new Kiwi.Geom.Point( 0, 0 );


		/**
		Render the text to an off-screen canvas held in a `TextureAtlas`
		(which is generated upon the instantiation of this class).
		This is so that the canvas doesn't render it every frame,
		as text rendering can be costly,
		and so that it can be used in WebGL with the `TextureAtlasRenderer`.

		@method _renderText
		@private
		**/
		private _renderText() {

			// Get/Set the width
			this._ctx.font =
				this._fontWeight + " " +
				this._fontSize + "px " +
				this._fontFamily;


			// Get the size of the text
			var _measurements: TextMetrics =
				this._ctx.measureText( this._text );   //when you measure the text for some reason it resets the values?!
			var width = _measurements.width;
			var height = this._fontSize * 1.3; //Need to find a better way to calculate

			// Cache alignment width
			this._alignWidth = width;

			// Is the width base2?
			if ( Kiwi.Utils.Common.base2Sizes.indexOf( width ) == -1 ) {
				var i = 0;
				while ( width > Kiwi.Utils.Common.base2Sizes[ i ] ) {
					i++;
				}
				width = Kiwi.Utils.Common.base2Sizes[ i ];
			}

			// Is the height base2?
			if ( Kiwi.Utils.Common.base2Sizes.indexOf( height ) == -1 ) {
				var i = 0;
				while ( height > Kiwi.Utils.Common.base2Sizes[ i ] ) {
					i++;
				}
				height = Kiwi.Utils.Common.base2Sizes[ i ];
			}

			// Apply the width/height.
			this._canvas.width = width;
			this._canvas.height = height;

			// Clear the canvas.
			this._ctx.clearRect( 0, 0, width, height );

			// Reapply the styles because it unapplies after a measurement.
			this._ctx.font =
				this._fontWeight + " " +
				this._fontSize + "px " +
				this._fontFamily;
			this._ctx.fillStyle = this.color.slice( 0, 7 );
			this._ctx.textBaseline = this._baseline;

			// Draw the text.
			this._ctx.fillText( this._text, 0, 0 );

			// Update inherited properties
			this.width = this._alignWidth;
			this.height = this._canvas.height;


			//Update the cell and dirty/undirtyfiy
			this.atlas.cells[ 0 ] = {
				x: 0,
				y: 0,
				w: this._canvas.width,
				h: this._canvas.height,
				hitboxes: [ {
					x: this._textAlign ===
						Kiwi.GameObjects.TextField.TEXT_ALIGN_LEFT ?
						0 :
						this._textAlign ===
							Kiwi.GameObjects.TextField.TEXT_ALIGN_CENTER ?
						-this._alignWidth * 0.5 :
						-this._alignWidth,
					y: 0,
					w: this.width,
					h: this.height
					} ] };
			this._tempDirty = false;
			this.atlas.dirty = true;
		}

		/**
		Draw the TextField to the canvas.

		@method render
		@param camera {Kiwi.Camera} Current camera
		@public
		**/
		public render( camera:Kiwi.Camera ) {

			if ( this.alpha > 0 && this.visible ) {

				// Render on stage
				var ctx: CanvasRenderingContext2D = this.game.stage.ctx;
				ctx.save();

				var t: Kiwi.Geom.Transform = this.transform;
				if ( this.alpha > 0 && this.alpha <= 1 ) {
					ctx.globalAlpha = this.alpha;
				}

				// Does the text need re-rendering?
				if ( this._tempDirty ) {
					this._renderText();
				}

				// Align the text
				var x = 0;
				switch ( this._textAlign ) {
					case Kiwi.GameObjects.TextField.TEXT_ALIGN_LEFT:
						x = 0;
						break;
					case Kiwi.GameObjects.TextField.TEXT_ALIGN_CENTER:
						x = this._alignWidth * 0.5;
						break;
					case Kiwi.GameObjects.TextField.TEXT_ALIGN_RIGHT:
						x = this._alignWidth;
						break;
				}

				// Draw the Image
				var m: Kiwi.Geom.Matrix = t.getConcatenatedMatrix();

				ctx.transform( m.a, m.b, m.c, m.d, m.tx, m.ty );
				ctx.drawImage(
					this._canvas,
					0, 0,
					this._canvas.width, this._canvas.height,
					-t.rotPointX - x, -t.rotPointY,
					this._canvas.width, this._canvas.height );

				ctx.restore();
			}
		}

		/**
		Render the GameObject using WebGL.

		@method renderGL
		@param gl {WebGLRenderingContext} GL rendering context
		@param camera {Kiwi.Camera} Current camera
		@param params {Object} Optional parameters (unused)
		@public
		**/
		public renderGL(
			gl: WebGLRenderingContext,
			camera: Kiwi.Camera,
			params: any = null ) {

			// Does the text need re-rendering?
			if ( this._tempDirty ) {
				this._renderText();
			}

			// Transform/Matrix
			var t: Kiwi.Geom.Transform = this.transform;
			var m: Kiwi.Geom.Matrix = t.getConcatenatedMatrix();

			// Determine alignment
			var x = 0;
			switch ( this._textAlign ) {
				case Kiwi.GameObjects.TextField.TEXT_ALIGN_LEFT:
					x = 0;
					break;
				case Kiwi.GameObjects.TextField.TEXT_ALIGN_CENTER:
					x = -this._alignWidth * 0.5;
					break;
				case Kiwi.GameObjects.TextField.TEXT_ALIGN_RIGHT:
					x = -this._alignWidth;
					break;
			}

			// Set the Point Objects.
			this._pt1.setTo( x - t.rotPointX, 0 - t.rotPointY );
			this._pt2.setTo( this._canvas.width + x - t.rotPointX , 0 - t.rotPointY );
			this._pt3.setTo( this._canvas.width + x - t.rotPointX , this._canvas.height - t.rotPointY );
			this._pt4.setTo( x - t.rotPointX, this._canvas.height - t.rotPointY );

			// Add on the matrix to the points
			m.transformPoint( this._pt1 );
			m.transformPoint( this._pt2 );
			m.transformPoint( this._pt3 );
			m.transformPoint( this._pt4 );

			// Append to the xyuv and alpha arrays
			var vertexItems = [];
			vertexItems.push(

				// Top left corner
				this._pt1.x, this._pt1.y,
				0, 0, this.alpha,

				// Top right corner
				this._pt2.x, this._pt2.y,
				this._canvas.width, 0, this.alpha,

				// Bottom right corner
				this._pt3.x, this._pt3.y,
				this._canvas.width, this._canvas.height, this.alpha,

				// Bottom left corner
				this._pt4.x, this._pt4.y,
				0, this._canvas.height, this.alpha
				);

			//Add to the batch!
			( <Kiwi.Renderers.TextureAtlasRenderer>this.glRenderer ).
				concatBatch( vertexItems );
		}

		public destroy( immediate: boolean = false ) {

			if( !this.onState ) {
				immediate = true;
			}

			if ( immediate ) {
				this.state.textureLibrary.remove( this.atlas );
				delete this._canvas;
			}

			super.destroy( immediate );
		}

	}

	// Alias and reiteration for YuiDoc purposes
	export var Textfield = Kiwi.GameObjects.TextField;

}
