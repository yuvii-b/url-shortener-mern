const GUEST_LINKS_STORAGE_KEY = 'guestShortCodes';

function parseCodes(rawValue) {
	if (!rawValue) {
		return [];
	}

	try {
		const parsed = JSON.parse(rawValue);
		return Array.isArray(parsed) ? parsed.filter((code) => typeof code === 'string') : [];
	} catch {
		return [];
	}
}

export function loadGuestShortCodes() {
	return parseCodes(localStorage.getItem(GUEST_LINKS_STORAGE_KEY));
}

export function saveGuestShortCodes(codes) {
	const normalizedCodes = [...new Set(codes.filter((code) => typeof code === 'string'))];
	localStorage.setItem(GUEST_LINKS_STORAGE_KEY, JSON.stringify(normalizedCodes));
	return normalizedCodes;
}

export function addGuestShortCode(code) {
	if (!code || typeof code !== 'string') {
		return loadGuestShortCodes();
	}

	const currentCodes = loadGuestShortCodes();
	return saveGuestShortCodes([...currentCodes, code]);
}

export function removeGuestShortCodes(codesToRemove) {
	const removeSet = new Set(codesToRemove);
	const remainingCodes = loadGuestShortCodes().filter((code) => !removeSet.has(code));
	return saveGuestShortCodes(remainingCodes);
}
