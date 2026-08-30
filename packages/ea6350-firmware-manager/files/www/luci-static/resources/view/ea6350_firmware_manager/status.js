'use strict';

'require view';
'require fs';
'require ui';
'require rpc';

return view.extend({

	load: function() {
		return fs.exec('/usr/sbin/ea6350-firmware-manager-status', [])
			.then(function(res) {
				if (res.code !== 0)
					throw new Error(
						res.stderr ||
						res.stdout ||
						'Status command failed'
					);

				return res.stdout;
			});
	},

	render: function(output) {
		var fileInput = E('input', {
			'type': 'file',
			'class': 'cbi-input-file'
		});

		var keepSettings = E('input', {
			'type': 'checkbox',
			'checked': 'checked'
		});

		var inactiveButton = E('button', {
			'class': 'btn cbi-button cbi-button-positive'
		}, [
			_('Install to inactive slot')
		]);

		var currentButton = E('button', {
			'class': 'btn cbi-button cbi-button-negative'
		}, [
			_('Install to current slot')
		]);

		var result = E('pre', {
			'style': [
				'display:none',
				'white-space:pre-wrap',
				'word-break:break-word',
				'margin-top:15px'
			].join(';')
		});

		function showResult(text) {
			result.style.display = '';
			result.textContent = text;
		}

		function getSelectedFile() {
			if (!fileInput.files || !fileInput.files.length)
				throw new Error(_('Select a firmware file first'));

			return fileInput.files[0];
		}

		function uploadAndUpgrade(mode) {
			var file;

			try {
				file = getSelectedFile();
			}
			catch (e) {
				ui.addNotification(
					null,
					E('p', {}, e.message),
					'danger'
				);

				return;
			}

			var target = mode === 'inactive'
				? _('inactive slot')
				: _('current slot');

			var warning;

			if (mode === 'inactive') {
				warning =
					_('The selected firmware will overwrite the inactive slot. ') +
					_('On EA6350v3 the native OpenWrt upgrade procedure will also ') +
					_('make the newly flashed slot the next boot target.') +
					'\n\n' +
					_('Continue?');
			}
			else {
				warning =
					_('Current-slot flashing is an advanced operation. ') +
					_('The backend currently performs validation only and will not ') +
					_('overwrite the running firmware.') +
					'\n\n' +
					_('Continue with validation?');
			}

			if (!confirm(warning))
				return;

			showResult(_('Uploading firmware image...'));

			ui.uploadFile('/tmp/ea6350-firmware.img', file)
				.then(function() {
					showResult(_('Firmware uploaded. Starting upgrade procedure...'));

					return fs.exec(
						'/usr/sbin/ea6350-firmware-manager-upgrade',
						[
							'/tmp/ea6350-firmware.img',
							mode,
							keepSettings.checked ? '1' : '0'
						]
					);
				})
				.then(function(res) {
					showResult(
						(res.stdout || '') +
						(res.stderr ? '\n' + res.stderr : '')
					);

					if (res.code !== 0) {
						ui.addNotification(
							null,
							E('p', {}, _('Operation failed or was not executed.')),
							'danger'
						);
					}
				})
				.catch(function(err) {
					showResult(String(err));

					ui.addNotification(
						null,
						E('p', {}, String(err)),
						'danger'
					);
				});
		}

		inactiveButton.addEventListener('click', function() {
			uploadAndUpgrade('inactive');
		});

		currentButton.addEventListener('click', function() {
			uploadAndUpgrade('current');
		});

		return E([
			E('h2', {}, _('EA6350 Firmware Manager')),

			E('div', {
				'class': 'cbi-map'
			}, [

				E('div', {
					'class': 'cbi-map-descr'
				}, _(
					'Firmware slot information and firmware installation tools for ' +
					'Linksys EA6350v3.'
				)),

				E('div', {
					'class': 'cbi-section'
				}, [

					E('h3', {}, _('Firmware status')),

					E('pre', {
						'style': 'white-space: pre-wrap; word-break: break-word;'
					}, output)

				])

			]),

			E('div', {
				'class': 'cbi-map'
			}, [

				E('div', {
					'class': 'cbi-section'
				}, [

					E('h3', {}, _('Firmware installation')),

					E('p', {}, _(
						'Select a valid OpenWrt sysupgrade image for Linksys EA6350v3.'
					)),

					E('div', {
						'class': 'cbi-value'
					}, [

						E('label', {
							'class': 'cbi-value-title'
						}, _('Firmware image')),

						E('div', {
							'class': 'cbi-value-field'
						}, [
							fileInput
						])

					]),

					E('div', {
						'class': 'cbi-value'
					}, [

						E('label', {
							'class': 'cbi-value-title'
						}, _('Keep settings')),

						E('div', {
							'class': 'cbi-value-field'
						}, [
							keepSettings,
							' ',
							_('Preserve current configuration')
						])

					]),

					E('div', {
						'class': 'cbi-value'
					}, [

						E('div', {
							'class': 'cbi-value-field'
						}, [
							inactiveButton,
							' ',
							currentButton
						])

					]),

					result

				])

			])

		]);
	},

	handleSave: null,
	handleSaveApply: null,
	handleReset: null
});