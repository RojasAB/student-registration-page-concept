from flask import Flask, request, Response, jsonify, render_template
from util.dbUtil import DBUtil
from common import http, message
from common.api import QueryParam, Endpoint, MimeType
from model.student_model import Student
from livereload import Server
import model.student_model as student_model
import json
import util.studentUtil as studentUtil


app = Flask(__name__)
dbUtil = DBUtil()


@app.route('/')
def init_page():
    return render_template('index.html')


@app.route(Endpoint.STUDENTS, methods=[http.GET])
def student_get_all():
    limit = request.args.get(QueryParam.LIMIT)
    offset = request.args.get(QueryParam.OFFSET)
    criteria = request.args.get(QueryParam.CRITERIA)
    if limit is None and offset is None:
        rows = dbUtil.get_all_students()
    else:
        if criteria is not None:
            num = -1;
            if criteria.isdigit():
                num = int(criteria)
            rows = dbUtil.get_students_by_pagination(criteria, num, limit, offset)
        else:
            if limit is None:
                limit = 1
            if offset is None:
                offset = 0
            rows = dbUtil.get_all_students_by_pagination(limit, offset)
    arr_students = []
    for row in rows:
        arr_students.append(studentUtil.map_student(row))
    return jsonify(arr_students)


@app.route(Endpoint.STUDENTS, methods=[http.POST])
def student_insert():
    content = request.data
    student = json.loads(content, object_hook=lambda obj: student_model.json_decoder(obj))
    row = dbUtil.get_students_by_registration(student.registration)
    if row is not None:
        return Response(message.EMPTY, status=409, mimetype=MimeType.APPLICATION_JSON)
    dbUtil.insert_student(student)
    return Response(message.EMPTY, status=201, mimetype=MimeType.APPLICATION_JSON)


@app.route(Endpoint.STUDENTS + Endpoint.ID_PATH, methods=[http.PUT])
def student_update(id):
    content = request.data
    student = json.loads(content, object_hook=lambda obj: student_model.json_decoder(obj))
    row = dbUtil.get_students_by_registration(id)
    if row is None:
        return Response(message.EMPTY, status=404, mimetype=MimeType.APPLICATION_JSON)
    dbUtil.update_student(id, student)
    return Response(message.EMPTY, status=200, mimetype=MimeType.APPLICATION_JSON)


@app.route(Endpoint.STUDENTS + Endpoint.ID_PATH, methods=[http.DELETE])
def student_delete(id):
    row = dbUtil.get_students_by_registration(id)
    if row is None:
        return Response(message.EMPTY, status=404, mimetype=MimeType.APPLICATION_JSON)
    dbUtil.delete_student_by_registration(id)
    return Response(message.EMPTY, status=200, mimetype=MimeType.APPLICATION_JSON)


def student_data_mock():
    dbUtil.insert_student(Student(1, 'john', 'jh345@e.com', '1990-01-21', 'hometown1', 22.5))
    dbUtil.insert_student(Student(2, 'susana', 'ss22@e.com', '1990-02-11', 'hometown2', 21.5))
    dbUtil.insert_student(Student(3, 'manuel', 'm23@e.com', '1990-02-04', 'hometown3', 2.5))


if __name__ == '__main__':
    dbUtil.create_table_students()
    student_data_mock()
    # app.run(host='0.0.0.0', port='8088')
    server = Server(app.wsgi_app)
    server.serve(host='0.0.0.0', port=8088)

