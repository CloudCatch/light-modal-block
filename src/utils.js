import { customAlphabet } from 'nanoid';

export const generateModalId = () => {
	const nanoid = customAlphabet(
		'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
		11
	);

	return nanoid();
};
