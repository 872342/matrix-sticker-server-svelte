var n,
	u,
	i,
	t,
	o,
	r,
	f = {},
	e = [],
	c = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
function s(n, l) {
	for (var u in l) n[u] = l[u];
	return n;
}
function a(n) {
	var l = n.parentNode;
	l && l.removeChild(n);
}
function v(n, l, u) {
	var i,
		t,
		o,
		r = arguments,
		f = {};
	for (o in l) 'key' == o ? (i = l[o]) : 'ref' == o ? (t = l[o]) : (f[o] = l[o]);
	if (arguments.length > 3) for (u = [u], o = 3; o < arguments.length; o++) u.push(r[o]);
	if ((null != u && (f.children = u), 'function' == typeof n && null != n.defaultProps))
		for (o in n.defaultProps) void 0 === f[o] && (f[o] = n.defaultProps[o]);
	return h(n, f, i, t, null);
}
function h(l, u, i, t, o) {
	var r = {
		type: l,
		props: u,
		key: i,
		ref: t,
		__k: null,
		__: null,
		__b: 0,
		__e: null,
		__d: void 0,
		__c: null,
		constructor: void 0,
		__v: o
	};
	return null == o && (r.__v = r), null != n.vnode && n.vnode(r), r;
}
function p(n) {
	return n.children;
}
function d(n, l) {
	(this.props = n), (this.context = l);
}
function _(n, l) {
	if (null == l) return n.__ ? _(n.__, n.__.__k.indexOf(n) + 1) : null;
	for (var u; l < n.__k.length; l++) if (null != (u = n.__k[l]) && null != u.__e) return u.__e;
	return 'function' == typeof n.type ? _(n) : null;
}
function w(n) {
	var l, u;
	if (null != (n = n.__) && null != n.__c) {
		for (n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++)
			if (null != (u = n.__k[l]) && null != u.__e) {
				n.__e = n.__c.base = u.__e;
				break;
			}
		return w(n);
	}
}
function k(l) {
	((!l.__d && (l.__d = !0) && u.push(l) && !m.__r++) || t !== n.debounceRendering) &&
		((t = n.debounceRendering) || i)(m);
}
function m() {
	for (var n; (m.__r = u.length); )
		(n = u.sort(function (n, l) {
			return n.__v.__b - l.__v.__b;
		})),
			(u = []),
			n.some(function (n) {
				var l, u, i, t, o, r, f;
				n.__d &&
					((r = (o = (l = n).__v).__e),
					(f = l.__P) &&
						((u = []),
						((i = s({}, o)).__v = i),
						(t = T(f, o, i, l.__n, void 0 !== f.ownerSVGElement, null, u, null == r ? _(o) : r)),
						$(u, o),
						t != r && w(o)));
			});
}
function g(n, l, u, i, t, o, r, c, s, v) {
	var y,
		d,
		w,
		k,
		m,
		g,
		b,
		A = (i && i.__k) || e,
		P = A.length;
	for (s == f && (s = null != r ? r[0] : P ? _(i, 0) : null), u.__k = [], y = 0; y < l.length; y++)
		if (
			null !=
			(k = u.__k[y] =
				null == (k = l[y]) || 'boolean' == typeof k
					? null
					: 'string' == typeof k || 'number' == typeof k
					? h(null, k, null, null, k)
					: Array.isArray(k)
					? h(p, { children: k }, null, null, null)
					: null != k.__e || null != k.__c
					? h(k.type, k.props, k.key, null, k.__v)
					: k)
		) {
			if (
				((k.__ = u),
				(k.__b = u.__b + 1),
				null === (w = A[y]) || (w && k.key == w.key && k.type === w.type))
			)
				A[y] = void 0;
			else
				for (d = 0; d < P; d++) {
					if ((w = A[d]) && k.key == w.key && k.type === w.type) {
						A[d] = void 0;
						break;
					}
					w = null;
				}
			(m = T(n, k, (w = w || f), t, o, r, c, s, v)),
				(d = k.ref) &&
					w.ref != d &&
					(b || (b = []), w.ref && b.push(w.ref, null, k), b.push(d, k.__c || m, k)),
				null != m
					? (null == g && (g = m),
					  (s = x(n, k, w, A, r, m, s)),
					  v || 'option' != u.type ? 'function' == typeof u.type && (u.__d = s) : (n.value = ''))
					: s && w.__e == s && s.parentNode != n && (s = _(w));
		}
	if (((u.__e = g), null != r && 'function' != typeof u.type))
		for (y = r.length; y--; ) null != r[y] && a(r[y]);
	for (y = P; y--; ) null != A[y] && I(A[y], A[y]);
	if (b) for (y = 0; y < b.length; y++) H(b[y], b[++y], b[++y]);
}
function x(n, l, u, i, t, o, r) {
	var f, e, c;
	if (void 0 !== l.__d) (f = l.__d), (l.__d = void 0);
	else if (t == u || o != r || null == o.parentNode)
		n: if (null == r || r.parentNode !== n) n.appendChild(o), (f = null);
		else {
			for (e = r, c = 0; (e = e.nextSibling) && c < i.length; c += 2) if (e == o) break n;
			n.insertBefore(o, r), (f = r);
		}
	return void 0 !== f ? f : o.nextSibling;
}
function A(n, l, u, i, t) {
	var o;
	for (o in u) 'children' === o || 'key' === o || o in l || C(n, o, null, u[o], i);
	for (o in l)
		(t && 'function' != typeof l[o]) ||
			'children' === o ||
			'key' === o ||
			'value' === o ||
			'checked' === o ||
			u[o] === l[o] ||
			C(n, o, l[o], u[o], i);
}
function P(n, l, u) {
	'-' === l[0]
		? n.setProperty(l, u)
		: (n[l] = null == u ? '' : 'number' != typeof u || c.test(l) ? u : u + 'px');
}
function C(n, l, u, i, t) {
	var o, r;
	if ((t && 'className' == l && (l = 'class'), 'style' === l))
		if ('string' == typeof u) n.style = u;
		else {
			if (('string' == typeof i && (n.style = i = ''), i))
				for (l in i) (u && l in u) || P(n.style, l, '');
			if (u) for (l in u) (i && u[l] === i[l]) || P(n.style, l, u[l]);
		}
	else
		'o' === l[0] && 'n' === l[1]
			? ((o = l !== (l = l.replace(/Capture$/, ''))),
			  (r = l.toLowerCase()) in n && (l = r),
			  (l = l.slice(2)),
			  n.l || (n.l = {}),
			  (n.l[l] = u),
			  u ? i || n.addEventListener(l, z, o) : n.removeEventListener(l, z, o))
			: 'list' !== l &&
			  'tagName' !== l &&
			  'form' !== l &&
			  'type' !== l &&
			  'size' !== l &&
			  'download' !== l &&
			  'href' !== l &&
			  !t &&
			  l in n
			? (n[l] = null == u ? '' : u)
			: 'function' != typeof u &&
			  'dangerouslySetInnerHTML' !== l &&
			  (l !== (l = l.replace(/xlink:?/, ''))
					? null == u || !1 === u
						? n.removeAttributeNS('http://www.w3.org/1999/xlink', l.toLowerCase())
						: n.setAttributeNS('http://www.w3.org/1999/xlink', l.toLowerCase(), u)
					: null == u || (!1 === u && !/^ar/.test(l))
					? n.removeAttribute(l)
					: n.setAttribute(l, u));
}
function z(l) {
	this.l[l.type](n.event ? n.event(l) : l);
}
function N(n, l, u) {
	var i, t;
	for (i = 0; i < n.__k.length; i++)
		(t = n.__k[i]) &&
			((t.__ = n),
			t.__e &&
				('function' == typeof t.type && t.__k.length > 1 && N(t, l, u),
				(l = x(u, t, t, n.__k, null, t.__e, l)),
				'function' == typeof n.type && (n.__d = l)));
}
function T(l, u, i, t, o, r, f, e, c) {
	var a,
		v,
		h,
		y,
		_,
		w,
		k,
		m,
		b,
		x,
		A,
		P = u.type;
	if (void 0 !== u.constructor) return null;
	(a = n.__b) && a(u);
	try {
		n: if ('function' == typeof P) {
			if (
				((m = u.props),
				(b = (a = P.contextType) && t[a.__c]),
				(x = a ? (b ? b.props.value : a.__) : t),
				i.__c
					? (k = (v = u.__c = i.__c).__ = v.__E)
					: ('prototype' in P && P.prototype.render
							? (u.__c = v = new P(m, x))
							: ((u.__c = v = new d(m, x)), (v.constructor = P), (v.render = L)),
					  b && b.sub(v),
					  (v.props = m),
					  v.state || (v.state = {}),
					  (v.context = x),
					  (v.__n = t),
					  (h = v.__d = !0),
					  (v.__h = [])),
				null == v.__s && (v.__s = v.state),
				null != P.getDerivedStateFromProps &&
					(v.__s == v.state && (v.__s = s({}, v.__s)),
					s(v.__s, P.getDerivedStateFromProps(m, v.__s))),
				(y = v.props),
				(_ = v.state),
				h)
			)
				null == P.getDerivedStateFromProps &&
					null != v.componentWillMount &&
					v.componentWillMount(),
					null != v.componentDidMount && v.__h.push(v.componentDidMount);
			else {
				if (
					(null == P.getDerivedStateFromProps &&
						m !== y &&
						null != v.componentWillReceiveProps &&
						v.componentWillReceiveProps(m, x),
					(!v.__e &&
						null != v.shouldComponentUpdate &&
						!1 === v.shouldComponentUpdate(m, v.__s, x)) ||
						u.__v === i.__v)
				) {
					(v.props = m),
						(v.state = v.__s),
						u.__v !== i.__v && (v.__d = !1),
						(v.__v = u),
						(u.__e = i.__e),
						(u.__k = i.__k),
						v.__h.length && f.push(v),
						N(u, e, l);
					break n;
				}
				null != v.componentWillUpdate && v.componentWillUpdate(m, v.__s, x),
					null != v.componentDidUpdate &&
						v.__h.push(function () {
							v.componentDidUpdate(y, _, w);
						});
			}
			(v.context = x),
				(v.props = m),
				(v.state = v.__s),
				(a = n.__r) && a(u),
				(v.__d = !1),
				(v.__v = u),
				(v.__P = l),
				(a = v.render(v.props, v.state, v.context)),
				(v.state = v.__s),
				null != v.getChildContext && (t = s(s({}, t), v.getChildContext())),
				h || null == v.getSnapshotBeforeUpdate || (w = v.getSnapshotBeforeUpdate(y, _)),
				(A = null != a && a.type == p && null == a.key ? a.props.children : a),
				g(l, Array.isArray(A) ? A : [A], u, i, t, o, r, f, e, c),
				(v.base = u.__e),
				v.__h.length && f.push(v),
				k && (v.__E = v.__ = null),
				(v.__e = !1);
		} else
			null == r && u.__v === i.__v
				? ((u.__k = i.__k), (u.__e = i.__e))
				: (u.__e = j(i.__e, u, i, t, o, r, f, c));
		(a = n.diffed) && a(u);
	} catch (l) {
		(u.__v = null), n.__e(l, u, i);
	}
	return u.__e;
}
function $(l, u) {
	n.__c && n.__c(u, l),
		l.some(function (u) {
			try {
				(l = u.__h),
					(u.__h = []),
					l.some(function (n) {
						n.call(u);
					});
			} catch (l) {
				n.__e(l, u.__v);
			}
		});
}
function j(n, l, u, i, t, o, r, c) {
	var s,
		a,
		v,
		h,
		y,
		p = u.props,
		d = l.props;
	if (((t = 'svg' === l.type || t), null != o))
		for (s = 0; s < o.length; s++)
			if (
				null != (a = o[s]) &&
				((null === l.type ? 3 === a.nodeType : a.localName === l.type) || n == a)
			) {
				(n = a), (o[s] = null);
				break;
			}
	if (null == n) {
		if (null === l.type) return document.createTextNode(d);
		(n = t
			? document.createElementNS('http://www.w3.org/2000/svg', l.type)
			: document.createElement(l.type, d.is && { is: d.is })),
			(o = null),
			(c = !1);
	}
	if (null === l.type) p !== d && n.data !== d && (n.data = d);
	else {
		if (
			(null != o && (o = e.slice.call(n.childNodes)),
			(v = (p = u.props || f).dangerouslySetInnerHTML),
			(h = d.dangerouslySetInnerHTML),
			!c)
		) {
			if (null != o)
				for (p = {}, y = 0; y < n.attributes.length; y++)
					p[n.attributes[y].name] = n.attributes[y].value;
			(h || v) && ((h && v && h.__html == v.__html) || (n.innerHTML = (h && h.__html) || ''));
		}
		A(n, d, p, t, c),
			h
				? (l.__k = [])
				: ((s = l.props.children),
				  g(n, Array.isArray(s) ? s : [s], l, u, i, 'foreignObject' !== l.type && t, o, r, f, c)),
			c ||
				('value' in d && void 0 !== (s = d.value) && s !== n.value && C(n, 'value', s, p.value, !1),
				'checked' in d &&
					void 0 !== (s = d.checked) &&
					s !== n.checked &&
					C(n, 'checked', s, p.checked, !1));
	}
	return n;
}
function H(l, u, i) {
	try {
		'function' == typeof l ? l(u) : (l.current = u);
	} catch (l) {
		n.__e(l, i);
	}
}
function I(l, u, i) {
	var t, o, r;
	if (
		(n.unmount && n.unmount(l),
		(t = l.ref) && ((t.current && t.current !== l.__e) || H(t, null, u)),
		i || 'function' == typeof l.type || (i = null != (o = l.__e)),
		(l.__e = l.__d = void 0),
		null != (t = l.__c))
	) {
		if (t.componentWillUnmount)
			try {
				t.componentWillUnmount();
			} catch (l) {
				n.__e(l, u);
			}
		t.base = t.__P = null;
	}
	if ((t = l.__k)) for (r = 0; r < t.length; r++) t[r] && I(t[r], u, i);
	null != o && a(o);
}
function L(n, l, u) {
	return this.constructor(n, u);
}
function M(l, u, i) {
	var t, r, c;
	n.__ && n.__(l, u),
		(r = (t = i === o) ? null : (i && i.__k) || u.__k),
		(l = v(p, null, [l])),
		(c = []),
		T(
			u,
			((t ? u : i || u).__k = l),
			r || f,
			f,
			void 0 !== u.ownerSVGElement,
			i && !t ? [i] : r ? null : u.childNodes.length ? e.slice.call(u.childNodes) : null,
			c,
			i || f,
			t
		),
		$(c, l);
}
(n = {
	__e: function (n, l) {
		for (var u, i; (l = l.__); )
			if ((u = l.__c) && !u.__)
				try {
					if (
						(u.constructor &&
							null != u.constructor.getDerivedStateFromError &&
							((i = !0), u.setState(u.constructor.getDerivedStateFromError(n))),
						null != u.componentDidCatch && ((i = !0), u.componentDidCatch(n)),
						i)
					)
						return k((u.__E = u));
				} catch (l) {
					n = l;
				}
		throw n;
	}
}),
	(d.prototype.setState = function (n, l) {
		var u;
		(u = null != this.__s && this.__s !== this.state ? this.__s : (this.__s = s({}, this.state))),
			'function' == typeof n && (n = n(s({}, u), this.props)),
			n && s(u, n),
			null != n && this.__v && (l && this.__h.push(l), k(this));
	}),
	(d.prototype.forceUpdate = function (n) {
		this.__v && ((this.__e = !0), n && this.__h.push(n), k(this));
	}),
	(d.prototype.render = p),
	(u = []),
	(i = 'function' == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout),
	(m.__r = 0),
	(o = f),
	(r = 0);

var n$1 = function (t, s, r, e) {
		var u;
		s[0] = 0;
		for (var h = 1; h < s.length; h++) {
			var p = s[h++],
				a = s[h] ? ((s[0] |= p ? 1 : 2), r[s[h++]]) : s[++h];
			3 === p
				? (e[0] = a)
				: 4 === p
				? (e[1] = Object.assign(e[1] || {}, a))
				: 5 === p
				? ((e[1] = e[1] || {})[s[++h]] = a)
				: 6 === p
				? (e[1][s[++h]] += a + '')
				: p
				? ((u = t.apply(a, n$1(t, a, r, ['', null]))),
				  e.push(u),
				  a[0] ? (s[0] |= 2) : ((s[h - 2] = 0), (s[h] = u)))
				: e.push(a);
		}
		return e;
	},
	t$1 = new Map();
function e$1(s) {
	var r = t$1.get(this);
	return (
		r || ((r = new Map()), t$1.set(this, r)),
		(r = n$1(
			this,
			r.get(s) ||
				(r.set(
					s,
					(r = (function (n) {
						for (
							var t,
								s,
								r = 1,
								e = '',
								u = '',
								h = [0],
								p = function (n) {
									1 === r && (n || (e = e.replace(/^\s*\n\s*|\s*\n\s*$/g, '')))
										? h.push(0, n, e)
										: 3 === r && (n || e)
										? (h.push(3, n, e), (r = 2))
										: 2 === r && '...' === e && n
										? h.push(4, n, 0)
										: 2 === r && e && !n
										? h.push(5, 0, !0, e)
										: r >= 5 &&
										  ((e || (!n && 5 === r)) && (h.push(r, 0, e, s), (r = 6)),
										  n && (h.push(r, n, 0, s), (r = 6))),
										(e = '');
								},
								a = 0;
							a < n.length;
							a++
						) {
							a && (1 === r && p(), p(a));
							for (var l = 0; l < n[a].length; l++)
								(t = n[a][l]),
									1 === r
										? '<' === t
											? (p(), (h = [h]), (r = 3))
											: (e += t)
										: 4 === r
										? '--' === e && '>' === t
											? ((r = 1), (e = ''))
											: (e = t + e[0])
										: u
										? t === u
											? (u = '')
											: (e += t)
										: '"' === t || "'" === t
										? (u = t)
										: '>' === t
										? (p(), (r = 1))
										: r &&
										  ('=' === t
												? ((r = 5), (s = e), (e = ''))
												: '/' === t && (r < 5 || '>' === n[a][l + 1])
												? (p(), 3 === r && (h = h[0]), (r = h), (h = h[0]).push(2, 0, r), (r = 0))
												: ' ' === t || '\t' === t || '\n' === t || '\r' === t
												? (p(), (r = 2))
												: (e += t)),
									3 === r && '!--' === e && ((r = 4), (h = h[0]));
						}
						return p(), h;
					})(s))
				),
				r),
			arguments,
			[]
		)).length > 1
			? r
			: r[0]
	);
}

var m$1 = e$1.bind(v);

export { d as Component, v as h, m$1 as html, M as render };
