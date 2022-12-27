// maunium-stickerpicker - A fast and simple Matrix sticker picker widget.
// Copyright (C) 2020 Tulir Asokan
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { html, render, Component } from '../lib/htm/preact.js';
import { Spinner } from './spinner.js';
import * as widgetAPI from './widget-api.js';
import * as frequent from './frequently-used.js';
import { user } from './params.js';

// The base URL for fetching packs. The app will first fetch ${PACK_BASE_URL}/index.json,
// then ${PACK_BASE_URL}/${packFile} for each packFile in the packs object of the index.json file.
// This is updated from packs/index.json
let HOMESERVER_URL = 'https://matrix-client.matrix.org';

const makeThumbnailURL = (mxc) =>
	`${HOMESERVER_URL}/_matrix/media/r0/thumbnail/${mxc.substr(6)}?height=64&width=64&method=crop`;

// We need to detect iOS webkit because it has a bug related to scrolling non-fixed divs
// This is also used to fix scrolling to sections on Element iOS
const isMobileSafari =
	navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);

export const parseQuery = (str) =>
	Object.fromEntries(
		str
			.split('&')
			.map((part) => part.split('='))
			.map(([key, value = '']) => [key, value])
	);

const supportedThemes = ['light', 'dark', 'black'];

class App extends Component {
	constructor(props) {
		super(props);
		this.defaultTheme = parseQuery(location.search.substr(1)).theme;
		this.state = {
			packs: [],
			loading: true,
			error: null,
			stickersPerRow: parseInt(localStorage.mauStickersPerRow || '4'),
			thumbnailSize: parseInt(localStorage.mauThumbnailSize || '327'),
			theme: localStorage.mauStickerThemeOverride || this.defaultTheme,
			frequentlyUsed: {
				id: 'frequently-used',
				title: 'Frequently used',
				stickerIDs: frequent.get(),
				stickers: []
			}
		};
		if (!supportedThemes.includes(this.state.theme)) {
			this.state.theme = 'light';
		}
		if (!supportedThemes.includes(this.defaultTheme)) {
			this.defaultTheme = 'light';
		}
		this.stickersByID = new Map(JSON.parse(localStorage.mauFrequentlyUsedStickerCache || '[]'));
		this.state.frequentlyUsed.stickers = this._getStickersByID(
			this.state.frequentlyUsed.stickerIDs
		);
		this.imageObserver = null;
		this.packListRef = null;
		this.navRef = null;
		this.sendSticker = this.sendSticker.bind(this);
		this.navScroll = this.navScroll.bind(this);
		this.reloadPacks = this.reloadPacks.bind(this);
		this.observeSectionIntersections = this.observeSectionIntersections.bind(this);
		this.observeImageIntersections = this.observeImageIntersections.bind(this);
	}

	_getStickersByID(ids) {
		return ids.map((id) => this.stickersByID.get(id)).filter((sticker) => !!sticker);
	}

	updateFrequentlyUsed() {
		const stickerIDs = frequent.get();
		const stickers = this._getStickersByID(stickerIDs);
		this.setState({
			frequentlyUsed: {
				...this.state.frequentlyUsed,
				stickerIDs,
				stickers
			}
		});
		localStorage.mauFrequentlyUsedStickerCache = JSON.stringify(
			stickers.map((sticker) => [sticker.id, sticker])
		);
	}

	setStickersPerRow(val) {
		localStorage.mauStickersPerRow = val;
		document.documentElement.style.setProperty(
			'--stickers-per-row',
			localStorage.mauStickersPerRow
		);
		this.setState({
			stickersPerRow: val
		});
		this.packListRef.scrollTop = this.packListRef.scrollHeight;
	}

	setThumbSize(val) {
		localStorage.mauThumbnailSize = val;
		this.setState({
			thumbnailSize: val
		});
	}

	setTheme(theme) {
		if (theme === 'default') {
			delete localStorage.mauStickerThemeOverride;
			this.setState({ theme: this.defaultTheme });
		} else {
			localStorage.mauStickerThemeOverride = theme;
			this.setState({ theme: theme });
		}
	}

	reloadPacks() {
		this.imageObserver.disconnect();
		this.sectionObserver.disconnect();
		this.setState({ packs: [] });
		this._loadPacks(true);
	}

	_loadPacks(disableCache = false) {
		const cache = disableCache ? 'no-cache' : undefined;
		//i think thats right..
		fetch(`/api/user/${user}`, { cache }).then(
			async (indexRes) => {
				if (indexRes.status >= 400) {
					this.setState({
						loading: false,
						error: indexRes.status !== 404 ? indexRes.statusText : null
					});
					return;
				}
				const indexData = await indexRes.json();
				HOMESERVER_URL = indexData.homeserver_url || HOMESERVER_URL;
				// TODO only load pack metadata when scrolled into view?
				for (const pack of indexData.packs) {
					const packRes = await fetch(`/api/packs/${pack}/${user}`, { cache });
					const packData = await packRes.json();
					for (const sticker of packData.stickers) {
						this.stickersByID.set(sticker.id, sticker);
					}
					this.setState({
						packs: [...this.state.packs, packData],
						loading: false
					});
				}
				this.updateFrequentlyUsed();
			},
			(error) => this.setState({ loading: false, error })
		);
	}

	componentDidMount() {
		document.documentElement.style.setProperty(
			'--stickers-per-row',
			this.state.stickersPerRow.toString()
		);
		this._loadPacks();
		this.imageObserver = new IntersectionObserver(this.observeImageIntersections, {
			rootMargin: '0px 0px 500px 0px'
		});
		this.sectionObserver = new IntersectionObserver(this.observeSectionIntersections);
	}

	observeImageIntersections(intersections) {
		for (const entry of intersections) {
			const img = entry.target.children.item(0);
			if (entry.isIntersecting) {
				img.setAttribute('src', img.getAttribute('data-src'));
				img.classList.add('visible');
			} else {
				// img.removeAttribute("src")
				img.classList.remove('visible');
			}
		}
	}

	observeSectionIntersections(intersections) {
		const navWidth = this.navRef.getBoundingClientRect().width;
		let minX = 0,
			maxX = navWidth;
		let minXElem = null;
		let maxXElem = null;
		for (const entry of intersections) {
			const packID = entry.target.getAttribute('data-pack-id');
			const navElement = document.getElementById(`nav-${packID}`);
			if (entry.isIntersecting) {
				navElement.classList.add('visible');
				const bb = navElement.getBoundingClientRect();
				if (bb.x < minX) {
					minX = bb.x;
					minXElem = navElement;
				} else if (bb.right > maxX) {
					maxX = bb.right;
					maxXElem = navElement;
				}
			} else {
				navElement.classList.remove('visible');
			}
		}
		if (minXElem !== null) {
			minXElem.scrollIntoView({ inline: 'start' });
		} else if (maxXElem !== null) {
			maxXElem.scrollIntoView({ inline: 'end' });
		}
	}

	componentDidUpdate() {
		if (this.packListRef === null) {
			return;
		}
		for (const elem of this.packListRef.getElementsByClassName('sticker')) {
			this.imageObserver.observe(elem);
		}
		for (const elem of this.packListRef.children) {
			this.sectionObserver.observe(elem);
		}
	}

	componentWillUnmount() {
		this.imageObserver.disconnect();
		this.sectionObserver.disconnect();
	}

	sendSticker(evt) {
		const id = evt.currentTarget.getAttribute('data-sticker-id');
		let sticker = this.stickersByID.get(id);
		frequent.add(id);
		this.updateFrequentlyUsed();
		//hacky as hell but..apply scale..

		let scalef = Math.max(sticker.info.w, sticker.info.h) / this.state.thumbnailSize;
		sticker.info.w = Math.round(sticker.info.w / scalef);
		sticker.info.h = Math.round(sticker.info.h / scalef);

		console.log(sticker.info.h, sticker.info.w);
		widgetAPI.sendSticker(sticker);
	}

	navScroll(evt) {
		this.navRef.scrollLeft += evt.deltaY;
	}

	render() {
		const theme = `theme-${this.state.theme}`;
		if (this.state.loading) {
			return html`<main class="spinner ${theme}"><${Spinner} size=${80} green /></main>`;
		} else if (this.state.error) {
			return html`<main class="error ${theme}">
				<h1>Failed to load packs</h1>
				<p>${this.state.error}</p>
			</main>`;
		} else if (this.state.packs.length === 0) {
			return html`<main class="empty ${theme}"><h1>No packs found 😿</h1></main>`;
		}
		return html`<main class="has-content ${theme}">
			<nav onWheel=${this.navScroll} ref=${(elem) => (this.navRef = elem)}>
				<${NavBarItem} pack=${this.state.frequentlyUsed} iconOverride="recent" />
				${this.state.packs.map((pack) => html`<${NavBarItem} id=${pack.id} pack=${pack} />`)}
				<${NavBarItem} pack=${{ id: 'settings', title: 'Settings' }} iconOverride="settings" />
			</nav>
			<div
				class="pack-list ${isMobileSafari ? 'ios-safari-hack' : ''}"
				ref=${(elem) => (this.packListRef = elem)}
			>
				<${Pack} pack=${this.state.frequentlyUsed} send=${this.sendSticker} />
				${this.state.packs.map(
					(pack) => html`<${Pack} id=${pack.id} pack=${pack} send=${this.sendSticker} />`
				)}
				<${Settings} app=${this} />
			</div>
		</main>`;
	}
}

const Settings = ({ app }) => html`
	<section class="stickerpack settings" id="pack-settings" data-pack-id="settings">
		<h1>Settings</h1>
		<div class="settings-list">
			<button onClick=${app.reloadPacks}>Reload</button>
			<div>
				<label for="stickers-per-row">Stickers per row: ${app.state.stickersPerRow}</label>
				<input
					type="range"
					min="2"
					max="10"
					id="stickers-per-row"
					id="stickers-per-row"
					value=${app.state.stickersPerRow}
					onInput=${(evt) => app.setStickersPerRow(evt.target.value)}
				/>
			</div>

			<div>
				<label for="thumbsize">Thumbnail size: </label>
				<input
					type="number"
					id="thumbsize"
					name="thumbsize"
					value=${app.state.thumbnailSize}
					onChange=${(evt) => app.setThumbSize(evt.target.value)}
				/>
			</div>

			<div>
				<label for="theme">Theme: </label>
				<select name="theme" id="theme" onChange=${(evt) => app.setTheme(evt.target.value)}>
					<option value="default">Default</option>
					<option value="light">Light</option>
					<option value="dark">Dark</option>
					<option value="black">Black</option>
				</select>
			</div>
		</div>
	</section>
`;

// By default we just let the browser handle scrolling to sections, but webviews on Element iOS
// open the link in the browser instead of just scrolling there, so we need to scroll manually:
const scrollToSection = (evt, id) => {
	const pack = document.getElementById(`pack-${id}`);
	pack.scrollIntoView({ block: 'start', behavior: 'instant' });
	evt.preventDefault();
};

const NavBarItem = ({ pack, iconOverride = null }) => html`
	<a
		href="#pack-${pack.id}"
		id="nav-${pack.id}"
		data-pack-id=${pack.id}
		title=${pack.title}
		onClick=${isMobileSafari ? (evt) => scrollToSection(evt, pack.id) : undefined}
	>
		<div class="sticker">
			${iconOverride
				? html` <span class="icon icon-${iconOverride}" /> `
				: html`
						<img
							src=${makeThumbnailURL(pack.stickers[0].url)}
							alt=${pack.stickers[0].body}
							class="visible"
						/>
				  `}
		</div>
	</a>
`;

const Pack = ({ pack, send }) => html`
	<section class="stickerpack" id="pack-${pack.id}" data-pack-id=${pack.id}>
		<h1>${pack.title}</h1>
		<div class="sticker-list">
			${pack.stickers.map(
				(sticker) => html` <${Sticker} key=${sticker.id} content=${sticker} send=${send} /> `
			)}
		</div>
	</section>
`;

const makeURL = (mxc) => `${HOMESERVER_URL}/_matrix/media/r0/download/${mxc.substr(6)}`;

const makeImage = (content) => {
	let x = content.info.mimetype.split('/')[1];
	if (x === 'gif') {
		return makeURL(content.url);
	} else {
		return makeThumbnailURL(content.url);
	}
};

const Sticker = ({ content, send }) => html`
	<div class="sticker" onClick=${send} data-sticker-id=${content.id}>
		<img data-src=${makeImage(content)} alt=${content.body} title=${content.body} />
	</div>
`;

render(html`<${App} />`, document.body);
