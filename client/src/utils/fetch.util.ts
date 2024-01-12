export const fetchApi = <RequestBodyType>(
	endpoint: string,
	method: string,
	body?: RequestBodyType,
	props: any = {}
) => {
	const baseURL = import.meta.env.VITE_API_URL + endpoint;

	const hasBody = method === "POST" ? { body: JSON.stringify(body) } : {};
	return fetch(baseURL, {
		headers: {
			"content-type": "application/json;charset=UTF-8",
		},
		method,
		...hasBody,
		credentials: "include",
		mode: "cors",
		...props,
	});
};
