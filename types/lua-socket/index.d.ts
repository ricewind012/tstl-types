/**
 * @see https://lunarmodules.github.io/luasocket/ltn12.html
 * @noSelf
 */
declare module "ltn12" {
	type LTN12Filter = (...args: any[]) => any;
	type LTN12PumpStep = LuaMultiReturn<[1] | [undefined, string]>;
	type LTN12Sink = LuaMultiReturn<[1] | [undefined, string]>;
	type LTN12Source = LuaMultiReturn<[1] | [undefined, string]>;

	export const filter: {
		/**
		 * Returns a filter that passes all data it receives through each of a
		 * series of given filters.
		 *
		 * @returns the chained filter.
		 */
		chain<T extends LTN12Filter>(...filters: T[]): T;

		/**
		 * Returns a high-level filter that cycles though a low-level filter by
		 * passing it each chunk and updating a context between calls.
		 *
		 * @param low The low-level filter to be cycled
		 * @param ctx The initial context
		 * @param extra Any extra argument the low-level filter might take
		 * @returns the high-level filter.
		 */
		cycle<T>(
			low: (ctx: any, chunk?: T, extra?: any) => LuaMultiReturn<[T, string]>,
			ctx: any,
			extra?: any,
		): (chunk: T) => any;
	};

	export const pump: {
		/**
		 * Pumps *all* data from a `source` to a `sink`.
		 *
		 * @returns a value that evaluates to `true` if successful, otherwise
		 * `false` followed by an error message.
		 */
		all(source: LTN12Source, sink: LTN12Sink): LTN12PumpStep;

		/**
		 * Pumps *one* chunk of data from a `source` to a `sink`.
		 *
		 * @returns a value that evaluates to `true` if successful, otherwise
		 * `false` followed by an error message.
		 */
		step(source: LTN12Source, sink: LTN12Sink): LTN12PumpStep;
	};

	export const sink: {
		/**
		 * Creates and returns a new sink that passes data through a filter
		 * before sending it to a given sink.
		 *
		 * @param filter
		 * @param sink
		 */
		chain(filter: (...args: any[]) => any, sink: LTN12Sink): LTN12Sink;

		/**
		 * Creates and returns a sink that aborts transmission with the error
		 * `message`.
		 */
		error(message: string): LTN12Sink;

		/**
		 * Creates a sink that sends data to a file.
		 *
		 * @param handle A file handle. If `nil`, `message` should give the
		 * reason for failure.
		 * @param message
		 * @returns a sink that sends all data to the given `handle` and closes
		 * the file when done, or a sink that aborts the transmission with the
		 * error message.
		 */
		file(
			handle: LuaMultiReturn<[LuaFile] | [undefined, string, number]>,
			message?: string,
		): LTN12Sink;

		/**
		 * Returns a sink that ignores all data it receives.
		 */
		null(): () => 1;

		/**
		 * Creates and returns a simple sink given a fancy `sink`.
		 */
		simplify(sink: LTN12Sink): LTN12Sink;

		/**
		 * Creates a sink that stores all chunks in a table. The chunks can
		 * later be efficiently concatenated into a single string.
		 *
		 * @param table Used to hold the chunks. If `nil`, the function creates
		 * its own table.
		 * @returns the sink and the table used to store the chunks.
		 */
		table<T>(table?: T[]): LuaMultiReturn<[(content: T) => 1, T[]]>;
	};

	export const source: {
		/**
		 * Creates a new source that produces the concatenation of the data
		 * produced by a number of sources.
		 *
		 * @returns the new source.
		 */
		cat(...sources: LTN12Source[]): LTN12Source;

		/**
		 * Creates a new source that passes data through a filter before
		 * returning it.
		 *
		 * @returns the new source.
		 */
		chain(source: LTN12Source, filter: LTN12Filter): LTN12Source;

		/**
		 * Creates and returns an empty source.
		 */
		empty(): LTN12Source;

		/**
		 * Creates and returns a source that aborts transmission with the error
		 * message.
		 */
		error(message: string): LTN12Source;

		/**
		 * Creates a source that produces the contents of a file.
		 *
		 * @param handle A file handle. If `nil`, `message` should give the
		 * reason for failure.
		 * @param message
		 * @returns a source that reads chunks of data from given handle and
		 * returns it to the user, closing the file when done, or a source that
		 * aborts the transmission with the error message.
		 */
		file(
			handle: LuaMultiReturn<[LuaFile] | [undefined, string, number]>,
			message?: string,
		): LTN12Source;
	};
}

/**
 * @see https://lunarmodules.github.io/luasocket/mime.html
 * @noSelf
 */
declare module "mime" {
	type EOFMarker = "\r" | "\n" | "\r\n";

	type TransferContentEncoding = "base64" | "quoted-printable";

	/**
	 * Returns a filter that decodes data from a given transfer content
	 * encoding.
	 */
	export function decode(
		what: TransferContentEncoding,
	): (text: string) => string;

	/**
	 * Returns a filter that encodes data according to a given transfer content
	 * encoding.
	 */
	export function encode<T extends TransferContentEncoding>(
		what: T,
		mode?: T extends "quoted-printable" ? "text" | "binary" : never,
	): (text: string) => string;

	/**
	 * Converts most common end-of-line markers to a specific given marker.
	 *
	 * @param marker The new marker. It defaults to CRLF, the canonic
	 * end-of-line marker defined by the MIME standard.
	 */
	export function normalize(marker?: EOFMarker): (text: string) => string;

	/**
	 * Creates and returns a filter that performs stuffing of SMTP messages.
	 *
	 * Note: The {@link smtp.send} function uses this filter automatically. You
	 * don't need to chain it with your source, or apply it to your message
	 * body.
	 */
	export function stuff(): (text: string) => string;

	export function wrap<T extends TransferContentEncoding | "text">(
		what: T,
		length?: T extends "text" ? number : never,
	): (text: string) => string;

	/**
	 * Low-level filter to perform Base64 encoding.
	 *
	 * @param content The string to encode.
	 * @param d If `nil`, the returned string is padded with the encoding of the
	 * remaining bytes of `content`.
	 * @returns
	 * - `string` The encoded version of the largest prefix of C..D that can be
	 *   encoded unambiguously.
	 * - `number` The remaining bytes of C..D, *before* encoding.
	 */
	export function b64(
		content: string,
		d?: number,
	): LuaMultiReturn<[string, number | undefined]>;

	/**
	 * Low-level filter to perform SMTP stuffing and enable transmission of
	 * messages containing the sequence "CRLF.CRLF".
	 *
	 * @param chars The number of characters from the sequence CRLF seen in the
	 * start. Note: The message body is defined to begin with an implicit CRLF.
	 * Therefore, to stuff a message correctly, it should have the value `2`.
	 * @param content The string to perform stuffing on.
	 * @returns
	 * - `string` The stuffed string.
	 * - `number` The number of characters from the sequence CRLF seen in the
	 *   end of `content`.
	 */
	export function dot(
		chars: number,
		content?: string,
	): LuaMultiReturn<[string, number]>;

	/**
	 * Low-level filter to perform end-of-line marker translation. For each
	 * chunk, the function needs to know if the last character of the previous
	 * chunk could be part of an end-of-line marker or not. This is the context
	 * the function receives besides the chunk. An updated version of the
	 * context is returned after each new chunk.
	 *
	 * @param ascii The ASCII value of the last character of the previous chunk,
	 * if it was a candidate for line break, or 0 otherwise.
	 * @param content The string to translate.
	 * @param marker Gives the new end-of-line marker and defaults to CRLF.
	 * @returns
	 * - `string` The translated version of the given string.
	 * - `number` The same as `C`, but for the current chunk.
	 */
	export function eol(
		ascii: number,
		content?: string,
		marker?: EOFMarker,
	): LuaMultiReturn<[string, number]>;

	/**
	 * Low-level filter to perform Quoted-Printable encoding.
	 *
	 * @param marker Throughout encoding, occurrences of CRLF are replaced by
	 * the marker, which itself defaults to CRLF.
	 * @returns
	 * - `string` The encoded version of the largest prefix of C..D that can be
	 *   encoded unambiguously. If D is `nil`, A is padded with the encoding of
	 *   the remaining bytes of C.
	 * - `number` The remaining bytes of C..D, *before* encoding.
	 */
	export function qp(
		c: string,
		d?: any,
		marker?: EOFMarker,
	): LuaMultiReturn<[string, number]>;

	/**
	 * Low-level filter to break Quoted-Printable text into lines.
	 *
	 * @param bytes How many bytes are left for the first line of the content.
	 * @param content The text to wrap.
	 * @param length Max length for content. Defaults to 76.
	 * @returns
	 * - `string` A string that is broken into lines of at most `length` bytes.
	 * - `number` The number of bytes left in the last line of the returned
	 *   string.
	 */
	export function qpwrp(
		bytes: number,
		content?: number,
		length?: number,
	): LuaMultiReturn<[string, number]>;

	/**
	 * Low-level filter to perform Base64 decoding.
	 *
	 * @param c
	 * @param d
	 * @returns
	 * - `string` The decoded version of the largest prefix of C..D that can be
	 *   decoded unambiguously. If D is `nil`, A is the empty string and B
	 *   returns whatever couldn't be decoded.
	 * - `number` The remaining bytes of C..D, *before* decoding.
	 */
	export function unb64(
		c: string,
		d?: string,
	): LuaMultiReturn<[string, number]>;

	/**
	 * Low-level filter to remove the Quoted-Printable transfer content encoding
	 * from data.
	 *
	 * @param c
	 * @param d
	 * @returns
	 * - `string` The decoded version of the largest prefix of C..D that can be
	 *   decoded unambiguously. If D is `nil`, A is augmented with the encoding
	 *   of the remaining bytes of C.
	 * - `number` The remaining bytes of C..D, *before* decoding.
	 */
	export function unqp(c: string, d?: string): LuaMultiReturn<[string, number]>;

	/**
	 * Low-level filter to break text into lines with CRLF marker. Text is
	 * assumed to be in the {@link normalize} form.
	 *
	 * @param bytes How many bytes are left for the first line of the content.
	 * @param content The text to wrap.
	 * @param length Max length for content. Defaults to 76.
	 * @returns
	 * - `string` A string that is broken into lines of at most `length` bytes.
	 * - `number` The number of bytes left in the last line of the returned
	 *   string.
	 */
	export function wrp(
		bytes: number,
		content?: number,
		length?: number,
	): LuaMultiReturn<[string, number]>;
}

/**
 * @see
 * @noSelf
 */
declare module "socket" {
	import type { LTN12Sink, LTN12Source } from "ltn12";
	import type { SocketFamily } from "socket.dns";

	enum SocketSinkMode {
		/**
		 * Sends data through socket after applying the chunked transfer coding,
		 * closing the socket when done.
		 */
		HTTP_CHUNKED = "http-chunked",

		/**
		 * Sends all received data through the socket, closing the socket when
		 * done.
		 */
		CLOSE_WHEN_DONE = "close-when-done",

		/**
		 * Sends all received data through the socket, leaving it open when
		 * done.
		 */
		KEEP_OPEN = "keep-open",
	}

	enum SocketSourceMode {
		/**
		 * Receives data from socket and removes the *chunked transfer coding*
		 * before returning the data.
		 */
		HTTP_CHUNKED = "http-chunked",

		/**
		 * Receives a fixed number of bytes from the socket. This mode requires
		 * the extra argument length.
		 */
		BY_LENGTH = "by-length",

		/**
		 * Receives data from a socket until the other side closes the
		 * connection.
		 */
		UNTIL_CLOSED = "until-closed",
	}

	interface SocketOptionMap {
		/**
		 * Setting this option to `true` enables the periodic transmission of
		 * messages on a connected socket. Should the connected party fail to
		 * respond to these messages, the connection is considered broken and
		 * processes using the socket are notified.
		 */
		keepalive: boolean;

		/**
		 * Controls the action taken when unsent data are queued on a socket and
		 * a close is performed.
		 */
		linger: {
			timeout: number;

			/**
			 * If true, the system will block the process on the close attempt
			 * until it is able to transmit the data or until 'timeout' has
			 * passed. If false and a close is issued, the system will process
			 * the close in a manner that allows the process to continue as
			 * quickly as possible. I do not advise you to set this to anything
			 * other than zero.
			 */
			on: boolean;
		};

		/**
		 * Setting this option indicates that the rules used in validating
		 * addresses supplied in a call to {@link bind} should allow reuse of
		 * local addresses.
		 */
		reuseaddr: boolean;

		/**
		 * Setting this option to `true` disables the Nagle's algorithm for the
		 * connection.
		 */
		"tcp-nodelay": boolean;
	}

	interface SocketOptionSettableMap extends SocketOptionMap {
		/**
		 * value in seconds for `TCP_KEEPIDLE`, Linux only!!
		 */
		"tcp-keepidle": number;

		/**
		 * value in seconds for `TCP_KEEPCNT`, Linux only!!
		 */
		"tcp-keepcnt": number;

		/**
		 * value in seconds for `TCP_KEEPINTVL`, Linux only!!
		 */
		"tcp-keepintvl": number;

		/**
		 * value in seconds for `TCP_DEFER_ACCEPT`, Linux only!!
		 */
		"tcp-defer-accept": number;

		/**
		 * value in seconds for `TCP_FASTOPEN`, Linux only!!
		 */
		"tcp-fastopen": number;

		/**
		 * value in seconds for `TCP_FASTOPEN_CONNECT`, Linux only!!
		 */
		"tcp-fastopen-connect": number;

		/**
		 * Setting this option to `true` restricts an inet6 socket to sending
		 * and receiving only IPv6 packets.
		 */
		"ipv6-v6only": boolean;
	}

	interface SocketOptions {
		/**
		 * Gets options for the TCP object.
		 */
		getoption<K extends keyof SocketOptionMap>(
			option: K,
		): LuaMultiReturn<[SocketOptionMap[K] | [undefined, string]]>;

		/**
		 * Sets options for the TCP object. Options are only needed by low-level
		 * or time-critical applications. You should only modify an option if
		 * you are sure you need it.
		 */
		setoption<K extends keyof SocketOptionSettableMap>(
			option: K,
			value: SocketOptionSettableMap[K],
		): LuaMultiReturn<[1] | [undefined, string]>;
	}

	interface Socket {
		/**
		 * Closes a TCP object. The internal socket used by the object is closed
		 * and the local address to which the object was bound is made available
		 * to other applications. No further operations (except for further
		 * calls to the `close` method) are allowed on a closed socket.
		 *
		 * Note: It is important to close all used sockets once they are not
		 * needed, since, in many systems, each socket uses a file descriptor,
		 * which are limited system resources. Garbage-collected objects are
		 * automatically closed before destruction, though.
		 */
		close(): void;

		/**
		 * Check the read buffer status.
		 *
		 * Note: **This is an internal method, use at your own risk.**
		 *
		 * @returns `true` if there is any data in the read buffer, `false`
		 * otherwise.
		 */
		dirty(): boolean;

		/**
		 * Gets the underling socket descriptor or handle associated to the
		 * object.
		 *
		 * Note: **This is an internal method, use at your own risk.**
		 *
		 * @returns the descriptor or handle. In case the object has been
		 * closed, the return value will be `-1`. For an invalid socket it will
		 * be {@link _SOCKETINVALID}.
		 */
		getfd(): number;

		/**
		 * @returns the local address information associated to the object:
		 * - `string` Local IP address
		 * - `number` Local port
		 * - `SocketFamily` `inet` or `inet6`
		 *
		 * In case of error, `nil`.
		 */
		getsockname(): LuaMultiReturn<[string, number, SocketFamily] | [undefined]>;

		/**
		 * Gets accounting information on the socket, useful for throttling of
		 * bandwidth.
		 *
		 * @returns
		 * - `number` Number of bytes received
		 * - `number` Number of bytes sent
		 * - `number` The age of the socket object in seconds
		 */
		getstats(): LuaMultiReturn<[number, number, number]>;

		/**
		 * @returns the current block timeout followed by the curent total
		 * timeout.
		 */
		gettimeout(): LuaMultiReturn<[number, number]>;

		/**
		 * Resets accounting information on the socket, useful for throttling of
		 * bandwidth.
		 *
		 * @param received Number with the new number of bytes received
		 * @param sent Number with the new number of bytes sent
		 * @param age The new age in seconds
		 */
		setstats(received: number, sent: number, age: number): 1 | undefined;

		/**
		 * Changes the timeout values for the object. By default, all I/O
		 * operations are blocking. That is, any call to the methods
		 * {@link send}, {@link receive}, and {@link accept} will block
		 * indefinitely, until the operation completes. The settimeout method
		 * defines a limit on the amount of time the I/O methods can block. When
		 * a timeout is set and the specified amount of time has elapsed, the
		 * affected methods give up and fail with an error code.
		 *
		 * There are two timeout modes and both can be used together for fine
		 * tuning:
		 *
		 * - 'b': *block* timeout. Specifies the upper limit on the amount of
		 *   time LuaSocket can be blocked by the operating system while waiting
		 *   for completion of any single I/O operation. This is the default
		 *   mode;
		 * - 't': *total* timeout. Specifies the upper limit on the amount of
		 *   time LuaSocket can block a Lua script before returning from a call.
		 *
		 * The `nil` timeout value allows operations to block indefinitely.
		 * Negative timeout values have the same effect.
		 *
		 * Note: although timeout values have millisecond precision in
		 * LuaSocket, large blocks can cause I/O functions not to respect
		 * timeout values due to the time the library takes to transfer blocks
		 * to and from the OS and to and from the Lua interpreter. Also,
		 * function that accept host names and perform automatic name resolution
		 * might be blocked by the resolver for longer than the specified
		 * timeout value.
		 *
		 * @param value The amount of time to wait (in seconds)
		 * @param mode
		 */
		settimeout(value: number, mode?: "b" | "t"): void;

		/**
		 * Sets the underling socket descriptor or handle associated to the
		 * object. The current one is simply replaced, not closed, and no other
		 * change to the object state is made. To set it as invalid use
		 * {@link _SOCKETINVALID}.
		 *
		 * Note: **This is an internal method, use at your own risk.**
		 */
		setfd(fd: number): void;
	}

	interface MasterSocket extends Socket {
		/**
		 * Binds a master object to address and port on the local host.
		 *
		 * @param address Can be an IP address or a host name. If `*`, the
		 * system binds to all local interfaces using the `INADDR_ANY` constant
		 * or `IN6ADDR_ANY_INIT`, according to the family.
		 * @param port An integer number in the range [0..64K). If 0, the system
		 * automatically chooses an ephemeral port.
		 */
		bind(
			address: string,
			port: number,
		): LuaMultiReturn<[1] | [undefined, string]>;

		/**
		 * Attempts to connect a master object to a remote host, transforming it
		 * into a client object.
		 *
		 * @param address Can be an IP address or a host name.
		 * @param port An integer number in the range [0..64K).
		 */
		connect(
			address: string,
			port: number,
		): LuaMultiReturn<[1] | [undefined, string]>;

		/**
		 * Specifies the socket is willing to receive connections, transforming
		 * the object into a server object.
		 *
		 * @param backlog The number of client connections that can be queued
		 * waiting for service. If the queue is full and another client attempts
		 * connection, the connection is refused.
		 */
		listen(backlog: number): LuaMultiReturn<[1] | [undefined, string]>;
	}

	interface ClientSocket extends Socket, SocketOptions {
		/**
		 * @returns
		 * - `string` The IP address of the peer
		 * - `number` The port number that peer is using for the connection
		 * - `SocketFamily` A string with the family ("inet" or "inet6").
		 *
		 * In case of error, the method returns `nil`.
		 */
		getpeername(): LuaMultiReturn<[string, number, SocketFamily] | [undefined]>;

		/**
		 * Reads data from a client object, according to the specified read
		 * pattern. Patterns follow the Lua file I/O format, and the difference
		 * in performance between all patterns is negligible.
		 *
		 * @param pattern Can be any of the following:
		 * - `*a`: reads from the socket until the connection is closed. No
		 *   end-of-line translation is performed;
		 * - `*l`: reads a line of text from the socket. The line is terminated
		 *   by a LF character (ASCII 10), optionally preceded by a CR character
		 *   (ASCII 13). The CR and LF characters are not included in the
		 *   returned line. In fact, all CR characters are ignored by the
		 *   pattern. This is the default pattern;
		 * - `number`: causes the method to read a specified number of bytes
		 *   from the socket.
		 * @param prefix A string to be concatenated to the beginning of any
		 * received data before return.
		 * @returns If successful, the method returns the received pattern. In
		 * case of error, the method returns `nil` followed by an error message,
		 * followed by a (possibly empty) string containing the partial that was
		 * received. The error message can be the string `closed` in case the
		 * connection was closed before the transmission was completed or the
		 * string `timeout` in case there was a timeout during the operation.
		 */
		receive(
			pattern?: "*a" | "*l" | number,
			prefix?: string,
		): LuaMultiReturn<[string] | [undefined, string, string, number]>;

		/**
		 * Sends data through client object. The optional arguments i and j work
		 * exactly like the standard `string.sub` Lua function to allow the
		 * selection of a substring to be sent.
		 *
		 * Note: Output is not buffered. For small strings, it is always better
		 * to concatenate them in Lua (with the '..' operator) and send the
		 * result in one call instead of calling the method several times.
		 *
		 * @param data The string to be sent.
		 * @param i
		 * @param j
		 * @returns
		 * If successful:
		 * - `number` The index of the last byte within [i, j] that has been
		 *   sent. Notice that, if `i` is 1 or absent, this is effectively the
		 *   total number of bytes sent.
		 *
		 * In case of error:
		 * - `nil`
		 * - `string` The error message. The error message can be `closed` in
		 *   case the connection was closed before the transmission was
		 *   completed or the string `timeout` in case there was a timeout
		 *   during the operation.
		 * - `number` The index of the last byte within [i, j] that has been
		 *   sent. You might want to try again from the byte following that.
		 */
		send(
			data: string,
			i?: number,
			j?: number,
		): LuaMultiReturn<[number] | [undefined, string, number]>;

		/**
		 * Shuts down part of a full-duplex connection.
		 *
		 * @param mode Tells which way of the connection should be shut down and
		 * can take the value:
		 * - `both`: disallow further sends and receives on the object. This is
		 *   the default mode;
		 * - `send`: disallow further sends on the object;
		 * - `receive`: disallow further receives on the object.
		 */
		shutdown(mode: "both" | "send" | "receive"): 1;
	}

	interface ServerSocket extends Socket, SocketOptions {
		/**
		 * Waits for a remote connection on the server object and returns a
		 * client object representing that connection.
		 *
		 * If a connection is successfully initiated, a client object is
		 * returned. In the case of error, returns `nil` followed by a message
		 * describing the error.
		 */
		accept(): LuaMultiReturn<[ClientSocket] | [undefined, string]>;
	}

	/**
	 * Default datagram size used by calls to {@link receive} and
	 * {@link receivefrom}. Unless changed in compile time, the value is 8192.
	 */
	export const _DATAGRAMSIZE: number;

	/**
	 * This constant is set to true if the library was compiled with debug
	 * support.
	 */
	export const _DEBUG: boolean;

	/**
	 * The maximum number of sockets that the {@link select} function can
	 * handle.
	 */
	export const _SETSIZE: number;

	/**
	 * This constant has a string describing the current LuaSocket version.
	 */
	export const _VERSION: string;

	export const BLOCKSIZE: number;

	/**
	 * A shortcut that creates and returns a TCP server object bound to a local
	 * address and port, ready to accept client connections.
	 *
	 * @param address
	 * @param port
	 * @param backlog The number of client connections that can be queued
	 * waiting for service. See {@link MasterSocket.listen}.
	 */
	export function bind(
		address: string,
		port: number,
		backlog?: number,
	): ServerSocket;

	/**
	 * This function is a shortcut that creates and returns a TCP client object
	 * connected to a remote address at a given port.
	 *
	 * @param family Without specifying family to connect, whether a tcp or tcp6
	 * connection is created depends on your system configuration.
	 */
	export function connect4(
		address: string,
		port: number,
		locaddr?: string,
		locport?: number,
		family?: SocketFamily,
	): ClientSocket;
	export function connect6(
		address: string,
		port: number,
		locaddr?: string,
		locport?: number,
		family?: SocketFamily,
	): ClientSocket;

	/**
	 * Returns the UNIX time in seconds.
	 */
	export function gettime(): number;

	/**
	 * Creates and returns a clean {@link try} function that allows for cleanup
	 * before the exception is raised.
	 *
	 * @param finalizer A function that will be called before {@link try} throws
	 * the exception.
	 * @returns your customized try function.
	 */
	export function newtry<T extends (...args: unknown[]) => any>(
		finalizer: T,
	): T;

	/**
	 * Converts a function that throws exceptions into a safe function. This
	 * function only catches exceptions thrown by the {@link try} and
	 * {@link newtry} functions. It does not catch normal Lua errors.
	 *
	 * @param func A function that calls {@link try} (or `assert`, or `error`)
	 * to throw exceptions.
	 * @returns an equivalent function that instead of throwing exceptions in
	 * case of a failed {@link try} call, returns `nil` followed by an error
	 * message.
	 */
	export function protect<T extends (...args: unknown[]) => any>(
		func: T,
	): (
		...args: Parameters<T>
	) => LuaMultiReturn<[ReturnType<T>] | [undefined, string]>;

	/**
	 * Waits for a number of sockets to change status.
	 *
	 * @param recvt An array with the sockets to test for characters available
	 * for reading.
	 * @param sendt Sockets that are watched to see if it is OK to immediately
	 * write on them.
	 * @param timeout The maximum amount of time (in seconds) to wait for a
	 * change in status.
	 * @returns a list with the sockets ready for reading, a list with the
	 * sockets ready for writing and an error message. The error message is
	 * "timeout" if a timeout condition was met, "select failed" if the call to
	 * select failed, and `nil` otherwise. The returned tables are doubly keyed
	 * both by integers and also by the sockets themselves, to simplify the test
	 * if a specific socket has changed status.
	 */
	export function select(
		recvt: Socket[],
		sendt: Socket[],
		timeout?: number,
	): LuaMultiReturn<[Socket[], Socket[], string | undefined]>;

	/**
	 * Creates an LTN12 sink from a stream socket object.
	 *
	 * @param mode The behavior of the sink.
	 * @param socket The stream socket object used to send the data.
	 * @returns a sink with the appropriate behavior.
	 */
	export function sink(mode: SocketSinkMode, socket: Socket): LTN12Sink;

	/**
	 * Drops a number of arguments and returns the remaining.
	 *
	 * @param d The number of arguments to drop.
	 * @param ret The arguments.
	 * @returns retd+1 to retN.
	 */
	export function skip<T extends any[]>(
		d: number,
		...ret: T
	): LuaMultiReturn<T>;

	/**
	 * Freezes the program execution during a given amount of time.
	 *
	 * @param time The number of seconds to sleep for. If time is negative, the
	 * function returns immediately.
	 */
	export function sleep(time: number): void;

	/**
	 * Creates an LTN12 source from a stream socket object.
	 *
	 * @param mode The behavior of the source.
	 * @param socket The stream socket object used to receive the data.
	 * @param length
	 * @returns a source with the appropriate behavior.
	 */
	export function source(
		mode: SocketSourceMode,
		socket: Socket,
		length?: number,
	): LTN12Source;

	// "try" is... reserved lol
}

/**
 * @see https://lunarmodules.github.io/luasocket/dns.html
 * @noSelf
 */
declare module "socket.dns" {
	type SocketFamily = "inet" | "inet6";

	interface ResolverInfo {
		family: SocketFamily;
		addr: string;
	}

	interface GetAddressInfoResult {
		ip: string[];
		name: string;
		alias: string[];
	}

	/**
	 * Converts from host name to address.
	 *
	 * Address can be an IPv4 or IPv6 address or host name.
	 *
	 * @returns
	 * In case of error: `nil` followed by an error message.
	 *
	 * If successful: a table with all information returned by the resolver.
	 */
	export function getaddrinfo(
		address: string,
	): LuaMultiReturn<[ResolverInfo[]] | [undefined, string]>;

	/**
	 * Returns the standard host name for the machine as a string.
	 */
	export function gethostname(): string;

	/**
	 * Converts from IPv4 address to host name.
	 *
	 * Address can be an IP address or host name.
	 *
	 * @returns
	 * In case of error: `nil` followed by an error message.
	 * If successful:
	 * - `string` The canonic host name of the given address
	 * - `GetAddressInfoResult` A table with all information returned by the
	 *   resolver.
	 */
	export function tohostname(
		address: string,
	): LuaMultiReturn<[string, GetAddressInfoResult] | [undefined, string]>;

	/**
	 * Converts from IPv4 address to host name.
	 *
	 * Address can be an IP address or host name.
	 *
	 * @returns
	 * In case of error: `nil` followed by an error message.
	 * If successful:
	 * - `string` The canonic host name of the given address
	 * - `GetAddressInfoResult` A table with all information returned by the
	 *   resolver.
	 */
	export function toip(
		address: string,
	): LuaMultiReturn<[string, GetAddressInfoResult] | [undefined, string]>;
}

/**
 * @see https://lunarmodules.github.io/luasocket/ftp.html
 * @noSelf
 */
declare module "socket.ftp" {
	import type { LTN12PumpStep, LTN12Sink } from "ltn12";

	interface FTPConnectionOptions {
		/**
		 * The server to connect to.
		 */
		host: string;

		/**
		 * The target path to the resource in the server.
		 */
		argument: string;

		/**
		 * The target path to the resource in the server.
		 */
		path?: string;

		/**
		 * User name used for authentication.
		 * @default "ftp:anonymous@anonymous.org"
		 */
		user?: string;

		/**
		 * Password used for authentication.
		 */
		password?: string;

		/**
		 * The FTP command used to obtain data.
		 * @default "retr"
		 */
		command?: string;

		/**
		 * The port to used for the control connection.
		 * @default 21
		 */
		port?: number;

		/**
		 * The transfer mode. Defaults to whatever is the server default.
		 */
		type?: "i" | "a";

		/**
		 * LTN12 pump step function used to pass data from the server to the
		 * sink. Defaults to the LTN12 `pump.step` function.
		 */
		step?: LTN12PumpStep;

		/**
		 * A function to be used instead of `socket.tcp` when the communications
		 * socket is created.
		 */
		create?: (...args: unknown[]) => any;
	}

	/**
	 * Downloads the contents of a URL and returns it as a string.
	 *
	 * If successful, the simple version returns the URL contents as a
	 * string, and the generic function returns `1`. In case of error, both
	 * functions return `nil` and an error message describing the error.
	 */
	export function get(url: string): string;
	export function get(
		args: FTPConnectionOptions & {
			/**
			 * A simple LTN12 sink that will receive the downloaded data.
			 */
			sink: LTN12Sink;
		},
	): LuaMultiReturn<[1] | [undefined, string]>;

	/**
	 * Upload a string of content into a URL.
	 *
	 * Both functions return `1` if successful, or `nil` and an error
	 * message describing the reason for failure.
	 */
	export function put(
		url: string,
		content: string,
	): LuaMultiReturn<[1] | [undefined, string]>;
	export function put(
		options: FTPConnectionOptions & {
			/**
			 * The simple LTN12 source that will provide the contents to be
			 * uploaded.
			 */
			source: LTN12Sink;
		},
	): LuaMultiReturn<[1] | [undefined, string]>;
}

/**
 * @see https://lunarmodules.github.io/luasocket/http.html
 * @noSelf
 */
declare module "socket.http" {
	import type { LTN12PumpStep, LTN12Sink, LTN12Source } from "ltn12";

	interface HTTPRequestOptions {
		url: string;

		/**
		 *
		 */
		sink?: LTN12Sink;

		/**
		 * The HTTP request method.
		 * @default "GET"
		 */
		method?: "GET" | "HEAD" | "POST";

		/**
		 * Any additional HTTP headers to send with the request.
		 */
		headers?: Record<string, string | number>;

		/**
		 * Simple LTN12 source to provide the request body. If there is a body,
		 * you need to provide an appropriate "content-length" request header
		 * field, or the function will attempt to send the body as "chunked"
		 * (something few servers support). Defaults to the empty source.
		 */
		source?: LTN12Source;

		/**
		 * LTN12 pump step function used to move data. Defaults to the LTN12
		 * `pump.step` function.
		 */
		step?: LTN12PumpStep;

		/**
		 * The URL of a proxy server to use. Defaults to no proxy.
		 */
		proxy?: string;

		/**
		 * Set to `false` to prevent the function from automatically following
		 * 301 or 302 server redirect messages
		 */
		redirect?: boolean;

		/**
		 * A function to be used instead of `socket.tcp` when the communications
		 * socket is created.
		 */
		create?: (...args: unknown[]) => any;

		/**
		 * A number specifying the maximum number of redirects to follow. A
		 * boolean `false` value means no maximum (unlimited).
		 * @default 5
		 */
		maxredirects?: false | number;
	}

	/**
	 * The request function has two forms. The simple form downloads a URL using
	 * the GET or POST method and is based on strings. The generic form performs
	 * any HTTP method and is LTN12 based.
	 *
	 * @returns
	 * In case of failure: `nil` followed by an error message.
	 *
	 * If successful:
	 * - `string` The response body
	 * - `number` The response status code
	 * - `Record<string, string | number>` The response headers
	 * - `any` The response status line
	 *
	 * The generic function returns the same information, except the first
	 * return value is just the number `1` (the body goes to the sink).
	 */
	export function request(
		url: string,
		body?: string,
	): LuaMultiReturn<
		[string, number, Record<string, string | number>, any] | [undefined, string]
	>;
	export function request(
		options: HTTPRequestOptions,
	): LuaMultiReturn<
		[1, number, Record<string, string | number>, any] | [undefined, string]
	>;
}

/**
 * @see https://lunarmodules.github.io/luasocket/smtp.html
 * @noSelf
 */
declare module "socket.smtp" {
	import type { LTN12PumpStep, LTN12Source } from "ltn12";

	interface Message {
		body: LTN12Source | string | MultipartMessage;
		headers: Record<string, string | number>;
	}

	interface MultipartMessage {
		preamble: string;
		epilogue: string;
		[index: number]: Message;
	}

	interface SendOptions {
		/**
		 * The sender e-mail.
		 */
		from: string;

		/**
		 * A table with one entry for each recipient e-mail address, or a string
		 * in case there is just one recipient.
		 */
		rcpt: string | string[];

		/**
		 * The contents of the message.
		 */
		source: LTN12Source;

		/**
		 * User name used for authentication.
		 */
		user?: string;

		/**
		 * Password used for authentication.
		 */
		password?: string;

		/**
		 * Server to connect to.
		 * @default "localhost"
		 */
		server?: string;

		/**
		 * Port to connect to.
		 * @default 25
		 */
		port?: number;

		/**
		 * Domain name used to greet the server; Defaults to the local machine
		 * host name.
		 */
		domain?: string;

		/**
		 * LTN12 pump step function used to pass data from the source to the
		 * server. Defaults to the LTN12 `pump.step` function.
		 */
		step?: LTN12PumpStep;

		/**
		 * A function to be used instead of `socket.tcp` when the communications socket is created.
		 */
		create?: (...args: unknown[]) => any;
	}

	/**
	 * Returns a *simple* LTN12 source that sends an SMTP message body, possibly
	 * multipart (arbitrarily deep).
	 *
	 * @param mesgt
	 */
	export function message(mesgt: Message): LTN12Source;

	/**
	 * Sends a message to a recipient list. Since sending messages is not as
	 * simple as downloading an URL from a FTP or HTTP server, this function
	 * doesn't have a simple interface. However, see the {@link message} source
	 * factory for a very powerful way to define the message contents.
	 */
	export function send(
		options: SendOptions,
	): LuaMultiReturn<[1] | [undefined, string]>;
}

/**
 * @see https://lunarmodules.github.io/luasocket/url.html
 * @noSelf
 */
declare module "socket.url" {
	interface ParsedURL {
		url: string;
		scheme: string;
		authority: string;
		path: string;
		params: string;
		query: string;
		fragment: string;
		userinfo: string;
		host: string;
		port: string;
		user: string;
		password: string;
	}

	/**
	 * Builds an absolute URL from a base URL and a relative URL.
	 *
	 * @param base The base URL or a parsed URL table
	 * @param relative The relative URL
	 * @returns a string with the absolute URL.
	 */
	export function absolute(base: string, relative: string): string;

	/**
	 * Rebuilds an URL from its parts.
	 *
	 * @param parsed_url A table with same components returned by {@link parse}.
	 * Lower level components, if specified, take precedence over high level
	 * components of the URL grammar.
	 * @returns a string with the built URL.
	 */
	export function build(parsed_url: object): string;

	/**
	 * Builds a `path` component from a list of `segment` parts. Before
	 * composition, any reserved characters found in a segment are escaped into
	 * their protected form, so that the resulting path is a valid URL path
	 * component.
	 *
	 * @param segments A list of strings with the `segment` parts.
	 * @param unsafe If anything but `nil`, reserved characters are left
	 * untouched.
	 * @returns a string with the built `path` component.
	 */
	export function build_path(segments: string[], unsafe?: boolean): string;

	/**
	 * Applies the URL escaping content coding to a string. Each byte is encoded
	 * as a percent character followed by the two byte hexadecimal
	 * representation of its integer value.
	 *
	 * @param content The string to be encoded.
	 * @returns the encoded string.
	 */
	export function escape(content: string): string;

	/**
	 * Parses an URL given as a string into a Lua table with its components.
	 *
	 * @param url The URL to be parsed.
	 * @param def If the table is present, it is used to store the parsed
	 * fields. Only fields present in the URL are overwritten. Therefore, this
	 * table can be used to pass default values for each field.
	 * @returns a table with all the URL components.
	 */
	export function parse(url: string, def?: Partial<ParsedURL>): ParsedURL;

	/**
	 * Breaks a `path` URL component into all its `segment` parts. Since some
	 * characters are reserved in URLs, they must be escaped whenever present in
	 * a `path` component. Therefore, before returning a list with all the
	 * parsed segments, the function removes escaping from all of them.
	 *
	 * @param path A string with the path to be parsed.
	 */
	export function parse_path(path: string): string[];
}
