'use strict';

'require view';
'require ui';
'require fs';

function getStatus() {
	return fs.exec('/usr/sbin/ea6350-usb-status', []);
}

function statusFromResult(res) {
	var text = res.stdout || '{}';

	try {
		return JSON.parse(text);
	} catch (e) {
		return {
			mounted: false,
			error: 'Invalid status response'
		};
	}
}

return view.extend({

	load: function() {
		return getStatus().then(statusFromResult);
	},

	render: function(status) {

		var mounted = status.mounted === 1 ||
			status.mounted === true;

		var rows = [
			[
				_('Mount point'),
				status.mount_point || '/mnt/sda'
			],
			[
				_('Device'),
				status.device || '—'
			],
			[
				_('Filesystem'),
				status.filesystem || '—'
			],
			[
				_('Capacity'),
				status.size || '—'
			],
			[
				_('Used'),
				status.used || '—'
			],
			[
				_('Available'),
				status.available || '—'
			]
		];

		var table = E('table', {
			'class': 'table'
		});

		rows.forEach(function(row) {
			table.appendChild(E('tr', {}, [
				E('td', {
					'style': 'font-weight:bold;width:30%'
				}, row[0]),
				E('td', {}, row[1])
			]));
		});

		var statusBox = E('div', {
			'class': mounted ?
				'alert-message success' :
				'alert-message info'
		}, mounted ?
			_('USB HDD is connected and mounted.') :
			_('USB HDD is not mounted.')
		);

		var content = [
			E('h2', {}, _('USB HDD')),
			E('p', {}, _(
				'Status and safe removal of the external USB hard disk.'
			)),
			statusBox,
			table
		];

		if (mounted) {

			var ejectButton = E('button', {
				'class': 'cbi-button cbi-button-remove',
				'click': ui.createHandlerFn(this, function() {

					ui.showModal(_('Safely remove USB HDD'), [

						E('p', {}, _(
							'Samba4, FTP and MiniDLNA will be stopped before the disk is unmounted.'
						)),

						E('p', {}, E('strong', {}, _(
							'Do not disconnect the USB cable until the operation has completed.'
						))),

						E('div', {
							'class': 'right'
						}, [

							E('button', {
								'class': 'btn',
								'click': ui.hideModal
							}, _('Cancel')),

							E('button', {
								'class': 'btn cbi-button cbi-button-remove',
								'click': function() {

									ui.hideModal();

									return fs.exec(
										'/usr/sbin/ea6350-usb-eject',
										[]
									).then(function(res) {

										var output =
											(res.stdout || '') +
											(res.stderr || '');

										if (res.code === 0) {

											ui.showModal(_('USB HDD'), [

												E('p', {
													'class':
														'alert-message success'
												}, _(
													'The HDD has been safely unmounted.'
												)),

												E('p', {}, E('strong', {}, _(
													'It is now safe to disconnect the USB cable.'
												))),

												E('div', {
													'class': 'right'
												}, [
													E('button', {
														'class': 'btn',
														'click': function() {
															ui.hideModal();
															location.reload();
														}
													}, _('Close'))
												])

											]);

										} else {

											ui.showModal(_('USB HDD'), [

												E('p', {
													'class':
														'alert-message error'
												}, _(
													'The HDD could not be safely unmounted.'
												)),

												E('pre', {
													'style':
														'white-space:pre-wrap'
												}, output),

												E('p', {}, E('strong', {}, _(
													'DO NOT disconnect the USB cable.'
												))),

												E('div', {
													'class': 'right'
												}, [
													E('button', {
														'class': 'btn',
														'click': ui.hideModal
													}, _('Close'))
												])

											]);
										}
									});
								}
							}, _('Safely remove HDD'))

						])
					]);
				})
			}, _('Safely remove HDD'));

			content.push(
				E('div', {
					'class': 'cbi-section'
				}, [
					ejectButton
				])
			);
		}

		return E('div', {
			'class': 'cbi-map'
		}, content);
	}
});