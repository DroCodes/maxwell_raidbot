const convertToUnixTime = (dateString: string) => {
	// Extract components from the input string
	const [mm_dd, hh_mm] = dateString.split(' ');
	const [month, day] = mm_dd.split('-');
	const [hour, minute] = hh_mm.split(':');

	// Create a new Date object with the extracted components (assumes current year)
	const localDate = new Date(new Date().getFullYear(), Number(month) - 1, Number(day), Number(hour), Number(minute));

	// Get the Unix timestamp (in milliseconds) from the local Date object
	const unixTime = localDate.getTime();

	// Convert milliseconds to seconds
	const unixTimeInSeconds = Math.floor(unixTime / 1000);

	return unixTimeInSeconds;
};

function convertToUTC(dateString: string) {
	// Extract components from the input string
	const [mm_dd, hh_mm] = dateString.split(' ');
	const [month, day] = mm_dd.split('-');
	const [hour, minute] = hh_mm.split(':');

	// Create a new Date object with the extracted components (assumes current year)
	const localDate = new Date(new Date().getFullYear(), Number(month) - 1, Number(day), Number(hour), Number(minute));

	// Obtain the UTC values from the local Date object
	const utcYear = localDate.getUTCFullYear();
	const utcMonth = localDate.getUTCMonth() + 1;
	const utcDay = localDate.getUTCDate();
	const utcHour = localDate.getUTCHours();
	const utcMinute = localDate.getUTCMinutes();

	// Construct a new Date object with the UTC values
	const utcDate = new Date(utcYear, utcMonth - 1, utcDay, utcHour, utcMinute);

	// Format the UTC date as desired (e.g., ISO 8601 format)
	const formattedDate = utcDate;

	return formattedDate;
}

export { convertToUnixTime, convertToUTC };
