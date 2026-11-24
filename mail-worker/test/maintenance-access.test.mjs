import test from 'node:test';
import assert from 'node:assert/strict';
import { isBlockedMaintenanceRequest } from '../src/security/maintenance-access.js';

const env = { maintenance_only_workers_dev: true };
const blocked = (url, method = 'GET', settings = env) =>
	isBlockedMaintenanceRequest(new Request(url, { method }), settings);

test('直连维护地址只允许 GET 数据库升级路径', () => {
	assert.equal(blocked('https://cloud-mail.example.workers.dev/api/init/test-key'), false);
	for (const path of ['/api/login', '/api/register', '/api/email/latest', '/api/init', '/api/init/key/extra', '/realtime', '/proxy']) {
		assert.equal(blocked('https://cloud-mail.example.workers.dev' + path), true, path);
	}
	assert.equal(blocked('https://cloud-mail.example.workers.dev/api/init/test-key', 'POST'), true);
});

test('自定义域名和未开启限制的开发环境保持可访问', () => {
	assert.equal(blocked('https://mail.gkotta.bid/api/login'), false);
	assert.equal(blocked('https://cloud-mail.example.workers.dev/api/login', 'GET', {}), false);
	assert.equal(blocked('http://localhost:8787/api/login'), false);
	assert.equal(blocked('https://workers.dev.example.com/api/login'), false);
});
