from collections import namedtuple

def json_decoder(student_dic):
    return namedtuple('Student', student_dic.keys())(*student_dic.values())


# A class to model student object from DB
class Student:
    __registration: int
    __name: str
    __email: str
    __dBirth: str
    __hometown: str
    __score: float

    def __init__(self,
                 registration: int = None,
                 name: str = None,
                 email: str = None,
                 dBirth: str = None,
                 hometown: str = None,
                 score: float = None):
        self.__registration = registration
        self.__name = name
        self.__email = email
        self.__dBirth = dBirth
        self.__hometown = hometown
        self.__score = score

    @property
    def registration(self):
        return self.__registration

    @registration.setter
    def registration(self, registration: int):
        self.__registration = registration

    @property
    def name(self):
        return self.__name

    @name.setter
    def name(self, name: str):
        self.__name = name

    @property
    def email(self):
        return self.__email

    @email.setter
    def email(self, email: str):
        self.__email = email

    @property
    def dBirth(self):
        return self.__dBirth

    @dBirth.setter
    def dBirth(self, dBirth: str):
        self.__dBirth = dBirth

    @property
    def hometown(self):
        return self.__hometown

    @hometown.setter
    def hometown(self, hometown: str):
        self.__hometown = hometown

    @property
    def score(self):
        return self.__score

    @score.setter
    def score(self, score: float):
        self.__score = score




