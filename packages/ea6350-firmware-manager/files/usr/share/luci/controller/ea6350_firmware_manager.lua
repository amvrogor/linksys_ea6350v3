local fs = require "nixio.fs"

function index()
    if not fs.access("/usr/sbin/ea6350-firmware-manager-status") then
        return
    end

    entry(
        {"admin", "system", "ea6350-firmware-manager", "status"},
        template("ea6350_firmware_manager/status"),
        _("Status"),
        10
    ).leaf = true
end