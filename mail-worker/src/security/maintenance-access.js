// 直连地址供部署流程升级数据库，升级入口仍由 init.js 校验 JWT 密钥。
export function isBlockedMaintenanceRequest(req, env) {
	if (env.maintenance_only_workers_dev !== true) return false;
	const url = new URL(req.url);
	if (!url.hostname.endsWith('.workers.dev')) return false;
	return req.method !== 'GET' || !/^\/api\/init\/[^/]+$/.test(url.pathname);
}
