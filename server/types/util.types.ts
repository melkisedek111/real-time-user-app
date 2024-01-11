export type TResponseJson = {
	message?: string;
	error?: boolean;
	data?: any;
	status?: number;
};

export type TPositionDefinition = {
    [key in number]: string
}

export const POSITION_DEFINITION: TPositionDefinition = {
	10: "Admin",
	1: "Regular",
};

export const POSITION_CODE = [10, 1];
