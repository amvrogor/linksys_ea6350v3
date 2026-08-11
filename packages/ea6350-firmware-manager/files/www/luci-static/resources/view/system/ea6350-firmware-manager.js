import view from 'view';
import ui from 'ui';
import rpc from 'rpc';

const callStatus = rpc.declare({ object: 'luci.ea6350_firmware_manager', method: 'status' });
const callSwitch = rpc.declare({ object: 'luci.ea6350_firmware_manager', method: 'switch', params: { slot: 0 } });
const callFlash = rpc.declare({ object: 'luci.ea6350_firmware_manager', method: 'flash', params: { image: '', slot: 0, allow_oem: 0 } });

function cell(text) { return E('td', {}, text); }
function notify(msg, type) { ui.addNotification(null, E('p', {}, msg), type || 'info'); }

return view.extend({
	load: function() { return callStatus(); },

	render: function(s) {
		if (!s || s.error)
			return E('div', { 'class': 'alert-message warning' }, 'Не удалось получить состояние EA6350v3.');

		let table = E('table', { 'class': 'table' }, [
			E('tr', {}, [ E('th', {}, 'Слот'), E('th', {}, 'Содержимое'), E('th', {}, 'Действие') ])
		]);

		for (let slot of [1, 2]) {
			let state = slot === 1 ? s.slot1 : s.slot2;
			let active = (+s.current_slot === slot);
			let action = active ? 'Активный слот' : E('button', {
				'class': 'btn cbi-button cbi-button-apply',
				'click': ui.createHandlerFn(this, function() {
					return ui.confirm('Переключить загрузку на слот ' + slot + ' и перезагрузить роутер?')
					.then(function(ok) {
						if (!ok) return;
						notify('Переключаем загрузку на слот ' + slot + '. Роутер сейчас перезагрузится.', 'info');
						return callSwitch(slot).catch(function() { /* reboot may close RPC connection */ });
					});
				})
			}, 'Переключить и перезагрузить');
			table.appendChild(E('tr', {}, [ cell(String(slot)), cell(state + (active ? ' — активный' : '')), cell(action) ]));
		}

		let image = E('input', { 'type': 'text', 'class': 'cbi-input-text', 'id': 'ea6350-image',
			'placeholder': '/tmp/openwrt-...-linksys_ea6350v3-squashfs-factory.bin' });
		let target = E('select', { 'class': 'cbi-input-select', 'id': 'ea6350-target' }, [
			E('option', { 'value': '1' }, 'Слот 1'), E('option', { 'value': '2' }, 'Слот 2')
		]);
		target.value = (+s.current_slot === 1) ? '2' : '1';
		let allow = E('input', { 'type': 'checkbox', 'id': 'ea6350-allow-oem' });

		let flash = E('button', {
			'class': 'btn cbi-button cbi-button-reset',
			'click': ui.createHandlerFn(this, function() {
				let path = image.value.trim(), slot = +target.value;
				let state = slot === 1 ? s.slot1 : s.slot2;
				if (!path) return notify('Укажите путь к factory.bin на роутере.', 'error');
				if (slot === +s.current_slot) return notify('Нельзя прошивать активный слот.', 'error');
				if (state === 'OEM' && !allow.checked) return notify('Целевой слот содержит OEM. Сначала явно разрешите его перезапись.', 'error');
				let message = state === 'OEM' ? 'ВНИМАНИЕ: OEM Linksys в этом слоте будет удалён. Продолжить?' : 'Записать factory.bin в неактивный слот?';
				return ui.confirm(message).then(function(ok) {
					if (!ok) return;
					ui.showModal('Запись прошивки', [
						E('p', {}, 'Идёт запись. Не отключайте питание.'),
						E('p', {}, 'После записи активный слот автоматически не изменится.')
					]);
					return callFlash(path, slot, allow.checked ? 1 : 0).then(function(res) {
						ui.hideModal();
						if (res && res.error) notify(res.error, 'error');
						else notify('Прошивка записана и проверена в неактивном слоте.', 'success');
						return callStatus();
					});
				});
			})
		}, 'Записать factory.bin');

		return E('div', { 'class': 'cbi-map' }, [
			E('h2', {}, 'EA6350 Firmware Manager'),
			E('div', { 'class': 'alert-message info' }, [
				E('b', {}, 'Текущий слот: '), String(s.current_slot), E('br'),
				E('b', {}, 'kernsize: '), String(s.kernsize), E('br'),
				'Активный слот никогда не записывается этим инструментом.'
			]),
			E('h3', {}, 'Состояние слотов'), table,
			E('h3', {}, 'Запись OpenWrt'),
			E('div', { 'class': 'cbi-section' }, [
				E('p', {}, 'Используется EA6350v3 squashfs-factory.bin. Образ проверяется как FIT + UBI перед записью. sysupgrade.bin намеренно отклоняется.'),
				E('div', { 'class': 'cbi-value' }, [ E('label', { 'class': 'cbi-value-title' }, 'Файл'), E('div', { 'class': 'cbi-value-field' }, [image]) ]),
				E('div', { 'class': 'cbi-value' }, [ E('label', { 'class': 'cbi-value-title' }, 'Целевой слот'), E('div', { 'class': 'cbi-value-field' }, [target]) ]),
				E('div', { 'class': 'cbi-value' }, [ E('label', { 'class': 'cbi-value-title' }, 'Перезапись OEM'), E('div', { 'class': 'cbi-value-field' }, [allow, ' Я сознательно разрешаю удалить OEM Linksys.']) ]),
				E('div', { 'class': 'alert-message warning' }, 'OEM защищён по умолчанию. Без этой галочки слот с OEM не будет тронут.'),
				flash
			]),
			E('h3', {}, 'Обновление OpenWrt с сохранением OEM'),
			E('div', { 'class': 'alert-message info' }, [
				'Для сохранения OEM используйте противоположный слот: загрузитесь в OEM через Advanced Reboot и выполните штатное обновление Linksys. ',
				'Этот менеджер предназначен для записи factory.bin именно в выбранный неактивный слот. Обычный sysupgrade из OpenWrt здесь намеренно не используется.'
			])
		]);
	}
});
