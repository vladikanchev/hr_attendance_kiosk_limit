odoo.define('hr_attendance_kiosk_time_limit.kiosk_patch', function (require) {
    "use strict";

    var KioskMode = require('hr_attendance.kiosk_mode');

    KioskMode.include({
        _onBarcodeScanned: async function (barcode) {
            const now = new Date();
            const hour = now.getHours();
            const minute = now.getMinutes();
            const totalMinutes = hour * 60 + minute;
            const limit = 15 * 60; // 15:00 = 900 минути

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
