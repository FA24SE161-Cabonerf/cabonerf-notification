import express, { Router } from 'express';

export class AuthenticationRoute {
	private router: Router;

	constructor() {
		this.router = express.Router();
	}

	routes() {
		this.router.get('');

		return this.router;
	}
}
