import { Request, Response } from "express";
import { TResponseJson } from "../types";

export const ErrorCatchMessage = (
	error: any,
	json: TResponseJson
): void => {
	console.log(error);
	json.status = 500;
	json.message = "Server Error";
	json.error = true;
};


export const SetRequestResponse = (props: TResponseJson): TResponseJson => {
     const responseJson: TResponseJson = {
        message: props.message || "",
        error: props.error || false,
        data: props.data || {},
        status: props?.status || 200,
    };

    return responseJson;
}

