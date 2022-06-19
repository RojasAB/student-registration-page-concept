from model.student_model import Student

REGISTRATION_ID = 0
NAME = 1
EMAIL = 2
BIRTH_DATE = 3
HOMETOWN = 4
SCORE = 5

REGISTRATION_KEY = 'registration'
NAME_KEY = 'name'
EMAIL_KEY = 'email'
BIRTH_DATE_KEY = 'dBirth'
HOMETOWN_KEY = 'hometown'
SCORE_KEY = 'score'


# map student row from DB into a Student json object
def map_student(arr_data):
    return {
        REGISTRATION_KEY: arr_data[REGISTRATION_ID],
        NAME_KEY: arr_data[NAME],
        EMAIL_KEY: arr_data[EMAIL],
        BIRTH_DATE_KEY: arr_data[BIRTH_DATE],
        HOMETOWN_KEY: arr_data[HOMETOWN],
        SCORE_KEY: arr_data[SCORE]
    }
