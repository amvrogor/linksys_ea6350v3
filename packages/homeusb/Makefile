include $(TOPDIR)/rules.mk

PKG_NAME:=homeusb
PKG_VERSION:=1.0
PKG_RELEASE:=1

include $(INCLUDE_DIR)/package.mk

define Package/homeusb
  SECTION:=utils
  CATEGORY:=Utilities
  TITLE:=Home USB Manager
  DEPENDS:=+luci-base
endef

define Package/homeusb/description
 Home USB Manager for Linksys EA6350v3
endef

define Build/Compile
endef

define Package/homeusb/install
	$(INSTALL_DIR) $(1)/etc/init.d
	$(INSTALL_BIN) ./files/homeusb $(1)/etc/init.d/homeusb

	$(INSTALL_DIR) $(1)/etc/config
	$(INSTALL_CONF) ./files/homeusb.config $(1)/etc/config/homeusb
endef

$(eval $(call BuildPackage,homeusb))