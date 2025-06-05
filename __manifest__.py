{
    'name': 'HR Attendance Kiosk Time Limit 1.0',
    'version': '1.0',
    'summary': 'Ограничения по време за Check In/Out в Kiosk режима',
    'category': 'Human Resources',
    'depends': ['hr_attendance'],
    'assets': {
        'web.assets_frontend': [
            'hr_attendance_kiosk_time_limit/static/src/js/kiosk_patch.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
