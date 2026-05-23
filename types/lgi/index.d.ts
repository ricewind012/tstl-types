type StaticMethodList = Record<string, (...args: any[]) => any>;
type StaticMethods<List extends StaticMethodList, FirstArg> = {
	[K in keyof List]: (
		arg0: FirstArg,
		...args: Parameters<List[K]>
	) => ReturnType<List[K]>;
};

declare module "lgi" {
	// #region Common
	export enum CairoAntialias {
		DEFAULT,
		NONE,
		GRAY,
		SUBPIXEL,
		FAST,
		GOOD,
		BEST,
	}

	export enum CairoOperator {
		CLEAR,
		SOURCE,
		OVER,
		IN,
		OUT,
		ATOP,
		DEST,
		DEST_OVER,
		DEST_IN,
		DEST_OUT,
		DEST_ATOP,
		XOR,
		ADD,
		SATURATE,
		MULTIPLY,
		SCREEN,
		OVERLAY,
		DARKEN,
		LIGHTEN,
		COLOR_DODGE,
		COLOR_BURN,
		HARD_LIGHT,
		SOFT_LIGHT,
		DIFFERENCE,
		EXCLUSION,
		HSL_HUE,
		HSL_SATURATION,
		HSL_COLOR,
		HSL_LUMINOSITY,
	}

	export enum CairoStatus {
		SUCCESS,
		NO_MEMORY,
		INVALID_RESTORE,
		INVALID_POP_GROUP,
		NO_CURRENT_POINT,
		INVALID_MATRIX,
		INVALID_STATUS,
		NULL_POINTER,
		INVALID_STRING,
		INVALID_PATH_DATA,
		READ_ERROR,
		WRITE_ERROR,
		SURFACE_FINISHED,
		SURFACE_TYPE_MISMATCH,
		PATTERN_TYPE_MISMATCH,
		INVALID_CONTENT,
		INVALID_FORMAT,
		INVALID_VISUAL,
		FILE_NOT_FOUND,
		INVALID_DASH,
		INVALID_DSC_COMMENT,
		INVALID_INDEX,
		CLIP_NOT_REPRESENTABLE,
		TEMP_FILE_ERROR,
		INVALID_STRIDE,
		FONT_TYPE_MISMATCH,
		USER_FONT_IMMUTABLE,
		USER_FONT_ERROR,
		NEGATIVE_COUNT,
		INVALID_CLUSTERS,
		INVALID_SLANT,
		INVALID_WEIGHT,
		INVALID_SIZE,
		USER_FONT_NOT_IMPLEMENTED,
		DEVICE_TYPE_MISMATCH,
		DEVICE_ERROR,
		INVALID_MESH_CONSTRUCTION,
		DEVICE_FINISHED,
		JBIG2_GLOBAL_MISSING,
		PNG_ERROR,
		FREETYPE_ERROR,
		WIN32_GDI_ERROR,
		TAG_ERROR,
		DWRITE_ERROR,
		SVG_FONT_ERROR,
		LAST_STATUS,
	}

	export enum CairoFillRule {
		WINDING,
		EVEN_ODD,
	}

	export enum CairoLineCap {
		BUTT,
		ROUND,
		SQUARE,
	}

	export enum CairoLineJoin {
		MITER,
		ROUND,
		BEVEL,
	}

	export type CairoDestroyCallback = (data: LuaUserdata) => void;

	export interface Rectangle {
		x: number;
		y: number;
		width: number;
		height: number;
	}

	interface RectangleList {
		status: CairoStatus;
		rectangles: Rectangle[];
		num_rectangles: number;
	}
	// #endregion

	// #region Interfaces
	interface FontExtents {
		ascent: number;
		descent: number;
		height: number;
		max_x_advance: number;
		max_y_advance: number;
	}

	interface Path {
		status: CairoStatus;
		data: any;
		num_data: number;
	}

	interface TextExtents {
		x_bearing: number;
		y_bearing: number;
		width: number;
		height: number;
		x_advance: number;
		y_advance: number;
	}
	// #endregion

	// #region Context
	interface ContextMethodList extends StaticMethodList {
		status(): CairoStatus;
		save(): void;
		restore(): void;
		get_target(): Surface;
		push_group(): void;
		push_group_with_content(content: CairoContent): void;
		pop_group(): Pattern;
		pop_group_to_source(): void;
		get_group_target(): Surface;
		set_source_rgb(red: number, green: number, blue: number): void;
		set_source_rgba(
			red: number,
			green: number,
			blue: number,
			alpha: number,
		): void;
		set_source(source: Pattern): void;
		set_source_surface(surface: Surface, x: number, y: number): void;
		get_source(): Surface;
		set_antialias(antialias: CairoAntialias): void;
		get_antialias(): CairoAntialias;
		set_dash(dashes: number, num_dashes: number, offset: number): void;
		get_dash_count(): number;
		get_dash(dashes: number, offset: number): void;
		set_fill_rule(fill_rule: CairoFillRule): void;
		get_fill_rule(): CairoFillRule;
		set_line_cap(line_cap: CairoLineCap): void;
		get_line_cap(): CairoLineCap;
		set_line_join(line_join: CairoLineJoin): void;
		get_line_join(): CairoLineJoin;
		set_line_width(width: number): void;
		get_line_width(): number;
		set_miter_limit(limit: number): void;
		get_miter_limit(): number;
		set_operator(op: CairoOperator): void;
		get_operator(): CairoOperator;
		set_tolerance(tolerance: number): void;
		get_tolerance(): number;
		clip(): void;
		clip_preserve(): void;
		clip_extents(x1: number, y1: number, x2: number, y2: number): void;
		in_clip(x: number, y: number): boolean;
		reset_clip(): void;
		copy_clip_rectangle_list(): RectangleList;
		fill(): void;
		fill_preserve(): void;
		fill_extents(x1: number, y1: number, x2: number, y2: number): void;
		in_fill(x: number, y: number): boolean;
		mask(pattern: Pattern): void;
		mask_surface(surface: Surface, surface_x: number, surface_y: number): void;
		paint(): void;
		paint_with_alpha(alpha: number): void;
		stroke(): void;
		stroke_preserve(): void;
		stroke_extents(x1: number, y1: number, x2: number, y2: number): void;
		in_stroke(x: number, y: number): boolean;
		copy_page(): void;
		show_page(): void;

		// LGI stuff
		copy_path(): Path;
		copy_path_flat(): Path;
		append_path(path: Path): void;
		has_current_point(): boolean;
		get_current_point(x: number, y: number): LuaMultiReturn<[number, number]>;
		new_path(): void;
		new_sub_path(): void;
		close_path(): void;
		arc(
			xc: number,
			yc: number,
			radius: number,
			angle1: number,
			angle2: number,
		): void;
		arc_negative(
			xc: number,
			yc: number,
			radius: number,
			angle1: number,
			angle2: number,
		): void;
		curve_to(
			x1: number,
			y1: number,
			x2: number,
			y2: number,
			x3: number,
			y3: number,
		): void;
		line_to(x: number, y: number): void;
		move_to(x: number, y: number): void;
		rectangle(x: number, y: number, width: number, height: number): void;
		text_path(text: string): void;
		rel_curve_to(
			dx1: number,
			dy1: number,
			dx2: number,
			dy2: number,
			dx3: number,
			dy3: number,
		): void;
		rel_line_to(x: number, y: number): void;
		rel_move_to(x: number, y: number): void;
		path_extents(
			x1: number,
			y1: number,
			x2: number,
			y2: number,
		): LuaMultiReturn<[number, number, number, number]>;
		translate(x: number, y: number): void;
		scale(x: number, y: number): void;
		rotate(degrees: number): void;
		transform(mat: Matrix): void;
		set_matrix(mat: Matrix): void;
		get_matrix(): Matrix;
		identity_matrix(): void;
		user_to_device(x: number, y: number): LuaMultiReturn<[number, number]>;
		user_to_device_distance(
			x: number,
			y: number,
		): LuaMultiReturn<[number, number]>;
		device_to_user(x: number, y: number): LuaMultiReturn<[number, number]>;
		device_to_user_distance(
			x: number,
			y: number,
		): LuaMultiReturn<[number, number]>;
		select_font_face(
			text: string,
			slant: CairoFontSlant,
			weight: CairoFontWeight,
		): void;
		set_font_size(size: number): void;
		set_font_matrix(value: Matrix): void;
		get_font_matrix(): Matrix;
		set_font_options(value: FontOptions): void;
		get_font_options(): FontOptions;
		set_font_face(value: FontFace): void;
		get_font_face(): FontFace;
		set_scaled_font(value: ScaledFont): void;
		get_scaled_font(): ScaledFont;
		show_text(text: string): void;
		font_extents(extents: FontExtents): any;
		text_extents(text: string, extents: TextExtents): any;
	}

	type Context = ContextMethodList & {
		status: keyof typeof CairoStatus;
		target: ImageSurface;
		group_target: ImageSurface;
		source: SolidPattern;
		antialias: keyof typeof CairoAntialias;
		fill_rule: keyof typeof CairoFillRule;
		line_cap: keyof typeof CairoLineCap;
		line_join: keyof typeof CairoLineJoin;
		line_width: number;
		miter_limit: number;
		operator: keyof typeof CairoOperator;
		tolerance: number;
		font_face: FontFace;
		font_matrix: Matrix;
		scaled_font: ScaledFont;
		matrix: Matrix;
	};
	// #endregion

	// #region Device
	export enum CairoDeviceType {
		DRM,
		GL,
		SCRIPT,
		XCB,
		XLIB,
		XML,
		COGL,
		WIN32,
		INVALID,
	}

	interface DeviceMethodList extends StaticMethodList {
		status(): CairoStatus;
		finish(): void;
		flush(): void;
		get_type(): CairoDeviceType;
		acquire(): CairoStatus;
		release(): void;
	}

	type Device = DeviceMethodList & {
		status: CairoStatus;
	};
	// #endregion

	// #region Font
	export enum CairoFontSlant {
		NORMAL,
		ITALIC,
		OBLIQUE,
	}

	export enum CairoFontType {
		TOY,
		FT,
		WIN32,
		QUARTZ,
		USER,
		DWRITE,
	}

	export enum CairoFontWeight {
		NORMAL,
		BOLD,
	}

	interface FontFaceMethodList extends StaticMethodList {
		status(): CairoStatus;
		get_type(): CairoFontType;
	}

	type FontFace = FontFaceMethodList & {
		status: CairoStatus;
		type: CairoFontType;
	};

	interface ToyFontFaceMethodList extends FontFaceMethodList {
		get_family(): string;
		get_slant(): CairoFontSlant;
		get_weight(): CairoFontWeight;
	}

	type ToyFontFace = FontFace & {
		family: string;
		slant: CairoFontSlant;
		weight: CairoFontWeight;
	};

	export enum CairoSubpixelOrder {
		DEFAULT,
		RGB,
		BGR,
		VRGB,
		VBGR,
	}

	export enum CairoHintStyle {
		DEFAULT,
		NONE,
		SLIGHT,
		MEDIUM,
		FULL,
	}

	export enum CairoHintMetrics {
		DEFAULT,
		OFF,
		ON,
	}

	export enum CairoColorMode {
		DEFAULT,
		NO_COLOR,
		COLOR,
	}

	interface FontOptionsMethodList extends StaticMethodList {
		create(): FontOptions;
		copy(): FontOptions;
		status(): CairoStatus;
		merge(other: FontOptions): FontOptions;
		hash(): number;
		equal(other: FontOptions): boolean;
		set_antialias(value: CairoAntialias): void;
		get_antialias(): CairoAntialias;
		set_subpixel_order(value: CairoSubpixelOrder): void;
		get_subpixel_order(): CairoSubpixelOrder;
		set_hint_style(value: CairoHintStyle): void;
		get_hint_style(): CairoHintStyle;
		set_hint_metrics(value: CairoHintMetrics): void;
		get_hint_metrics(): CairoHintMetrics;
	}

	type FontOptions = FontOptionsMethodList & {
		antialias: keyof typeof CairoAntialias;
		hint_metrics: keyof typeof CairoHintMetrics;
		hint_style: keyof typeof CairoHintStyle;
		status: keyof typeof CairoStatus;
		subpixel_order: keyof typeof CairoSubpixelOrder;
	};

	interface ScaledFontMethodList extends StaticMethodList {
		create(
			font_face: FontFace,
			font_matrix: Matrix,
			ctm: Matrix,
			options: FontOptions,
		): ScaledFont;
		status(): CairoStatus;
		extents(): FontExtents;
		text_extents(utf8: string): TextExtents;
		get_font_face(): FontFace;
		get_font_options(): FontOptions;
		get_font_matrix(): Matrix;
		get_ctm(): Matrix;
		get_scale_matrix(): Matrix;
		get_type(): CairoFontType;
	}

	type ScaledFont = ScaledFontMethodList & {
		status: CairoStatus;
		font_face: FontFace;
	};
	// #endregion

	// #region Matrix
	interface MatrixMethodList extends StaticMethodList {
		create_identity(
			xx: number,
			yx: number,
			xy: number,
			yy: number,
			x0: number,
			y0: number,
		): void;
		create_translate(
			xx: number,
			yx: number,
			xy: number,
			yy: number,
			x0: number,
			y0: number,
		): void;
		create_scale(
			xx: number,
			yx: number,
			xy: number,
			yy: number,
			x0: number,
			y0: number,
		): void;
		create_rotate(
			xx: number,
			yx: number,
			xy: number,
			yy: number,
			x0: number,
			y0: number,
		): void;
		init(
			xx: number,
			yx: number,
			xy: number,
			yy: number,
			x0: number,
			y0: number,
		): void;
		init_identity(): void;
		init_translate(tx: number, ty: number): void;
		init_scale(sx: number, sy: number): void;
		init_rotate(radians: number): void;
		translate(tx: number, ty: number): void;
		scale(sx: number, sy: number): void;
		rotate(radians: number): void;
		invert(): CairoStatus;
		multiply(a: Matrix, b: Matrix): void;
		transform_distance(dx: number, dy: number): void;
		transform_point(x: number, y: number): void;
	}

	type Matrix = MatrixMethodList & {
		xx: number;
		yx: number;
		xy: number;
		yy: number;
		x0: number;
		y0: number;
	};
	// #endregion

	// #region Pattern
	export enum CairoExtend {
		NONE,
		REPEAT,
		REFLECT,
		PAD,
	}

	export enum CairoFilter {
		FAST,
		GOOD,
		BEST,
		NEAREST,
		BILINEAR,
		GAUSSIAN,
	}

	export enum CairoPatternType {
		SOLID,
		SURFACE,
		LINEAR,
		RADIAL,
		MESH,
		RASTER_SOURCE,
	}

	interface PatternMethodList extends StaticMethodList {
		status(): CairoStatus;
		set_extend(value: CairoExtend): void;
		get_extend(): CairoExtend;
		set_filter(value: CairoFilter): void;
		get_filter(): CairoFilter;
		set_matrix(value: Matrix): void;
		get_matrix(): Matrix;
		get_type(): CairoPatternType;
	}

	interface GradientPatternMethodList extends PatternMethodList {
		add_color_stop_rgb(
			offset: number,
			red: number,
			green: number,
			blue: number,
		): void;
		add_color_stop_rgba(
			offset: number,
			red: number,
			green: number,
			blue: number,
			alpha: number,
		): void;
		get_color_stop_count(): LuaMultiReturn<[CairoStatus, number]>;
		get_color_stop_rgba(
			index: number,
		): LuaMultiReturn<[CairoStatus, number, number, number, number]>;
	}

	interface SolidPatternMethodList extends PatternMethodList {
		create_rgb(red: number, green: number, blue: number): Pattern;
		create_rgb(
			red: number,
			green: number,
			blue: number,
			alpha: number,
		): Pattern;
		get_rgba(): LuaMultiReturn<[CairoStatus, number, number, number, number]>;
	}

	type SolidPattern = Pattern;

	interface SurfacePatternMethodList extends PatternMethodList {
		create(surface: Surface): Pattern;
		get_surface(): LuaMultiReturn<[CairoStatus, Surface]>;
	}

	interface LinearPatternMethodList extends PatternMethodList {
		create(x0: number, y0: number, x1: number, y1: number): Pattern;
		get_linear_points(): LuaMultiReturn<
			[CairoStatus, number, number, number, number]
		>;
	}

	interface RadialPatternMethodList extends PatternMethodList {
		create(
			cx0: number,
			cy0: number,
			radius0: number,
			cx1: number,
			cy1: number,
			radius1: number,
		): Pattern;
		get_radial_circles(): LuaMultiReturn<
			[CairoStatus, number, number, number, number, number, number]
		>;
	}

	interface MeshPatternMethodList extends PatternMethodList {
		create(): Pattern;
		begin_patch(): void;
		end_patch(): void;
		move_to(x: number, y: number): void;
		line_to(x: number, y: number): void;
		curve_to(
			x1: number,
			y1: number,
			x2: number,
			y2: number,
			x3: number,
			y3: number,
		): void;
		set_control_point(point_num: number, x: number, y: number): void;
		set_corner_color_rgb(
			corner_num: number,
			red: number,
			green: number,
			blue: number,
		): void;
		set_corner_color_rgba(
			corner_num: number,
			red: number,
			green: number,
			blue: number,
			alpha: number,
		): void;
		get_patch_count(): LuaMultiReturn<[CairoStatus, number]>;
		get_path(): Path;
		get_control_point(
			patch_num: number,
			point_num: number,
		): LuaMultiReturn<[number, number]>;
		get_corner_color_rgba(
			patch_num: number,
			corner_num: number,
		): LuaMultiReturn<[CairoStatus, number, number, number, number]>;
	}

	type Pattern = PatternMethodList & {
		status: CairoStatus;
		extend: CairoExtend;
		filter: CairoFilter;
		type: CairoPatternType;
	};
	// #endregion

	// #region Region
	export enum CairoRegionOverlap {
		IN,
		OUT,
		PART,
	}

	interface RegionMethodList extends StaticMethodList {
		create(): Region;
		create_rectangle(rect: Rectangle): Region;
		copy(): Region;
		status(): CairoStatus;
		get_extents(): Rectangle;
		num_rectangles(): number;
		get_rectangle(nth: number): Rectangle;
		is_empty(): boolean;
		contains_point(x: number, y: number): boolean;
		contains_rectangle(rectangle: Rectangle): CairoRegionOverlap;
		equal(other: Region): boolean;
		translate(dx: number, dy: number): void;
		intersect(other: Region): CairoStatus;
		intersect_rectangle(rectangle: Rectangle): CairoStatus;
		subtract(other: Region): CairoStatus;
		subtract_rectangle(rectangle: Rectangle): CairoStatus;
		union(other: Region): CairoStatus;
		union_rectangle(rectangle: Rectangle): CairoStatus;
		xor(other: Region): CairoStatus;
		xor_rectangle(rectangle: Rectangle): CairoStatus;
	}

	type Region = RegionMethodList & {
		status: CairoStatus;
		extents: TextExtents;
	};
	// #endregion

	// #region Surface
	export enum CairoContent {
		COLOR,
		ALPHA,
		COLOR_ALPHA,
	}

	export enum CairoFormat {
		INVALID,
		ARGB32,
		RGB24,
		A8,
		A1,
		RGB16_565,
	}

	export enum CairoSurfaceType {
		IMAGE,
		PDF,
		PS,
		XLIB,
		XCB,
		GLITZ,
		QUARTZ,
		WIN32,
		BEOS,
		DIRECTFB,
		SVG,
		OS2,
		WIN32_PRINTING,
		QUARTZ_IMAGE,
		SCRIPT,
		QT,
		RECORDING,
		VG,
		GL,
		DRM,
		TEE,
		XML,
		SKIA,
	}

	interface SurfaceMethodList extends StaticMethodList {
		create_similar(
			other: Surface,
			content: CairoContent,
			width: number,
			height: number,
		): Surface;
		create_similar_image(
			other: Surface,
			format: CairoFormat,
			width: number,
			height: number,
		): ImageSurface;
		create_for_rectangle(
			target: Surface,
			x: number,
			y: number,
			width: number,
			height: number,
		): Surface;
		finish(): void;
		flush(): void;
		get_device(): Device;
		get_font_options(): FontOptions;
		get_content(): CairoContent;
		mark_dirty(): void;
		mark_dirty_rectangle(
			x: number,
			y: number,
			width: number,
			height: number,
		): void;
		set_device_offset(x_offset: number, y_offset: number): void;
		get_device_offset(x_offset: number, y_offset: number): void;
		get_device_scale(x_scale: number, y_scale: number): void;
		set_device_scale(x_scale: number, y_scale: number): void;
		set_fallback_resolution(
			x_pixels_per_inch: number,
			y_pixels_per_inch: number,
		): void;
		get_fallback_resolution(
			x_pixels_per_inch: number,
			y_pixels_per_inch: number,
		): void;
		get_type(): CairoSurfaceType;
		copy_page(): void;
		show_page(): void;
	}

	type Surface = SurfaceMethodList & {
		content: keyof typeof CairoContent;
		device: Device;
		status: keyof typeof CairoStatus;
		type: keyof typeof CairoSurfaceType;
	};

	type ImageSurface = Surface & {
		data: LuaUserdata;
		format: CairoFormat;
		width: number;
		height: number;
		stride: number;
	};
	// #endregion

	/**
	 * @noSelf
	 */
	export const cairo: {
		Antialias: typeof CairoAntialias;
		Context: StaticMethods<ContextMethodList, Context> & {
			create(target: Surface): Context;
			reference(cr: Context): Context;
			destroy(cr: Context): void;
			rectangle_list_destroy(rectangle_list: RectangleList): void;
			get_reference_count(cr: Context): number;
			set_user_data(
				cr: Context,
				key: LuaUserdata,
				user_data: LuaUserdata,
				destroy: CairoDestroyCallback,
			): CairoStatus;
			get_user_data(cr: Context, key: LuaUserdata): LuaUserdata;
			set_hairline(cr: Context, set_hairline: boolean): void;
			get_hairline(cr: Context): boolean;
		};
		Device: StaticMethods<DeviceMethodList, Device>;
		FontFace: StaticMethods<FontFaceMethodList, FontFace>;
		FontOptions: StaticMethods<FontOptionsMethodList, FontOptions>;
		FontSlant: typeof CairoFontSlant;
		FontType: typeof CairoFontType;
		FontWeight: typeof CairoFontWeight;
		Format: typeof CairoFormat & {
			cairo_format_stride_for_width(format: CairoFormat, width: number): number;
		};
		GradientPattern: StaticMethods<GradientPatternMethodList, Pattern>;
		HintMetrics: typeof CairoHintMetrics;
		HintStyle: typeof CairoHintStyle;
		ImageSurface: {
			create(format: CairoFormat, width: number, height: number): ImageSurface;
			create_for_data(
				data: LuaUserdata,
				format: CairoFormat,
				width: number,
				height: number,
				stride: number,
			): ImageSurface;
			get_data(surface: Surface): LuaUserdata;
			get_format(surface: Surface): CairoFormat;
			get_width(surface: Surface): number;
			get_height(surface: Surface): number;
			get_stride(surface: Surface): number;
		};
		LinearPattern: StaticMethods<LinearPatternMethodList, Pattern>;
		Matrix: StaticMethods<MatrixMethodList, Matrix> &
			((
				xx: number,
				yx: number,
				xy: number,
				yy: number,
				x0: number,
				y0: number,
			) => Matrix);
		MeshPattern: StaticMethods<MeshPatternMethodList, Pattern>;
		Operator: typeof CairoOperator;
		Pattern: StaticMethods<PatternMethodList, Pattern>;
		RadialPattern: StaticMethods<RadialPatternMethodList, Pattern>;
		Region: StaticMethods<RegionMethodList, Region>;
		ScaledFont: StaticMethods<ScaledFont, ScaledFont>;
		SolidPattern: StaticMethods<SolidPatternMethodList, Pattern>;
		Status: typeof CairoStatus & {
			cairo_status_to_string(status: CairoStatus): string;
		};
		Surface: StaticMethods<SurfaceMethodList, Surface> & {
			create_similar(
				other: Surface,
				content: CairoContent,
				width: number,
				height: number,
			): Surface;
			create_similar_image(
				other: Surface,
				format: CairoFormat,
				width: number,
				height: number,
			): ImageSurface;
			create_for_rectangle(
				target: Surface,
				x: number,
				y: number,
				width: number,
				height: number,
			): Surface;
			reference(surface: Surface): Surface;
			destroy(surface: Surface): void;
			status(surface: Surface): CairoStatus;
			finish(surface: Surface): void;
			flush(surface: Surface): void;
			get_device(surface: Surface): Device;
			get_font_options(surface: Surface): FontOptions;
			get_content(surface: Surface): CairoContent;
			mark_dirty(surface: Surface): void;
			mark_dirty_rectangle(
				surface: Surface,
				x: number,
				y: number,
				width: number,
				height: number,
			): void;
			set_device_offset(
				surface: Surface,
				x_offset: number,
				y_offset: number,
			): void;
			get_device_offset(
				surface: Surface,
				x_offset: number,
				y_offset: number,
			): void;
			get_device_scale(
				surface: Surface,
				x_scale: number,
				y_scale: number,
			): void;
			set_device_scale(
				surface: Surface,
				x_scale: number,
				y_scale: number,
			): void;
			set_fallback_resolution(
				surface: Surface,
				x_pixels_per_inch: number,
				y_pixels_per_inch: number,
			): void;
			get_fallback_resolution(
				surface: Surface,
				x_pixels_per_inch: number,
				y_pixels_per_inch: number,
			): void;
			get_type(surface: Surface): CairoSurfaceType;
			get_reference_count(surface: Surface): number;
			set_user_data(
				surface: Surface,
				key: LuaUserdata,
				user_data: LuaUserdata,
				destroy: CairoDestroyCallback,
			): CairoStatus;
			get_user_data(surface: Surface, key: LuaUserdata): LuaUserdata;
			copy_page(surface: Surface): void;
			show_page(surface: Surface): void;
			has_show_text_glyphs(surface: Surface): boolean;
			set_mime_data(
				surface: Surface,
				mime_type: string,
				data: LuaUserdata,
				length: number,
				destroy: CairoDestroyCallback,
				closure: LuaUserdata,
			): CairoStatus;
			get_mime_data(
				surface: Surface,
				mime_type: string,
				data: LuaUserdata,
				length: number,
			): void;
			supports_mime_type(surface: Surface, mime_type: string): boolean;
			map_to_image(surface: Surface, extents: Rectangle): Surface;
			unmap_image(surface: Surface, image: Surface): void;
		};
		SurfacePattern: StaticMethods<SurfacePatternMethodList, Pattern>;
		ToyFontFace: StaticMethods<ToyFontFaceMethodList, ToyFontFace>;
	};
}
