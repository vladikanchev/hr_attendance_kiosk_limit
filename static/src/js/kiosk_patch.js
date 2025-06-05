odoo.define('your_module.kiosk_patch', function (require) {
    "use strict";

    const KioskMode = require('hr_attendance.kiosk_mode');

    console.log("✅ kiosk_patch.js зареден успешно!");

    KioskMode.include({
        _onBarcodeScanned: async function (barcode) {
            console.log("🟡 Служител сканиран!");

            const now = new Date();
            const hour = now.getHours();
            const minute = now.getMinutes();
            const totalMinutes = hour * 60 + minute;
            const limit = 15 * 60;

            await this._super.apply(this, arguments);

            const lastAction = this.lastAttendance ? this.lastAttendance.action : null;

            if (lastAction === "check_in" && totalMinutes < limit) {
                this._showError("Може да направите Check Out само след 15:00!");
                this._speak("Може да направите Check Out само след петнадесет часа.");
            } else if (lastAction === "check_out" && totalMinutes >= limit) {
                this._showError("Може да направите Check In само преди 15:00!");
                this._speak("Може да направите Check In само преди петнадесет часа.");
            }
        },

        _showError: function (message) {
            this.$('.o_hr_attendance_message')
                .text(message)
                .removeClass('text-success')
                .addClass('text-danger');
        },

        _speak: function (message) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(message);
                utterance.lang = 'bg-BG';
                speechSynthesis.speak(utterance);
            }
        },
    });
});
