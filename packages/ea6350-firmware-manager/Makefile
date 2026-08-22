include $(TOPDIR)/rules.mk

PKG_NAME:=ea6350-firmware-manager
PKG_VERSION:=1.0.12
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
  Read-only firmware slot and status manager for Linksys EA6350v3.
  This version only reads firmware slot information and does not
  modify flash or U-Boot environment variables.
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