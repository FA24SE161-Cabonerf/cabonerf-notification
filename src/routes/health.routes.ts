import { HealthController } from '@notification/controllers/health.controllers';
import { asyncHandler } from '@notification/utils/async-handler';
import express, { Router } from 'express';

class HealthRoute {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	routes(): Router {
		this.router.get('/health', asyncHandler(HealthController.prototype.checkHealth));

		return this.router;
	}
}

const healthRoute = new HealthRoute();
export default healthRoute;
