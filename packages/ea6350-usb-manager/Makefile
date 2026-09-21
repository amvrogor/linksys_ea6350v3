include $(TOPDIR)/rules.mk

PKG_NAME:=ea6350-usb-manager
PKG_VERSION:=1.0.5
PKG_RELEASE:=1

include $(INCLUDE_DIR)/package.mk

define Package/ea6350-usb-manager
  SECTION:=luci
  CATEGORY:=LuCI
  SUBMENU:=Applications
  TITLE:=Linksys EA6350v3 USB HDD Manager
  DEPENDS:=+luci-base +rpcd +rpcd-mod-file
endef

define Package/ea6350-usb-manager/description
 LuCI application for USB HDD status and safe removal
 on Linksys EA6350v3.
endef

define Build/Compile
endef

define Package/ea6350-usb-manager/install
	$(INSTALL_DIR) $(1)/etc/hotplug.d/block
	$(INSTALL_BIN) ./files/etc/hotplug.d/block/98-ea6350-usb-manager \
		$(1)/etc/hotplug.d/block/98-ea6350-usb-manager

	$(INSTALL_DIR) $(1)/usr/libexec
	$(INSTALL_BIN) ./files/usr/libexec/ea6350-usb-hotplug \
		$(1)/usr/libexec/ea6350-usb-hotplug

	$(INSTALL_DIR) $(1)/usr/sbin
	$(INSTALL_BIN) ./files/usr/sbin/ea6350-usb-eject \
		$(1)/usr/sbin/ea6350-usb-eject
	$(INSTALL_BIN) ./files/usr/sbin/ea6350-usb-status \
		$(1)/usr/sbin/ea6350-usb-status

	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d
	$(INSTALL_DATA) ./files/usr/share/luci/menu.d/luci-app-ea6350-usb-manager.json \
		$(1)/usr/share/luci/menu.d/luci-app-ea6350-usb-manager.json

	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d
	$(INSTALL_DATA) ./files/usr/share/rpcd/acl.d/luci-app-ea6350-usb-manager.json \
		$(1)/usr/share/rpcd/acl.d/luci-app-ea6350-usb-manager.json

	$(INSTALL_DIR) $(1)/www/luci-static/resources/view/ea6350_usb_manager
	$(INSTALL_DATA) ./files/www/luci-static/resources/view/ea6350_usb_manager/status.js \
		$(1)/www/luci-static/resources/view/ea6350_usb_manager/status.js
endef

$(eval $(call BuildPackage,ea6350-usb-manager))