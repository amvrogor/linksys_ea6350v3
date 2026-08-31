include $(TOPDIR)/rules.mk

PKG_NAME:=ea6350-firmware-manager
PKG_VERSION:=1.0.16
PKG_RELEASE:=1

PKG_MAINTAINER:=EA6350 Home Edition
PKGARCH:=all

include $(INCLUDE_DIR)/package.mk

define Package/ea6350-firmware-manager
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:=Linksys EA6350v3 firmware slot manager
  DEPENDS:=+uboot-envtools +luci-base
endef

define Package/ea6350-firmware-manager/description
  Firmware slot status and upgrade helper for Linksys EA6350v3.
  Provides read-only slot identification and firmware installation
  to the inactive slot using the native OpenWrt sysupgrade mechanism.
endef

define Build/Prepare
endef

define Build/Configure
endef

define Build/Compile
	:
endef

define Package/ea6350-firmware-manager/install
	$(INSTALL_DIR) $(1)/usr/sbin

	$(INSTALL_BIN) \
		./files/usr/sbin/ea6350-firmware-manager-status \
		$(1)/usr/sbin/

	$(INSTALL_BIN) \
		./files/usr/sbin/ea6350-firmware-manager-upgrade \
		$(1)/usr/sbin/

	$(INSTALL_DIR) $(1)/usr/share/luci/menu.d

	$(INSTALL_DATA) \
		./files/usr/share/luci/menu.d/luci-app-ea6350-firmware-manager.json \
		$(1)/usr/share/luci/menu.d/

	$(INSTALL_DIR) $(1)/usr/share/rpcd/acl.d

	$(INSTALL_DATA) \
		./files/usr/share/rpcd/acl.d/luci-app-ea6350-firmware-manager.json \
		$(1)/usr/share/rpcd/acl.d/

	$(INSTALL_DIR) \
		$(1)/www/luci-static/resources/view/ea6350_firmware_manager

	$(INSTALL_DATA) \
		./files/www/luci-static/resources/view/ea6350_firmware_manager/status.js \
		$(1)/www/luci-static/resources/view/ea6350_firmware_manager/
endef

$(eval $(call BuildPackage,ea6350-firmware-manager))