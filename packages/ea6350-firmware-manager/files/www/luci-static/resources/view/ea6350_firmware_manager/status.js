'use strict';

'require view';
'require fs';
'require ui';

return view.extend({
	load: function() {
		return fs.exec('/usr/sbin/ea6350-firmware-manager-status', [])
			.then(function(res) {
				if (res.code !== 0) {
					throw new Error(res.stderr || res.stdout || 'Command failed');
				}

				return res.stdout;
			});
	},

	render: function(output) {
		return E([
			E('h2', {}, _('EA6350 Firmware Manager')),

			E('div', {
				'class': 'cbi-map'
			}, [
				E('div', {
					'class': 'cbi-map-descr'
				}, _(
					'Read-only firmware slot and status information. ' +
					'This page does not modify flash or U-Boot environment variables.'
				)),

				E('div', {
					'class': 'cbi-section'
				}, [
					E('pre', {
						'style': 'white-space: pre-wrap; word-break: break-word;'
					}, output)
				])
			])
		]);
	},

	handleSave: null,
	handleSaveApply: null,
	handleReset: null
});