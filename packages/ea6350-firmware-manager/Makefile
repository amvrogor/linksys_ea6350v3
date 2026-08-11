include $(TOPDIR)/rules.mk

PKG_NAME:=ea6350-firmware-manager
PKG_VERSION:=1.0.2
PKG_RELEASE:=1

include $(INCLUDE_DIR)/package.mk

define Package/ea6350-firmware-manager
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:=Linksys EA6350v3 dual-firmware manager
  DEPENDS:=+uboot-envtools +mtd +luci-base
endef

define Package/ea6350-firmware-manager/description
Safe dual-firmware manager for Linksys EA6350v3. Shows both slots,
detects OEM/OpenWrt, switches boot slot, and safely flashes an image
to the inactive slot with an explicit OEM overwrite guard.
endef

define Package/ea6350-firmware-manager/conffiles
/etc/config/ea6350-firmware-manager
endef

define Package/ea6350-firmware-manager/install
	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) ./files/etc/config/ea6350-firmware-manager $(1)/etc/config/

	$(INSTALL_DIR) $(1)/usr/sbin
	$(INSTALL_BIN) ./files/usr/sbin/ea6350-firmware-manager $(1)/usr/sbin/

	$(INSTALL_DIR) $(1)/usr/libexec/rpcd
	$(INSTALL_BIN) ./files/usr/libexec/rpcd/luci.ea6350_firmware_manager $(1)/usr/libexec/rpcd/

	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d
	$(INSTALL_DATA) ./files/usr/share/rpcd/acl.d/ea6350-firmware-manager.json $(1)/usr/share/rpcd/acl.d/

	$(INSTALL_DIR) $(1)/www/luci-static/resources/view/system
	$(INSTALL_DATA) ./files/www/luci-static/resources/view/system/ea6350-firmware-manager.js $(1)/www/luci-static/resources/view/system/

	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d
	$(INSTALL_DATA) ./files/usr/share/luci/menu.d/ea6350-firmware-manager.json $(1)/usr/share/luci/menu.d/
endef

$(eval $(call BuildPackage,ea6350-firmware-manager))
