import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class HealthController {
	public checkHealth(_req: Request, res: Response, _next: NextFunction) {
		return res.status(StatusCodes.OK).json({
			message: 'OK'
		});
	}
}
