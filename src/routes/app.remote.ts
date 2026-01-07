import { query } from '$app/server';
import { string } from 'valibot';

export const callRemoteFunc = query(string(), (text) => {
	return `${text} from server: ${new Date().toLocaleString()}`;
});
