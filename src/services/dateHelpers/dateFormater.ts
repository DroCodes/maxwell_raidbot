import moment from 'moment-timezone';

const convertToUnixTime = (date: Date) => {
	// Create a Moment object from the input Date
	const momentDate = moment(date);

	// Get the Unix timestamp in seconds using Moment's .unix() function
	// Return the Unix timestamp
	return momentDate.unix();
};


const convertStringToUnixTime = (dateString: string) => {
	// Extract components from the input string
	const [mm_dd, hh_mm] = dateString.split(' ');
	const [month, day] = mm_dd.split('-');
	const [hour, minute] = hh_mm.split(':');

	// Create a new Date object with the extracted components (assumes current year)
	const localDate = new Date(new Date().getFullYear(), Number(month) - 1, Number(day), Number(hour), Number(minute));

	// Get the Unix timestamp (in milliseconds) from the local Date object
	const unixTime = localDate.getTime();

	// Convert milliseconds to seconds
	return Math.floor(unixTime / 1000);
};

function parseDate(dateString: string): Date {
	const [mm_dd, hh_mm] = dateString.split(' ');
	const [month, day] = mm_dd.split('-');
	const [hour, minute] = hh_mm.split(':');
	const year = new Date().getFullYear();

	// Parse the date using Moment.js, considering it's in Eastern Time
	const easternDate = moment.tz(`${year}-${month}-${day}T${hour}:${minute}:00`, 'America/New_York');

	// Convert the Eastern Time date to UTC
	const utcDate = easternDate.utc();

	// Convert the Moment.js object to a JavaScript Date object
	return utcDate.toDate();
}

export { convertToUnixTime, convertStringToUnixTime, parseDate };
