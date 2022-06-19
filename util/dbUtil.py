import sqlite3
from model.student_model import Student


# A class that provides configuration to setup and manipulate DB of the final project
class DBUtil:
    __DB_NAME = 'finalProject.db'
    __DROP_IF_EXISTS_STUDENTS = '''DROP Table IF EXISTS Students'''
    __CREATE_TABLE_STUDENTS = '''CREATE TABLE Students(
                                    registration INTEGER NOT NULL PRIMARY KEY,
                                    name TEXT NOT NULL,
                                    email TEXT NOT NULL,
                                    dBirth TEXT NOT NULL,
                                    hometown TEXT NOT NULL,
                                    score REAL NOT NULL)
                                '''
    __INSERT_STUDENT_QUERY = '''INSERT OR IGNORE INTO Students
                                    (registration, name, email, dBirth, hometown, score) 
                                    VALUES(?, ?, ?, date(?), ?, ?)
                                '''
    __DELETE_STUDENT_QUERY = '''DELETE FROM Students
                                WHERE registration = ?
                                '''
    __GET_STUDENT_BY_ID_QUERY = '''SELECT * FROM Students
                                WHERE registration = ? ORDER BY registration
                            '''
    __GET_ALL_STUDENTS_QUERY = '''SELECT * FROM Students ORDER BY registration
                                '''
    __GET_ALL_STUDENTS_PAGING_QUERY = '''SELECT * FROM Students ORDER BY registration
                                            LIMIT ? OFFSET ? 
                                        '''
    __GET_STUDENTS_PAGING_QUERY = '''SELECT DISTINCT * FROM Students 
                                            WHERE registration = ? OR
                                                  name like ? OR 
                                                  email like ? OR 
                                                  dBirth = ? OR 
                                                  hometown like ? OR 
                                                  score = ?
                                            ORDER BY score, name DESC                                            
                                            LIMIT ? OFFSET ? 
                                            '''
    __UPDATE_STUDENT_QUERY = '''UPDATE Students 
                                    SET registration = ?, name = ?, email = ?, dBirth = ?, hometown = ?, score = ?
                                    WHERE registration = ?
                                '''

    def __get_connection(self):
        return sqlite3.connect(self.__DB_NAME)

    def create_table_students(self):
        db = self.__get_connection()
        cur = db.cursor()
        cur.execute(self.__DROP_IF_EXISTS_STUDENTS)
        cur.execute(self.__CREATE_TABLE_STUDENTS)
        cur.close()
        db.commit()
        db.close()

    def insert_student(self, student: Student):
        db = self.__get_connection()
        cur = db.cursor()
        cur.execute(self.__INSERT_STUDENT_QUERY,
                    (student.registration,
                     student.name,
                     student.email,
                     student.dBirth,
                     student.hometown,
                     student.score,))
        cur.close()
        db.commit()
        db.close()

    def update_student(self, id,  student: Student):
        db = self.__get_connection()
        cur = db.cursor()
        cur.execute(self.__UPDATE_STUDENT_QUERY,
                    (student.registration,
                     student.name,
                     student.email,
                     student.dBirth,
                     student.hometown,
                     student.score,
                     id))
        cur.close()
        db.commit()
        db.close()

    def delete_student_by_registration(self, registration: int):
        db = self.__get_connection()
        cur = db.cursor()
        cur.execute(self.__DELETE_STUDENT_QUERY,
                    (registration,))
        self.__db_commit_and_close(db)

    def get_students_by_registration(self, registration: int):
        db = self.__get_connection()
        cur = db.cursor()
        cur.execute(self.__GET_STUDENT_BY_ID_QUERY,
                    (registration,))
        return cur.fetchone()

    def get_all_students(self):
        db = self.__get_connection()
        cur = db.cursor()
        cur.execute(self.__GET_ALL_STUDENTS_QUERY)
        return cur.fetchall()

    def get_all_students_by_pagination(self, limit=1, offset=0):
        db = self.__get_connection()
        cur = db.cursor()
        cur.execute(self.__GET_ALL_STUDENTS_PAGING_QUERY, (limit, offset))
        return cur.fetchall()

    def get_students_by_pagination(self, criteria, num, limit=1, offset=0):
        db = self.__get_connection()
        cur = db.cursor()
        cur.execute(self.__GET_STUDENTS_PAGING_QUERY, (num,
                                                       criteria,
                                                       criteria,
                                                       criteria,
                                                       criteria,
                                                       num,
                                                       limit,
                                                       offset))
        return cur.fetchall()

    def __db_commit_and_close(self, db):
        cur = db.cursor()
        db.commit()
        db.close()




