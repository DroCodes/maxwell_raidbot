import moment from 'moment-timezone';

const convertToUnixTime = (date: Date) => {
	// const dateString = date.toISOString();
	// const easternTz = moment(dateString);
	// const unixTime = easternTz.unix() * 1000;
	const unixTime = date.getTime();
	// console.log(easternTz);

	// Convert milliseconds to seconds
	return Math.floor(unixTime / 1000);
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

	return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
}

export { convertToUnixTime, convertStringToUnixTime, parseDate };
