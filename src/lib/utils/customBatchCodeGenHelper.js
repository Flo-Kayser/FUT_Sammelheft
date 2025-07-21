// src/lib/utils/customBatchCodeGenHelper.js
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const base = chars.length;

function generateRandomCode(length = 7) {
	let code = '';
	for (let i = 0; i < length; i++) {
		code += chars[Math.floor(Math.random() * base)];
	}
	return code;
}

function toBase62(num) {
	let str = '';
	do {
		str = chars[num % base] + str;
		num = Math.floor(num / base);
	} while (num > 0);
	return str;
}

function fromBase62(str) {
	let num = 0;
	for (let i = 0; i < str.length; i++) {
		num = num * base + chars.indexOf(str[i]);
	}
	return num;
}

export async function encodeBatchToClipboardWithId(batch, onCopied) {
	const randomCode = generateRandomCode();
	const fixedCode = '160319';
	const slug = batch.slug.toLowerCase().replace(/\s+/g, '-');

	const encodeList = (ids) => (ids || []).map(toBase62).join('#');

	const encodedIds = encodeList(batch.allIds);
	const encodedAdditions = encodeList(batch.additionalIds);
	const encodedExcludes = encodeList(batch.excludedIds);
	const templateId = batch.templateId ?? 0;

	const filterBase64 = batch.filter
		? btoa(unescape(encodeURIComponent(JSON.stringify(batch.filter))))
		: '';

	const finalCode = `${randomCode}/${fixedCode}~${slug}?${encodedIds}_${encodedAdditions}_${encodedExcludes}_${filterBase64}_${templateId}`;

	try {
		await navigator.clipboard.writeText(finalCode);
		console.log('Code kopiert:', finalCode);
		onCopied?.(batch.id);
	} catch (err) {
		console.error('Kopieren fehlgeschlagen:', err);
	}
}

export function decodeBatchCode(codeString) {
	try {
		const [metaPart, dataString] = codeString.split('?');
		const [_, metaRest] = metaPart.split('/');
		const [fixedCode, slug] = metaRest.split('~');

		if (fixedCode !== '160319') return null;

		const [encodedIds, additions, excludes, filterBase64, templateId] = dataString.split('_');

		const decodeList = (str) =>
			(str || '')
				.split('#')
				.map(fromBase62)
				.filter((n) => !isNaN(n));

		const allIds = decodeList(encodedIds);
		const additionalIds = decodeList(additions);
		const excludedIds = decodeList(excludes);

		let filter = {};
		if (filterBase64) {
			try {
				filter = JSON.parse(decodeURIComponent(escape(atob(filterBase64))));
			} catch (e) {
				console.warn('Fehler beim Parsen der Filterdaten:', e);
			}
		}

		return {
			name: slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
			allIds,
			additionalIds,
			excludedIds,
			filter,
			templateId: parseInt(templateId, 10) || 0
		};
	} catch (err) {
		console.error('Fehler beim Decodieren:', err);
		return null;
	}
}
