import { command } from '$app/server';
import { string } from 'valibot';

export const callRemoteFunc = command(string(), (text) => {
	return `${text} from server: ${new Date().toLocaleString()}`;
});
