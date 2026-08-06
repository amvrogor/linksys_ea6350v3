include $(TOPDIR)/rules.mk

PKG_NAME:=ea6350-defaults
PKG_RELEASE:=1

include $(INCLUDE_DIR)/package.mk

define Package/ea6350-defaults
  SECTION:=base
  CATEGORY:=Base system
  TITLE:=EA6350 Home Edition default configuration
endef

define Package/ea6350-defaults/description
 Default configuration for Linksys EA6350 Home Edition.
endef

define Build/Compile
endef

define Package/ea6350-defaults/install
	$(INSTALL_DIR) $(1)/etc/uci-defaults
	$(INSTALL_BIN) ./files/99-home-edition \
		$(1)/etc/uci-defaults/99-home-edition
endef

$(eval $(call BuildPackage,ea6350-defaults))
