const getEmojiName = (emoji: string) => {
	const customEmojiRegex = /<:(.*):(\d+)>/;

	// Regular expression to match default emojis
	const defaultEmojiRegex = /:(.*):/;

	const customMatch = emoji.match(customEmojiRegex);

	if (customMatch) {
		return customMatch[1];
	}

	// Try to match default emoji pattern
	const defaultMatch = emoji.match(defaultEmojiRegex);
	if (defaultMatch) {
		return defaultMatch[1];
	}

	// Return null if no match found
	return null;
};

export { getEmojiName };